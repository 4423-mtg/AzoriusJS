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
import {
    applyLayers,
    layerCategories,
    type AnyLayer,
    type Layer,
    type LayerCategory,
} from "../Characteristics/Layer/Layer.js";
import { sortLayers } from "../Characteristics/Layer/resolveLayer.js";

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

/** Gameを次のGameStateに進める。 */
export function incrementGameState(game: Game): void {
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
    instructions: Instruction[], // 実行後、gameの最新のstateのinstructionになる
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
    const currentEntry = game.history.at(-1);
    if (currentEntry === undefined) {
        throw new Error();
    }
    const currentState = currentEntry.state;

    // すべての特性変更効果
    const effects = currentState.objects.filter((o) =>
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
    const ret = applyLayers(layerQueue, game);

    // 特性を Game にセットする
    currentEntry.state.objects.forEach((_obj1) => {
        _obj1.characteristics =
            ret.find(({ object: _obj2 }) => _obj2.objectId === _obj1.objectId)
                ?.characteristics ?? _obj1.printed; // FIXME: GameObject.printed
    });
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
        return applyLayers(queue, game).some(({ characteristics }) => {
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
    const sorted = sortLayers(ls, game);
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
