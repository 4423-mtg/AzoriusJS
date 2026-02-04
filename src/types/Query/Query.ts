import type { CardType } from "../Characteristics/CardType.js";
import type {
    Characteristics,
    CopiableValue,
} from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Layer7a } from "../Characteristics/Layer/Layer7.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { Ability } from "../GameObject/Ability.js";
import {
    isGameObject,
    type GameObject,
    type GameObjectId,
} from "../GameObject/GameObject.js";
import { isPlayer, type Player } from "../GameObject/Player.js";
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

// Queryで参照値として使う
export type QueryParameter = Record<
    string,
    | { type: "gameObject"; value?: GameObject }
    | { type: "player"; value?: Player }
    | { type: "number"; value?: number }
    | { type: "string"; value?: string }
>;
export function isQueryParameter(arg: unknown): arg is QueryParameter {
    if (!isRecord(arg)) {
        return false;
    }

    for (const key in arg) {
        const e = arg[key];
        if (!isRecord(e)) {
            return false;
        }
        switch (e["type"]) {
            case "gameObject":
                if (!isGameObject(e["value"]) && e["value"] !== undefined) {
                    return false;
                }
                break;
            case "player":
                if (!isPlayer(e["value"]) && e["value"] !== undefined) {
                    return false;
                }
                break;
            case "number":
                if (
                    !(typeof e["value"] !== "number") &&
                    e["value"] !== undefined
                ) {
                    return false;
                }
                break;
            case "string":
                if (
                    !(typeof e["value"] !== "string") &&
                    e["value"] !== undefined
                ) {
                    return false;
                }
                break;
            default:
                return false;
        }
    }
    return true;
}

function isRecord(arg: unknown): arg is Record<string, unknown> {
    return typeof arg === "object" && arg !== null;
}

export type TypeOfQueryParameter =
    | "gameObject"
    | "player"
    | "number"
    | "string";
// - なんらかのオブジェクト
// - 発生源
// - 選択した値
//   - 関連した能力
//     - 関連先の能力をどうやって指定するか？
//       - 後から付与された能力も対象になりうる（コピーなど）
//       - つまり、 Ability.id を指定する
function isTypeOfQueryParameter(arg: unknown): arg is TypeOfQueryParameter {
    return (
        arg === "gameObject" ||
        arg === "player" ||
        arg === "number" ||
        arg === "string"
    );
}

export type QueryParameterOfSpecificType<
    T extends QueryParameter,
    U extends TypeOfQueryParameter,
> = {
    [K in keyof T as T[K] extends { type: U } ? K : never]: T[K];
};

// すべてのクリーチャーは、X/1になる。Xは指定されたオブジェクトのパワーである
const l7a: Layer7a<{ obj1: { type: "gameObject" } }> = {
    type: "7a",
    affected: { characteristics: { card_types: ["Creature"] } },
    PT: {
        power: {
            type: "characteristics",
            kind: "power",
            object: { argumentName: "obj1" },
        },
        toughness: 1,
    },
};

// =========================================================
// 1種
export type CopiableValueQuery<T extends QueryParameter> =
    // 固定値
    | CopiableValue
    // 他のオブジェクト
    | {
          original: GameObjectQuery<T>;
          overwrite?: Partial<CopiableValue>;
          add?: Partial<CopiableValue>;
      };
// TODO: argument
export function isCopiableValueQuery(arg: unknown) {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// 2種
export type PlayerQuery<T extends QueryParameter> =
    // 固定
    | Player
    | {
          info: PlayerInfo;
      }
    // オブジェクトの参照
    | {
          type: "owner" | "controller";
          object: GameObjectQuery<T>;
      }
    // プレイヤーの参照
    | {
          type: "opponent" | "teammate";
          player: PlayerQuery<T>;
      };
export function isPlayerQuery<T extends QueryParameter>(
    arg: unknown,
): arg is PlayerQuery<T> {
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
export type PTQuery<T extends QueryParameter> = {
    power: number | NumberQuery<T>;
    toughness: number | NumberQuery<T>;
};

export function isPTQuery<T extends QueryParameter>(
    arg: unknown,
): arg is PTQuery<T> {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// 値の参照
export type NumberQuery<T extends QueryParameter> =
    // オブジェクトの数値
    | {
          type: "characteristics";
          kind: "manaValue" | "power" | "toughenss"; // ほかにタイプの数、色の数など
          object: GameObject | GameObjectId | GameObjectQuery<T>;
      }
    | {
          type: "devotion";
          object: GameObject | GameObjectId | GameObjectQuery<T>;
          colors: (Color | ColorQuery)[];
      }
    // オブジェクトの個数
    | { type: "number"; objects: GameObjectQuery<T> }
    // 何かの合計値
    | {
          type: "total"; // 減算や乗算はあるのだろうか
          values: NumberQuery<T>[];
      }
    // 履歴 このターンに〇〇した数など TODO:
    | { type: "stormCount" }
    // 引数
    | { argument: keyof QueryParameterOfSpecificType<T, "number"> };

export function isNumberQuery<T extends QueryParameter>(
    arg: unknown,
): arg is NumberQuery<T> {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// オブジェクトの参照
export type GameObjectQuery<T extends QueryParameter> =
    | { argumentName: keyof QueryParameterOfSpecificType<T, "gameObject"> }
    | {
          zone?: Zone;
          characteristics?: Partial<Characteristics>; // FIXME: and, or
          // FIXME: 「これでない」
          // FIXME: {} が通るのは良くない
      };
export function isGameObjectQuery<T extends QueryParameter>(
    arg: unknown,
): arg is GameObjectQuery<T> {
    return typeof arg === "object" && arg !== null; // TODO:
}

// 履歴参照 TODO:
