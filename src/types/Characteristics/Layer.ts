import type { Player } from "../GameObject/Player.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Color } from "./Color.js";
import type { CardType } from "./CardType.js";
import type { Subtype } from "./Subtype.js";
import type { Supertype } from "./Supertype.js";
import type { SingleSpec, MultiSpec } from "../Query.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type { Characteristics, CopiableValue } from "./Characteristic.js";

/** 単一の常在型能力からの継続的効果または呪文や能力の解決によって生成された単一の継続的効果
 * の中に含まれる、各種類別の効果 */
export type LayerOrder =
    | "1a" // コピー可能な効果の適用
    | "1b" // 裏向きによる特性変更
    | "2" // コントロール変更
    | "3" // 文章変更
    | "4" // タイプ変更
    | "5" // 色変更
    | "6" // 能力変更
    | "7a" // パワー・タフネスの特性定義能力
    | "7b" // 基本のパワー・タフネスの変更
    | "7c" // パワー・タフネスの修整
    | "7d"; // パワーとタフネスの入れ替え

export type Layer<T extends LayerOrder> = T extends "1a"
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

// FIXME: affectedが引数に必要
type Layer1a = {
    affected: MultiSpec<GameObject>;
    copyableValueAltering: SingleSpec<CopiableValue>;
};
type Layer1b = {
    affected: MultiSpec<GameObject>;
    copyableValueAltering: SingleSpec<CopiableValue>;
};
type Layer2 = {
    affected: MultiSpec<GameObject>;
    controllerAltering: SingleSpec<Player>;
};
type Layer3 = {
    affected: MultiSpec<GameObject>;
    textAltering: any; // FIXME: any
};
type Layer4 = {
    affected: MultiSpec<GameObject>;
    typeAltering: (
        affected: Characteristics,
        source?: GameObject
    ) => {
        cardType: MultiSpec<CardType> | undefined;
        subtype: MultiSpec<Subtype> | undefined;
        supertype: MultiSpec<Supertype> | undefined;
    };
};
type Layer5 = {
    affected: MultiSpec<GameObject>;
    colorAltering: MultiSpec<Color>;
};
type Layer6 = {
    affected: MultiSpec<GameObject>;
    abilityAltering: MultiSpec<Ability>;
};
type Layer7a = {
    affected: MultiSpec<GameObject>;
    ptAltering: SingleSpec<{ power: any; toughness: any }>; // FIXME: any
};
type Layer7b = {
    affected: MultiSpec<GameObject>;
    ptAltering: SingleSpec<{ basePower: any; baseToughness: any }>; // FIXME: any
};
type Layer7c = {
    affected: MultiSpec<GameObject>;
    ptAltering: SingleSpec<{ modifyPower: any; modifyToughness: any }>; // FIXME: any
};
type Layer7d = {
    affected: MultiSpec<GameObject>;
};
