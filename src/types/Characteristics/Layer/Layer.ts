import type { GameObject } from "../../GameObject/GameObject.js";
import type { Characteristics } from "../Characteristic.js";
import type { CharacteristicsAlteringEffectProperty } from "../../GameObject/GeneratedEffect/ContinuousEffect.js";
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
import { type QueryParameter } from "../../Query/Query.js";

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
            return isLayer1a(arg, parameter);
        case "1b":
            return isLayer1b(arg, parameter);
        case "2":
            return isLayer2(arg, parameter);
        case "3":
            return isLayer3(arg, parameter);
        case "4":
            return isLayer4(arg, parameter);
        case "5":
            return isLayer5(arg, parameter);
        case "6":
            return isLayer6(arg, parameter);
        case "7a":
            return isLayer7a(arg, parameter);
        case "7b":
            return isLayer7b(arg, parameter);
        case "7c":
            return isLayer7c(arg, parameter);
        case "7d":
            return isLayer7d(arg, parameter);
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
        isLayer1a(arg, parameter) ||
        isLayer1b(arg, parameter) ||
        isLayer2(arg, parameter) ||
        isLayer3(arg, parameter) ||
        isLayer4(arg, parameter) ||
        isLayer5(arg, parameter) ||
        isLayer6(arg, parameter) ||
        isLayer7a(arg, parameter) ||
        isLayer7b(arg, parameter) ||
        isLayer7c(arg, parameter) ||
        isLayer7d(arg, parameter)
    );
}

// =================================================================
// MARK: レイヤーの適用
function _isAffected(
    affected: CharacteristicsAlteringEffectProperty["affected"],
): boolean {
    return false;
}

/** `Game`の最新の`GameState`にレイヤーを適用し、特性を変化させる。 */
function _applyLayer<T extends QueryParameter>(
    game: Game,
    layer: AnyLayer<T>,
): void {
    const latestEntry = game.history.at(-1);
    if (latestEntry === undefined) {
        throw new Error();
    }
    const latestState = latestEntry.state;

    // latestState.objects.filter();

    // TODO:
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
