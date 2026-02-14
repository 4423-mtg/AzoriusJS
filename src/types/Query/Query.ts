import type { CardType } from "../Characteristics/CardType.js";
import type { CardName } from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Card } from "../GameObject/Card/Card.js";
import { isGameObject, type GameObject } from "../GameObject/GameObject.js";
import { isPlayer, type Player } from "../GameObject/Player.js";
import type {
    CardCondition,
    CardNameCondition,
    CardTypeCondition,
    ColorCondition,
    GameObjectCondition,
    PlayerCondition,
    SubtypeCondition,
    SupertypeCondition,
} from "./ArrayQuery.js";

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

export type Condition<T extends QueryParameter> =
    | GameObjectCondition<T>
    | CardCondition<T>
    | PlayerCondition<T>
    | CardNameCondition<T>
    | CardTypeCondition<T>
    | SubtypeCondition<T>
    | SupertypeCondition<T>
    | ColorCondition<T>;
// TODO:

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
export type _Intersection<T> = {
    operation: "intersection";
    operand: T[];
};
export type _Difference<T, U> = {
    // FIXME: TとUの関係
    operation: "difference";
    left: T;
    right: U;
};
export type SetOperation<T> =
    | T
    | _Intersection<T>
    | _Difference<T, T>
    | _Difference<_Intersection<T>, T>
    | (
          | T
          | _Intersection<T>
          | _Difference<T, T>
          | _Difference<_Intersection<T>, T>
      )[]; // unionとして解釈する
// (A & B) - C = (A - C) & (B - C)
// A - (B + C) = (A - B) & (A - C)
// A - (B & C) = (A - B) + (A - C)
// A - (B - C) = (A - B) + (A & C)

type BooleanQuery = any; // FIXME: T に型制約を付ける
type BooleanOperand<T extends BooleanQuery> =
    | T
    | { operation: "not"; operand: T };
export type BooleanOperation<T> =
    | BooleanOperand<T>
    | BooleanOperand<T>[] // andとして解釈する
    | { operation: "or"; operand: BooleanOperand<T>[] };
// not (A and B) = (not A) or (not B)
// not (A or B) = (not A) and (not B)
// A and (not B)
// A and (B and C) = A and B and C
// A and (B or C) = (A and B) or (A and C)
// A or (not B)
// A or (B and C) =
// A or (B or C) = A or B or C
// あなたがコントロールしていない基本でない土地
// (not A) and (not B) and C
// 対戦相手がコントロールする、クリーチャーと基本でない土地
// A and (B or ((not C) and D))
// = (A and B) or (A and (not C) and D)

// ==================================================================
// MARK: 型ガード
function isRecord(arg: unknown): arg is Record<string, unknown> {
    return typeof arg === "object" && arg !== null;
}
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

function isTypeOfQueryParameter(arg: unknown): arg is TypeOfQueryParameter {
    return (
        arg === "gameObject" ||
        arg === "player" ||
        arg === "number" ||
        arg === "string"
    );
}
function isQueryParameterNameOfSpecificType<
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
export function isSetOperation<T>(arg: unknown): arg is SetOperation<T> {
    // TODO:
    return false;
}
export function isBooleanOperation<T>(
    arg: unknown,
): arg is BooleanOperation<T> {
    // TODO:
    return false;
}
