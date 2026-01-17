import type { Player } from "../GameObject/Player.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Color } from "./Color.js";
import type { SingleSpec, MultiSpec } from "../Query.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type {
    CardTypeSet,
    Characteristics,
    CopiableValue,
} from "./Characteristic.js";
import type { CharacteristicsAlteringEffect } from "../GameObject/GeneratedEffect/ContinuousEffect.js";
import type { Game } from "../GameState/Game.js";
import { compareTimestamp } from "../GameState/Timestamp.js";

// 単一の常在型能力からの継続的効果または呪文や能力の解決によって生成された単一の継続的効果の中に含まれる、各種類別の効果

/** 種類別 */
export const layerCategories = [
    "1a", // コピー可能な効果の適用
    "1b", // 裏向きによる特性変更
    "2", // コントロール変更
    "3", // 文章変更
    "4", // タイプ変更
    "5", // 色変更
    "6", // 能力変更
    "7a", // パワー・タフネスの特性定義能力
    "7b", // 基本のパワー・タフネスの変更
    "7c", // パワー・タフネスの修整
    "7d", // パワーとタフネスの入れ替え
] as const;

/** 種類別 */
export type LayerCategory = (typeof layerCategories)[number];

// ---------------------------------------------------------------
/** 種類別に対応するレイヤー */
export type Layer<T extends LayerCategory> = T extends "1a"
    ? Layer1a
    : T extends "1b"
    ? Layer1b
    : T extends "2"
    ? Layer2
    : T extends "3"
    ? Layer3
    : T extends "4"
    ? Layer4
    : T extends "5"
    ? Layer5
    : T extends "6"
    ? Layer6
    : T extends "7a"
    ? Layer7a
    : T extends "7b"
    ? Layer7b
    : T extends "7c"
    ? Layer7c
    : T extends "7d"
    ? Layer7d
    : never;
/** 型ガード */
export function isLayer<T extends LayerCategory>(
    arg: unknown,
    category: T,
): arg is Layer<T> {
    switch (category) {
        case "1a":
            return isLayer1a(arg);
        case "1b":
            return isLayer1b(arg);
        case "2":
            return isLayer2(arg);
        case "3":
            return isLayer3(arg);
        case "4":
            return isLayer4(arg);
        case "5":
            return isLayer5(arg);
        case "6":
            return isLayer6(arg);
        case "7a":
            return isLayer7a(arg);
        case "7b":
            return isLayer7b(arg);
        case "7c":
            return isLayer7c(arg);
        case "7d":
            return isLayer7d(arg);
        default:
            throw new Error(category);
    }
}

export type AnyLayer =
    | Layer1a
    | Layer1b
    | Layer2
    | Layer3
    | Layer4
    | Layer5
    | Layer6
    | Layer7a
    | Layer7b
    | Layer7c
    | Layer7d;
export function isAnyLayer(arg: unknown): arg is AnyLayer {
    return (
        isLayer1a(arg) ||
        isLayer1b(arg) ||
        isLayer2(arg) ||
        isLayer3(arg) ||
        isLayer4(arg) ||
        isLayer5(arg) ||
        isLayer6(arg) ||
        isLayer7a(arg) ||
        isLayer7b(arg) ||
        isLayer7c(arg) ||
        isLayer7d(arg)
    );
}

// ======================================================
// MARK: 1a
/** コピー可能な効果の適用 */
export type Layer1a = {
    type: "1a";
    affected: MultiSpec<GameObject>;
    copyableValueAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<CopiableValue>; // FIXME: 関数は型ガードが不可能...
};
export function isLayer1a(arg: unknown): arg is Layer1a {
    return isLayer(arg, "1a");
    // FIXME: 実装
}

// MARK: 1b
/** 裏向きによる特性変更 */
export type Layer1b = {
    type: "1b";
    affected: MultiSpec<GameObject>;
    copyableValueAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<CopiableValue>;
};
export function isLayer1b(arg: unknown): arg is Layer1b {
    return isLayer(arg, "1b");
    // FIXME: 実装
}

// MARK: 2
/** コントロール変更 */
export type Layer2 = {
    type: "2";
    affected: MultiSpec<GameObject>;
    controllerAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<Player>;
};
export function isLayer2(arg: unknown): arg is Layer2 {
    return isLayer(arg, "2");
    // FIXME: 実装
}

// MARK: 3
/** 文章変更 */
export type Layer3 = {
    type: "3";
    affected: MultiSpec<GameObject>;
    textAltering: (current: Characteristics, source?: GameObject) => any; // FIXME: 文章の型
};
export function isLayer3(arg: unknown): arg is Layer3 {
    return isLayer(arg, "3");
    // FIXME: 実装
}

// MARK: 4
/** タイプ変更 */
export type Layer4 = {
    type: "4";
    affected: MultiSpec<GameObject>;
    typeAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => CardTypeSet;
};
export function isLayer4(arg: unknown): arg is Layer4 {
    return isLayer(arg, "4");
    // FIXME: 実装
}

// MARK: 5
/** 色変更 */
export type Layer5 = {
    type: "5";
    affected: MultiSpec<GameObject>;
    colorAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => MultiSpec<Color>;
};
export function isLayer5(arg: unknown): arg is Layer5 {
    return isLayer(arg, "5");
    // FIXME: 実装
}

// MARK: 6
/** 能力変更 */
export type Layer6 = {
    type: "6";
    affected: MultiSpec<GameObject>;
    abilityAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => MultiSpec<Ability>;
};
export function isLayer6(arg: unknown): arg is Layer6 {
    return isLayer(arg, "6");
    // FIXME: 実装
}

// MARK: 7a
/** パワー・タフネスを定義する特性定義能力 */
export type Layer7a = {
    type: "7a";
    affected: MultiSpec<GameObject>;
    ptAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<{ power: number; toughness: number }>;
};
export function isLayer7a(arg: unknown): arg is Layer7a {
    return isLayer(arg, "7a");
    // FIXME: 実装
}

// MARK: 7b
/** 基本のパワー・タフネスの変更 */
export type Layer7b = {
    type: "7b";
    affected: MultiSpec<GameObject>;
    ptAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<{ basePower: number; baseToughness: number }>;
};
export function isLayer7b(arg: unknown): arg is Layer7b {
    return isLayer(arg, "7b");
    // FIXME: 実装
}

// MARK: 7c
/** パワー・タフネスの修整 */
export type Layer7c = {
    type: "7c";
    affected: MultiSpec<GameObject>;
    ptAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<{ modifyPower: number; modifyToughness: number }>;
};
export function isLayer7c(arg: unknown): arg is Layer7c {
    return isLayer(arg, "7c");
    // FIXME: 実装
}

// MARK: 7d
/** パワーとタフネスの入れ替え */
export type Layer7d = {
    type: "7d";
    affected: MultiSpec<GameObject>;
};
export function isLayer7d(arg: unknown): arg is Layer7d {
    return isLayer(arg, "7d");
    // FIXME: 実装
}

// =================================================================
export function applyLayerEffect(params: type) {
    // FIXME:
}

type EffectAndLayer<T extends LayerCategory = LayerCategory> = {
    effect: CharacteristicsAlteringEffect;
    layer: Layer<T>;
};

/** レイヤーの適用順を決定する。 */ // TODO: 実装
export function sortLayers(args: EffectAndLayer[], game: Game): typeof args {
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
            _getDependencies(unstacked, game) // FIXME: gameにstack内のレイヤーを仮適用した状態での依存関係を見る
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

export function isDependingOn<T extends LayerCategory>(
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

function _getDependencies(
    layers: EffectAndLayer[],
    game: Game,
): { depending: EffectAndLayer; depended: EffectAndLayer }[] {
    return layers.flatMap((_a1) =>
        layers
            .filter((_a2) => isDependingOn(_a1, _a2, game))
            .map((_a2) => ({ depending: _a1, depended: _a2 })),
    );
}
