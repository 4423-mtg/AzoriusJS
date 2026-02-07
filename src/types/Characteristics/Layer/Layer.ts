import { resolveMultiSpec, type MultiSpec } from "../../Query/QueryFunction.js";
import type { GameObject } from "../../GameObject/GameObject.js";
import type { Characteristics } from "../Characteristic.js";
import type { CharacteristicsAlteringEffect } from "../../GameObject/GeneratedEffect/ContinuousEffect.js";
import type { Game } from "../../GameState/Game.js";
import { compareTimestamp } from "../../GameState/Timestamp.js";

import { isLayer1a, isLayer1b, type Layer1a, type Layer1b } from "./Layer1.js";
import { isLayer2, type Layer2 } from "./Layer2.js";
import { isLayer3, type Layer3 } from "./Layer3.js";
import { isLayer4, type Layer4 } from "./Layer4.js";
import { isLayer5, type Layer5 } from "./Layer5.js";
import { isLayer6, type Layer6 } from "./Layer6.js";
import {
    isLayer7a,
    isLayer7b,
    isLayer7c,
    isLayer7d,
    type Layer7a,
    type Layer7b,
    type Layer7c,
    type Layer7d,
} from "./Layer7.js";
import {
    isGameObjectQuery,
    isPlayerQuery,
    type GameObjectQuery,
    type PlayerQuery,
    type QueryParameter,
} from "../../Query/Query.js";

// 単一の常在型能力からの継続的効果または呪文や能力の解決によって生成された単一の継続的効果の中に含まれる、各種類別の効果

// ================================================================
// MARK: 型定義
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
export function isLayerCategory(arg: unknown): arg is LayerCategory {
    return (
        typeof arg === "string" &&
        (layerCategories as readonly string[]).includes(arg)
    );
}

// ---------------------------------------------------------------
export type LayerCommonProperty = {
    type: LayerCategory;
};
export function isLayerCommonProperty<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is LayerCommonProperty {
    return (
        typeof arg === "object" &&
        arg !== null &&
        "type" in arg &&
        isLayerCategory(arg.type) &&
        "affected" in arg &&
        (isGameObjectQuery(parameters, arg.affected) ||
            isPlayerQuery(parameters, arg.affected))
    );
}

/** 種類別に対応するレイヤー */
export type Layer<
    T extends LayerCategory,
    U extends QueryParameter,
> = T extends "1a"
    ? Layer1a<U>
    : U extends "1b"
    ? Layer1b<U>
    : U extends "2"
    ? Layer2<U>
    : U extends "3"
    ? Layer3<U>
    : U extends "4"
    ? Layer4<U>
    : U extends "5"
    ? Layer5<U>
    : U extends "6"
    ? Layer6<U>
    : U extends "7a"
    ? Layer7a<U>
    : U extends "7b"
    ? Layer7b<U>
    : U extends "7c"
    ? Layer7c<U>
    : U extends "7d"
    ? Layer7d<U>
    : never;
export function isLayer<T extends LayerCategory, U extends QueryParameter>(
    arg: unknown,
    category: T,
    parameter: U,
): arg is Layer<T, U> {
    switch (category) {
        case "1a":
            return isLayer1a(parameter, arg);
        case "1b":
            return isLayer1b(parameter, arg);
        case "2":
            return isLayer2(parameter, arg);
        case "3":
            return isLayer3(parameter, arg);
        case "4":
            return isLayer4(parameter, arg);
        case "5":
            return isLayer5(parameter, arg);
        case "6":
            return isLayer6(parameter, arg);
        case "7a":
            return isLayer7a(parameter, arg);
        case "7b":
            return isLayer7b(parameter, arg);
        case "7c":
            return isLayer7c(parameter, arg);
        case "7d":
            return isLayer7d(parameter, arg);
        default:
            throw new TypeError(category);
    }
}

/** 任意のレイヤー */
export type AnyLayer<T extends QueryParameter> =
    | Layer1a<T>
    | Layer1b<T>
    | Layer2<T>
    | Layer3<T>
    | Layer4<T>
    | Layer5<T>
    | Layer6<T>
    | Layer7a<T>
    | Layer7b<T>
    | Layer7c<T>
    | Layer7d<T>;
export function isAnyLayer<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is AnyLayer<T> {
    return (
        isLayer1a(parameter, arg) ||
        isLayer1b(parameter, arg) ||
        isLayer2(parameter, arg) ||
        isLayer3(parameter, arg) ||
        isLayer4(parameter, arg) ||
        isLayer5(parameter, arg) ||
        isLayer6(parameter, arg) ||
        isLayer7a(parameter, arg) ||
        isLayer7b(parameter, arg) ||
        isLayer7c(parameter, arg) ||
        isLayer7d(parameter, arg)
    );
}

// =================================================================
// MARK: レイヤーの適用
function _applyLayer<T extends QueryParameter>(
    layer: AnyLayer<T>,
    game: Game,
    // 現在の特性
    characteristics: {
        object: GameObject;
        characteristics: Characteristics;
    }[],
): {
    object: GameObject;
    characteristics: Characteristics;
}[] {
    const latest = game.history.at(-1);
    if (latest === undefined) {
        throw new Error();
    }
    const affected = resolveMultiSpec(layer.affected, {
        game: game,
        self: undefined, // FIXME: 特性に関してはcharacteristicsから取る必要がある
    }); // FIXME: self

    // TODO:
    return [];
}

/** Gameの最新の状態に対してレイヤーを適用し、各オブジェクトの特性を得る。このときGameは変更しない。 */
export function applyLayers<T extends QueryParameter>(
    layers: AnyLayer<T>[],
    game: Game,
): {
    object: GameObject;
    characteristics: Characteristics;
}[] {
    let ret: ReturnType<typeof applyLayers> = [];
    for (const _layer of layers) {
        ret = _applyLayer(_layer, game, ret);
    }
    return ret;
}

// =================================================================
// MARK: レイヤーの解決
export function applyLayerEffect() {
    // FIXME:
}

type EffectAndLayer<T extends LayerCategory, U extends QueryParameter> = {
    effect: CharacteristicsAlteringEffect<U>;
    layer: Layer<T, U>;
};

/** レイヤーの適用順を決定する。 */ // TODO: 実装
export function sortLayers<T extends LayerCategory, U extends QueryParameter>(
    args: EffectAndLayer<T, U>[],
    game: Game,
): typeof args {
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

    const stack: EffectAndLayer<T, U>[] = []; // 適用順
    let latestStacked: EffectAndLayer<T, U>[] = [];
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
        const loops: EffectAndLayer<T, U>[][] = _getDependencyLoops(
            unstacked,
            game,
        ); // FIXME: gameにstack内のレイヤーを仮適用した状態での依存関係を見る
        if (loops.length > 0) {
            const loop1 = loops.at(0) as EffectAndLayer<T, U>[];
            // そのループ自身およびそのループと同じ要素を持つすべてのループからすべての要素を取り出し、重複を削除する
            const effects: EffectAndLayer<T, U>[] = new Set<
                EffectAndLayer<T, U>
            >([
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

function _getDependencyLoops<T extends LayerCategory, U extends QueryParameter>(
    args: EffectAndLayer<T, U>[],
    game: Game,
): EffectAndLayer<T, U>[][] {
    // FIXME: getDependencies を使って書き直す
    // 再帰的に探索する
    function _step(
        arg: EffectAndLayer<T, U>, // 探索起点
        args: EffectAndLayer<T, U>[], // 探索範囲
        _stack: EffectAndLayer<T, U>[],
    ): EffectAndLayer<T, U>[][] {
        return args
            .filter((_a) => isDependingOn(arg, _a, game))
            .map((_a): EffectAndLayer<T, U>[][] => {
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

export function isDependingOn<
    T extends QueryParameter,
    U extends LayerCategory,
>(
    layer1: { effect: CharacteristicsAlteringEffect; layer: Layer<T, U> },
    layer2: { effect: CharacteristicsAlteringEffect; layer: Layer<T, U> },
    game: Game,
): boolean {
    if (layer1 === layer2) {
        return false;
    } else {
        // TODO:

        return false;
    }
}

function _getDependencies<T extends QueryParameter>(
    layers: EffectAndLayer<T>[],
    game: Game,
): { depending: EffectAndLayer<T>; depended: EffectAndLayer<T> }[] {
    return layers.flatMap((_a1) =>
        layers
            .filter((_a2) => isDependingOn(_a1, _a2, game))
            .map((_a2) => ({ depending: _a1, depended: _a2 })),
    );
}
