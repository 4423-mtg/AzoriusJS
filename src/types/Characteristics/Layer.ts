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
    ? Layer7d // FIXME: フロート表示が {layerOrder;affected} になるのがいまいち
    : never;
export function isLayer<T extends LayerCategory>(
    arg: unknown,
    type: T
): arg is Layer<T> {
    return (
        typeof arg === "object" &&
        arg !== null &&
        "type" in arg &&
        arg.type === type
    );
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

/** コピー可能な効果の適用 */
export type Layer1a = {
    type: "1a";
    affected: MultiSpec<GameObject>;
    copyableValueAltering: (
        current: Characteristics,
        source?: GameObject
    ) => SingleSpec<CopiableValue>;
};
export function isLayer1a(arg: unknown): arg is Layer1a {
    return isLayer(arg, "1a");
}

/** 裏向きによる特性変更 */
export type Layer1b = {
    type: "1b";
    affected: MultiSpec<GameObject>;
    copyableValueAltering: (
        current: Characteristics,
        source?: GameObject
    ) => SingleSpec<CopiableValue>;
};
export function isLayer1b(arg: unknown): arg is Layer1b {
    return isLayer(arg, "1b");
}

/** コントロール変更 */
export type Layer2 = {
    type: "2";
    affected: MultiSpec<GameObject>;
    controllerAltering: (
        current: Characteristics,
        source?: GameObject
    ) => SingleSpec<Player>;
};
export function isLayer2(arg: unknown): arg is Layer2 {
    return isLayer(arg, "2");
}

/** 文章変更 */
export type Layer3 = {
    type: "3";
    affected: MultiSpec<GameObject>;
    textAltering: (current: Characteristics, source?: GameObject) => any; // FIXME: 文章の型
};
export function isLayer3(arg: unknown): arg is Layer3 {
    return isLayer(arg, "3");
}

/** タイプ変更 */
export type Layer4 = {
    type: "4";
    affected: MultiSpec<GameObject>;
    typeAltering: (
        current: Characteristics,
        source?: GameObject
    ) => CardTypeSet;
};
export function isLayer4(arg: unknown): arg is Layer4 {
    return isLayer(arg, "4");
}

/** 色変更 */
export type Layer5 = {
    type: "5";
    affected: MultiSpec<GameObject>;
    colorAltering: (
        current: Characteristics,
        source?: GameObject
    ) => MultiSpec<Color>;
};
export function isLayer5(arg: unknown): arg is Layer5 {
    return isLayer(arg, "5");
}

/** 能力変更 */
export type Layer6 = {
    type: "6";
    affected: MultiSpec<GameObject>;
    abilityAltering: (
        current: Characteristics,
        source?: GameObject
    ) => MultiSpec<Ability>;
};
export function isLayer6(arg: unknown): arg is Layer6 {
    return isLayer(arg, "6");
}

/** パワー・タフネスを定義する特性定義能力 */
export type Layer7a = {
    type: "7a";
    affected: MultiSpec<GameObject>;
    ptAltering: (
        current: Characteristics,
        source?: GameObject
    ) => SingleSpec<{ power: number; toughness: number }>;
};
export function isLayer7a(arg: unknown): arg is Layer7a {
    return isLayer(arg, "7a");
}

/** 基本のパワー・タフネスの変更 */
export type Layer7b = {
    type: "7b";
    affected: MultiSpec<GameObject>;
    ptAltering: (
        current: Characteristics,
        source?: GameObject
    ) => SingleSpec<{ basePower: number; baseToughness: number }>;
};
export function isLayer7b(arg: unknown): arg is Layer7b {
    return isLayer(arg, "7b");
}

/** パワー・タフネスの修整 */
export type Layer7c = {
    type: "7c";
    affected: MultiSpec<GameObject>;
    ptAltering: (
        current: Characteristics,
        source?: GameObject
    ) => SingleSpec<{ modifyPower: number; modifyToughness: number }>;
};
export function isLayer7c(arg: unknown): arg is Layer7c {
    return isLayer(arg, "7c");
}

/** パワーとタフネスの入れ替え */
export type Layer7d = {
    type: "7d";
    affected: MultiSpec<GameObject>;
};
export function isLayer7d(arg: unknown): arg is Layer7d {
    return isLayer(arg, "7d");
}

// =================================================================
