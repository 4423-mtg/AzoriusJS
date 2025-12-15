import type { Player } from "../GameObject/Player.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Color } from "./Color.js";
import type { CardType } from "./CardType.js";
import type { Subtype } from "./Subtype.js";
import type { Supertype } from "./Supertype.js";
import type { SingleSpec, MultiSpec } from "../Query.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type { CopiableValue } from "./Characteristic.js";

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

type LayerOrder2 = [
    "1a",
    "1b",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7a",
    "7b",
    "7c",
    "7d"
][number];

export type LayerInstance<T extends LayerOrder> = {
    layerOrder: T;
    affected: MultiSpec<GameObject>;
} & (T extends "1a" | "1b"
    ? { copyableValueAltering: SingleSpec<CopiableValue> }
    : T extends "2"
    ? { controllerAltering: SingleSpec<Player> }
    : T extends "3"
    ? {
          textAltering: any; // FIXME:
      }
    : T extends "4"
    ? { typeAltering: MultiSpec<CardType | Subtype | Supertype> }
    : T extends "5"
    ? { colorAltering: MultiSpec<Color> }
    : T extends "6"
    ? { abilityAltering: MultiSpec<Ability> }
    : T extends "7a"
    ? {
          ptAltering: SingleSpec<{ power: any; toughness: any }>; // FIXME:
      }
    : T extends "7b"
    ? {
          ptAltering: SingleSpec<{ power: any; toughness: any }>; // FIXME:
      }
    : T extends "7c"
    ? {
          ptAltering: SingleSpec<{ modifyPower: any; modifyToughness: any }>; // FIXME:
      }
    : T extends "7d"
    ? {} // FIXME: フロー表示が {layerOrder;affected} になるのがいまいち
    : never);
