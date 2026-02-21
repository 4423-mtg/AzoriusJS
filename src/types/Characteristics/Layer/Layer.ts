import type { Game } from "../../GameState/Game.js";

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
import { type QueryParameter } from "../../Query/QueryParameter.js";

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

// ---------------------------------------------------------------
export type LayerCommonProperty = {
    type: LayerCategory;
};

/** 種類別に対応するレイヤー */
export type Layer<
    T extends LayerCategory,
    U extends QueryParameter = QueryParameter,
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

/** 任意のレイヤー */
export type AnyLayer<T extends QueryParameter = QueryParameter> =
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

// =================================================================
// MARK: レイヤーの適用
/** Gameの最新の状態に対してレイヤーを適用し、各オブジェクトの特性をセットする。 */
function applyLayer(game: Game, layer: AnyLayer): void {
    const latestEntry = game.history.at(-1);
    if (latestEntry === undefined) {
        throw new Error();
    }
    const latestState = latestEntry.state;

    // latestState.objects.filter();

    // TODO:
}

// =========================================================================
// MARK: 型ガード
export function isLayerCategory(arg: unknown): arg is LayerCategory {
    return (
        typeof arg === "string" &&
        (layerCategories as readonly string[]).includes(arg)
    );
}
export function isLayerCommonProperty(
    arg: unknown,
): arg is LayerCommonProperty {
    return (
        typeof arg === "object" &&
        arg !== null &&
        "type" in arg &&
        isLayerCategory(arg.type)
    );
}
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
            throw new TypeError(category);
    }
}
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
