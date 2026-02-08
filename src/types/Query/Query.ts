import type { CardType } from "../Characteristics/CardType.js";
import type { CardName } from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Card } from "../GameObject/Card/Card.js";
import { isGameObject, type GameObject } from "../GameObject/GameObject.js";
import { isPlayer, type Player } from "../GameObject/Player.js";

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
// MARK: QueryParameter
export type QueryParameter = Record<
    string,
    | { type: "gameObject"; value?: GameObject }
    | { type: "card"; value?: Card }
    | { type: "player"; value?: Player }
    | { type: "number"; value?: number }
    | { type: "string"; value?: string }
    | { type: "cardType"; value?: CardType }
    | { type: "subtype"; value?: Subtype }
    | { type: "color"; value?: Color }
    | { type: "name"; value?: CardName }
    // | { type: "zone"; value?: Zone }
>;
export type TypeOfQueryParameter = QueryParameter[string]["type"];

// - なんらかのオブジェクト
// - 発生源
// - 選択した値
//   - 関連した能力
//     - 関連先の能力をどうやって指定するか？
//       - 後から付与された能力も対象になりうる（コピーなど）
//       - つまり、 Ability.id を指定する

export type QueryParameterNameOfSpecificType<
    T extends QueryParameter,
    U extends TypeOfQueryParameter,
> = keyof {
    [K in keyof T as T[K] extends { type: U } ? K : never]: T[K];
};

// 配列を返すもの
// - GameObject: 集合演算
// - Ability: 集合演算？
// - Color: 集合演算
// - CardType: 集合演算
// - Name
// 1つだけ返すもの
// - number: 足し算
// - Player: 対戦相手、チームメイト、その人以外、その人の次の人
// オブジェクトを返すもの
// - CopiableValue
// - Characteristics:

// 履歴 TODO:

// =================================================================
// MARK: 演算型
export type SetOperation<T> =
    | T
    | {
          operation: "union" | "intersection";
          operand: SetOperation<T>[];
      }
    | {
          operation: "difference";
          leftOperand: SetOperation<T>;
          rightOperand: SetOperation<T>;
      };
export type BooleanOperation<T> =
    | T
    | {
          operation: "not";
          operand: BooleanOperation<T>;
      }
    | {
          operation: "and" | "or";
          operand: BooleanOperation<T>[];
      };

// ==================================================================
// MARK: 型ガード
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
function isTypeOfQueryParameter(arg: unknown): arg is TypeOfQueryParameter {
    return (
        arg === "gameObject" ||
        arg === "player" ||
        arg === "number" ||
        arg === "string"
    );
}
function isSpecificTypeParameterName<
    T extends QueryParameter,
    U extends TypeOfQueryParameter,
>(
    parameters: T,
    type: U,
    arg: unknown,
): arg is QueryParameterNameOfSpecificType<T, U> {
    if (typeof arg === "string" && parameters[arg] !== undefined) {
        return parameters[arg]["type"] === type;
    } else {
        return false;
    }
}
export function isCopiableValueQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isPlayerQuery<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is PlayerQuery<T> {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isTextQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isCardTypeQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CardTypeQuery<T> {
    // TODO:
    return false;
}
export function isSubtypeQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is SubtypeQuery<T> {
    // TODO:
    return false;
}
export function isSupertypeQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is SupertypeQuery<T> {
    // TODO:
    return false;
}
export function isColorQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isAbilityQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isNumberQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
): arg is NumberQuery<T> {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isGameObjectQuery<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is GameObjectQuery<T> {
    if (!isRecord(arg)) {
        return false;
    }
    const argumentName = arg["argumentName"];
    if (
        argumentName !== undefined &&
        isSpecificTypeParameterName(parameters, "gameObject", argumentName)
    ) {
        return true;
    }
    // TODO: 続き
    return false;
}
