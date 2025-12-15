import type { Player } from "../../GameObject/Player.js";
import type { Ability, StaticAbility } from "../../GameObject/Ability.js";
import type { StackedAbility } from "../../GameObject/StackedAbility.js";
import type { Color } from "../Color.js";
import type { CardType } from "../CardType.js";
import type { Subtype } from "../Subtype.js";
import type { Supertype } from "../Supertype.js";
import { LayerType } from "./LayerType.js";
import type { SingleSpec, MultiSpec } from "../../Query.js";
import type { Spell } from "../../GameObject/Card/Spell.js";
import type { GameObject } from "../../GameObject/GameObject.js";

/** 単一の常在型能力からの継続的効果または呪文や能力の解決によって生成された単一の継続的効果
 * の中に含まれる、各種類別の効果 */
export type LayerInstance = {
    layerNumber: LayerOrder;
    /** 影響を及ぼすオブジェクト */
    spec: MultiSpec<GameObject>;
    /** 特性変更の内容 */
    // TODO: alter Characteristics
};
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

type LayerOptions = {
    source: Spell | StackedAbility | StaticAbility | undefined;
};

type LayerInstance1a = LayerInstance & {
    layerNumber: "1a";
    spec: SingleSpec<CopyableValue>;
};
type LayerInstance1b = LayerInstance & {
    layerNumber: "1b";
    spec: SingleSpec<CopyableValue>;
};
type LayerInstance2 = LayerInstance & {
    layerNumber: "2";
    spec: SingleSpec<Player>;
};
type LayerInstance3 = LayerInstance & { layerNumber: "3"; spec: any }; // FIXME:
type LayerInstance4 = LayerInstance & {
    layerNumber: "4";
    spec: MultiSpec<CardType | Subtype | Supertype>;
};
type LayerInstance5 = LayerInstance & {
    layerNumber: "5";
    spec: MultiSpec<Color>;
};
type LayerInstance6 = LayerInstance & {
    layerNumber: "6";
    spec: MultiSpec<Ability>;
};
type LayerInstance7a = LayerInstance & {
    layerNumber: "7a";
    spec: SingleSpec<{ power: any; toughness: any }>; // FIXME:
};
type LayerInstance7b = LayerInstance & {
    layerNumber: "7b";
    spec: SingleSpec<{ power: any; toughness: any }>; // FIXME:
};
type LayerInstance7c = LayerInstance & {
    layerNumber: "7c";
    spec: SingleSpec<{ modifyPower: any; modifyToughness: any }>; // FIXME:
};
type LayerInstance7d = LayerInstance & {
    layerNumber: "7d";
};
