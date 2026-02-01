import type { CardType } from "../Characteristics/CardType.js";
import type {
    Characteristics,
    CopiableValue,
} from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { Ability } from "../GameObject/Ability.js";
import type { GameObject, GameObjectId } from "../GameObject/GameObject.js";
import type { Player } from "../GameObject/Player.js";
import type { PlayerInfo } from "../GameState/Match.js";
import type { Zone } from "../GameState/Zone.js";

// 種類別（レイヤー）に関してはこれでOK。
// 手続き変更効果・処理禁止効果・置換効果・追加ターン効果についてはどう？

// 特性変化は常時再計算するため、関数である必要がある。
// 関数はシリアライズできない（＝効果をファイルに保存できない）
// => レイヤーではなく効果をシリアライズ保存対象にする。（レイヤーは静的なものにする）
//    対象や解決時の選択などは効果に保存する
//    - レイヤーは効果にどう記述する？
//      => とりあえずソースコードに書いてもいい。そのうちタグ化すれば保存もできる
// => クラスにする必要はある？しなくてもいいが、型ガードはできない
//   - 効果の定義を書くときに型ガードがないとチェックができない
//     => タグ化しよう

// arguments: { name: string; id?: GameObjectId }[]; // FIXME: argumentの仕組みは分離が必要
// - 対象
// - 発生源
// - 選択した値
//   - 関連した能力

// =========================================================
// 1種
export type CopiableValueQuery =
    // 固定値
    | CopiableValue
    // 他のオブジェクト
    | {
          original: GameObjectQuery;
          overwrite?: Partial<CopiableValue>;
          add?: Partial<CopiableValue>;
      };
// TODO: argument
export function isCopiableValueQuery(arg: unknown) {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// 2種
export type PlayerQuery =
    // 固定
    | Player
    | {
          info: PlayerInfo;
      }
    // オブジェクトの参照
    | {
          type: "owner" | "controller";
          object: GameObjectQuery;
      }
    // プレイヤーの参照
    | {
          type: "opponent" | "teammate";
          player: PlayerQuery;
      };
export function isPlayerQuery(arg: unknown): arg is PlayerQuery {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// 3種
export type TextQuery = {};
// TODO:
export function isTextQuery(arg: unknown) {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// 4種
export type TypeQuery = {
    cardType: CardType;
    subtype: Subtype;
    supertype: Supertype;
};
export function isTypeQuery(arg: unknown) {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// 5種
export type ColorQuery = Color | Color[];
export function isColorQuery(arg: unknown) {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// 6種
export type AbilityQuery =
    | Ability[]
    | {
          lose?: Ability[]; // TODO: 能力の同一性の検査
          add?: Ability[];
      };
export function isAbilityQuery(arg: unknown) {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// 7種
export type PTQuery = {
    power: ValueQuery;
    toughness: ValueQuery;
};

export function isPTQuery(arg: unknown): arg is PTQuery {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// 値の参照
export type ValueQuery =
    // 固定値
    | number
    // オブジェクトの数値 FIXME: 他にも信心、タイプの数など
    | {
          type: "power" | "toughness" | "manaValue";
          object: GameObject | GameObjectId;
      }
    // 何かの個数
    | { type: "number"; objects: GameObjectQuery }
    // 何かの合計値
    | {
          type: "total"; // 減算や乗算はあるのだろうか
          values: ValueQuery[];
      }
    // 履歴 このターンに〇〇した数など
    | { type: "stormCount" };
export function isValueQuery(arg: unknown): arg is ValueQuery {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// オブジェクトの参照
export type GameObjectQuery =
    | { argument: string } // FIXME: source, 「これでない」
    | {
          zone?: Zone;
          characteristics?: Partial<Characteristics>;
      }
    // 履歴参照 TODO:
    | {};
export function isGameObjectQuery(arg: unknown): arg is GameObjectQuery {
    return typeof arg === "object" && arg !== null; // TODO:
}
