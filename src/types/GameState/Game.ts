import type { MatchInfo } from "./Match.js";
import {
    deepCopyGamestate,
    getNextInstructionsFromState,
    type GameState,
} from "./GameState.js";
import {
    getNextInstructionChain,
    type Instruction,
} from "../Instruction/Instruction.js";
import type { GameObjectId } from "../GameObject/GameObject.js";
import type { Card } from "../GameObject/Card/Card.js";
import type { Player } from "../GameObject/Player.js";
import {
    isAbility,
    isCharacteristicDefiningAbility,
    type Ability,
} from "../GameObject/Ability.js";
import {
    getLayer,
    isCharacteristicsAlteringEffect,
    type CharacteristicsAlteringEffect,
} from "../GameObject/GeneratedEffect/ContinuousEffect.js";
import type { Characteristics } from "../Characteristics/Characteristic.js";
import {
    layerCategories,
    type AnyLayer,
    type Layer,
    type LayerCategory,
} from "../Characteristics/Layer.js";
import { resolveMultiSpec } from "../Query.js";
import { compareTimestamp } from "./Timestamp.js";

// ==========================================================================
// MARK: Game
/** ゲーム全体。ゲームのすべての断面を持つ。 */
export type Game = {
    matchInfo: MatchInfo;
    history: HistoryEntry[];
};
/** ゲームの各瞬間を表す。`GameState`と、直前の状態からどのような操作をしたかを表す`Instruction`の組。 */
export type HistoryEntry = {
    state: GameState;
    instructions: Instruction[];
};

/** Gameを1つ進める。 */
export function goToNext(game: Game): void {
    const current = game.history.at(-1);
    if (current === undefined) {
        throw Error();
    } else {
        // 次のInstructionを得る
        const nextInstructions = _getNextInstructions(game);

        // Instructionを適用しつつ、historyに入れる
        applyInstruction(game, nextInstructions);
        // game.history.push({
        //     state: applyInstruction(current.state, nextInstructions),
        //     instructions: nextInstructions,
        // });
    }
}

// ======================================================================
// MARK: Instruction関連
// ======================================================================
/** ゲームの次の状態を得るのに必要な、次に行うべき`Instruction`を得る。
 * 最後に行われた instruction が完了状態なら、stateから取得する。
 * そうでないなら、instructionから続きを取得する。
 */
function _getNextInstructions(game: Game): Instruction[] {
    const current = game.history.at(-1);
    if (current === undefined) {
        throw new Error();
    } else {
        const _top = current.instructions[0];
        if (_top === undefined) {
            throw new Error("");
        } else {
            // 最後に行われた instruction が完了状態なら、stateから取得する。
            // そうでないなら、instructionから続きを取得する。
            return _top.completed
                ? getNextInstructionsFromState(current.state)
                : getNextInstructionChain(current.instructions);
        }
    }
}

/** 処理を1回実行する。 */
export function applyInstruction(
    game: Game,
    instructions: Instruction[],
): void {
    const current = game.history.at(-1);
    if (current === undefined) {
        throw new Error();
    } else {
        // (1) GameStateをコピーする。
        const newState = deepCopyGamestate(current.state);

        // (2) コピーした GameState に Instruction を適用する。 // TODO: 実装
        const instructionType = instructions.at(-1)?.type;
        // TODO: 各Instructionの定義の隣へ飛ばす
        // TODO: 置換効果等を考慮する
        switch (instructionType) {
            case "activate":
                break;
            case undefined:
                break;

            default:
                throw new Error(instructionType);
        }

        // (3) 特性を計算して最新の GameState に書き込む
        setAllCharacteristics(game);
    }
}

// ============================================================================
// MARK: 特性関連
// ============================================================================
/** 最新の GameState でのすべてのオブジェクトの特性を計算してセットする。 */
export function setAllCharacteristics(game: Game): void {
    const current = game.history.at(-1);
    if (current === undefined) {
        throw new Error();
    }

    // すべての特性変更効果
    const effects = current.state.objects.filter((o) =>
        isCharacteristicsAlteringEffect(o),
    );

    // 適用開始済み効果をメモするリスト
    const appliedEffects: GameObjectId[] = []; // FIXME: 重複しないのでSetにする
    // レイヤーを適用順に格納するキュー
    const layerQueue: AnyLayer[] = [];

    // 各種類別について
    for (const category of layerCategories) {
        // 特性定義能力からであるもの
        _pushToQueue(
            effects.filter((e) => isCharacteristicDefiningAbility(e.source)),
            category,
            layerQueue,
            appliedEffects,
            game,
        );
        // 特性定義能力からでないもの
        _pushToQueue(
            effects.filter((e) => !isCharacteristicDefiningAbility(e.source)),
            category,
            layerQueue,
            appliedEffects,
            game,
        );
    }

    // 各レイヤーを決定された順序で順番に適用し特性を得る
    const ret = _applyLayers(game, layerQueue);

    // 特性を Game にセットする
    for (const obj of current.state.objects) {
        const _chara = ret.find(
            ({ object: _obj }) => _obj.objectId === obj.objectId,
        );
        if (_chara !== undefined) {
            obj.characteristics = _chara.characteristics;
        } else {
            // TODO: 適用される継続的効果が特にない場合は印刷された特性を使う
        }
    }
}

/** 指定した効果の指定された種類別のレイヤーについて、依存関係とタイムスタンプにもとづいて適用順を決定してキューに入れる。 */
function _pushToQueue(
    effects: CharacteristicsAlteringEffect[],
    category: LayerCategory,
    queue: AnyLayer[],
    appliedEffect: GameObjectId[],
    game: Game,
) {
    /** 能力が無効化されているならTrue */
    const _isExist = (ability: Ability): boolean => {
        // ここまでのレイヤーを適用してみて、能力が無効化されていないか確認する
        return _applyLayers(game, queue).some(({ characteristics }) => {
            characteristics.abilities !== undefined &&
                characteristics.abilities.some((_a) => _a.id === ability.id);
        });
    };
    // 発生源が無効化されていない効果を抽出
    const validEffects = effects.filter(
        (e) => !(isAbility(e.source) && !_isExist(e.source)),
    );

    // 指定した種類別のレイヤーを取り出す
    const _dropUndefined = <T, U>(arg: {
        effect: T;
        layer: U;
    }): arg is {
        effect: T;
        layer: Exclude<U, undefined>;
    } => arg.layer !== undefined;
    const _take = <T extends LayerCategory>(
        arg: CharacteristicsAlteringEffect[],
        category: T,
    ): {
        effect: CharacteristicsAlteringEffect;
        layer: Layer<T>;
    }[] =>
        arg
            .map((_e) => ({ effect: _e, layer: getLayer(_e, category) }))
            .filter(_dropUndefined);
    let ls: _layers;
    switch (category) {
        case "1a":
            ls = _take(validEffects, category);
            break;
        case "1b":
            ls = _take(validEffects, category);
            break;
        case "2":
            ls = _take(validEffects, category);
            break;
        case "3":
            ls = _take(validEffects, category);
            break;
        case "4":
            ls = _take(validEffects, category);
            break;
        case "5":
            ls = _take(validEffects, category);
            break;
        case "6":
            ls = _take(validEffects, category);
            break;
        case "7a":
            ls = _take(validEffects, category);
            break;
        case "7b":
            ls = _take(validEffects, category);
            break;
        case "7c":
            ls = _take(validEffects, category);
            break;
        case "7d":
            ls = _take(validEffects, category);
            break;
        default:
            throw new Error(category);
    }
    ls;

    // 適用順を決定する
    const sorted = _sortLayers(game, ls);
    // キューに入れる
    sorted.forEach(({ effect, layer }) => {
        // レイヤーをキューに入れる
        queue.push(layer);
        // 継続的効果を適用済みとしてメモする
        if (!appliedEffect.includes(effect.objectId)) {
            appliedEffect.push(effect.objectId);
        }
    });
}

type _layers<T extends LayerCategory = LayerCategory> = T extends unknown
    ? { effect: CharacteristicsAlteringEffect; layer: Layer<T> }[]
    : never;

type EffectAndLayer<T extends LayerCategory = LayerCategory> = {
    effect: CharacteristicsAlteringEffect;
    layer: Layer<T>;
};

/** レイヤーの適用順を決定する。 */ // TODO: 実装
function _sortLayers(game: Game, args: EffectAndLayer[]): typeof args {
    // - すべての継続的効果をすべての順序で適用してみて、依存をチェックする
    //   - 適用順を決めるに当たってはそれ以前のレイヤーの影響がある
    // - 依存があってループしているならタイムスタンプ順で適用、ループしていないなら依存順で適用する。依存がないものはタイムスタンプ順で適用する
    //   - 適用順は1つ適用するごとに計算し直す

    // - Aを適用することによってBの影響が変わる場合、BはAに依存している。
    //   CがAやBに直接依存していないがA->Bと適用することによってCの影響が変わる場合、Cは何に依存しているのか？
    // - A:銀白の突然変異(対象のパーマネントはアーティファクトである)、B:機械の行進(アーティファクトはクリーチャーである)、C:秘技の順応(クリーチャーは指定したタイプである)
    //   - BはAに依存している。ほかはどれも依存していない
    //   - Aを適用
    //   - Cは(アーティファクトがある場合のみ)Bに依存する

    const stack: EffectAndLayer[] = []; // 適用順
    let latestStacked: EffectAndLayer[] = [];
    while (stack.length < args.length) {
        // まだ適用順の決定していないもの
        const unstacked = args.filter((_a) => !stack.includes(_a));
        // FIXME: どれから適用するかは任意ではなく、直前に適用した効果に依存しているものを優先的に適用を試みる。それがまだ他の効果にも依存していることもある
        // 例: A<-B, A<-C で、A適用によりB<-Cが依存するようになるケースはある
        // アーティファクトがない状況
        // A: あるパーマネントをアーティファクト化
        // B: すべてのアーティファクトをクリーチャー化
        // C: すべてのクリーチャーでないアーティファクトをエンチャント化し、すべてのアーティファクト・クリーチャーを土地化

        // 1. 依存性のループを取得し、ループしている場合はそれらをタイムスタンプ順で適用する。
        // ある効果が複数のループに関与している場合は、それらのループすべてに含まれるすべての効果をタイムスタンプ順で適用する
        const loops: EffectAndLayer[][] = _getDependencyLoops(unstacked, game); // FIXME: gameにstack内のレイヤーを仮適用した状態での依存関係を見る
        if (loops.length > 0) {
            const loop1 = loops.at(0) as EffectAndLayer[];
            // そのループ自身およびそのループと同じ要素を持つすべてのループからすべての要素を取り出し、重複を削除する
            const effects: EffectAndLayer[] = new Set<EffectAndLayer>([
                ...loop1,
                ...loops
                    .slice(1)
                    .filter((_loop) => _includesSameObject(loop1, _loop))
                    .flat(),
            ])
                .values()
                .toArray();
            // タイムスタンプ順でスタックに入れる
            effects
                .toSorted((e1, e2) =>
                    compareTimestamp(e1.effect.timestamp, e2.effect.timestamp),
                )
                .forEach((e) => stack.push(e));

            // 2. それらの効果にループではない依存をしている効果を直後に適用する。
            // このときに適用される効果が複数あるなら、それらはタイムスタンプに従う
            getDependencies(unstacked, game) // FIXME: gameにstack内のレイヤーを仮適用した状態での依存関係を見る
                .filter(
                    ({ depending, depended }) =>
                        effects.includes(depended) &&
                        !effects.includes(depending),
                )
                .map(({ depending }) => depending)
                .toSorted((e1, e2) =>
                    compareTimestamp(e1.effect.timestamp, e2.effect.timestamp),
                );

            continue;
        }

        // 3. 依存していないものを適用する。
        // TODO:
    }

    return stack;
    // 複数のオブジェクトが同時に領域に入る場合、コントローラーがそれらの相対的なタイムスタンプ順を自由に決定する
}

function _includesSameObject<T>(array1: T[], array2: T[]) {
    return array1.some((t1) => array2.some((t2) => t1 === t2));
}

function _getDependencyLoops(
    args: EffectAndLayer[],
    game: Game,
): EffectAndLayer[][] {
    // FIXME: getDependencies を使って書き直す
    // 再帰的に探索する
    function _step(
        arg: EffectAndLayer, // 探索起点
        args: EffectAndLayer[], // 探索範囲
        _stack: EffectAndLayer[],
    ): EffectAndLayer[][] {
        return args
            .filter((_a) => isDependingOn(arg, _a, game))
            .map((_a): EffectAndLayer[][] => {
                if (_stack.filter((_a2) => _a2 === _a).length > 0) {
                    return [[_a]];
                } else {
                    return _step(_a, args, [..._stack, _a]);
                }
            })
            .flat()
            .map((_array) => [arg, ..._array]);
    }

    // 全効果を起点として探索し、ループになっているものを返す
    return args
        .flatMap((_a) => _step(_a, args, [_a]))
        .filter((_array) => _array.at(0) === _array.at(-1));
}

function isDependingOn<T extends LayerCategory>(
    layer1: { effect: CharacteristicsAlteringEffect; layer: Layer<T> },
    layer2: { effect: CharacteristicsAlteringEffect; layer: Layer<T> },
    game: Game,
): boolean {
    if (layer1 === layer2) {
        return false;
    } else {
        // TODO:

        return false;
    }
}

function getDependencies(
    layers: EffectAndLayer[],
    game: Game,
): { depending: EffectAndLayer; depended: EffectAndLayer }[] {
    return layers.flatMap((_a1) =>
        layers
            .filter((_a2) => isDependingOn(_a1, _a2, game))
            .map((_a2) => ({ depending: _a1, depended: _a2 })),
    );
}

/** 与えられたレイヤーをGameStateに対して適用してみた場合の、各GameObjectの特性を得る。
 * なお、GameStateを変更はしない。
 */
export function _applyLayers( // TODO: 実装
    game: Game,
    layers: AnyLayer[],
): {
    object: Card | Player;
    characteristics: Characteristics;
}[] {
    // TODO: queryを解決しながら適用していく
    for (const layer of layers) {
        switch (layer.type) {
            case "1a":
                resolveMultiSpec(layer.affected, {
                    game: game,
                    self: undefined, // FIXME: selfとは?
                });
                layer.copyableValueAltering();
                break;
            case "1b":
                break;
            case "2":
                break;
            case "3":
                break;
            case "4":
                break;
            case "5":
                break;
            case "6":
                break;
            case "7a":
                break;
            case "7b":
                break;
            case "7c":
                break;
            case "7d":
                break;
            default:
                break;
        }
    }
}
