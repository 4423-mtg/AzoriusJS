import type { CardType } from "../Characteristics/CardType.js";
import type {
    CardName,
    NumericalValue,
} from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Card } from "../GameObject/Card/Card.js";
import { isGameObject, type GameObject } from "../GameObject/GameObject.js";
import { isPlayer, type Player } from "../GameObject/Player.js";
import {
    getQueryParameterOfCondition,
    isCondition,
    type Condition,
} from "./Condition.js";
import {
    getQueryParameterOfScalarQuery,
    isScalarQuery,
    type ScalarQuery,
    type ScalarType,
} from "./ScalarQuery.js";
import {
    getQueryParameterOfSetQuery,
    isSetQuery,
    type SetElementType,
} from "./SetQuery.js";

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

// ====================================================================
// MARK: パラメータ
// ====================================================================
const _queryParameterTypeId = [
    "gameObject",
    "card",
    "player",
    "number",
    "string",
    "cardType",
    "subtype",
    "color",
    "name",
];

type _QueryParameterTypeDef = {
    gameObject: GameObject;
    card: Card;
    player: Player;
    number: NumericalValue;
    string: string;
    cardType: CardType;
    subtype: Subtype;
    color: Color;
    name: CardName;
};

export type QueryParameterTypeId<T = QueryParameterType> = keyof {
    [K in keyof _QueryParameterTypeDef as _QueryParameterTypeDef[K] extends T
        ? K
        : never]: _QueryParameterTypeDef[K];
};

export type QueryParameterType<
    T extends QueryParameterTypeId = keyof _QueryParameterTypeDef,
> = _QueryParameterTypeDef[T];

type _QueryParameterEntry<T extends QueryParameterTypeId> = {
    type: T;
    value?: QueryParameterType<T>;
};
/** クエリのパラメータ */
export type QueryParameter = Record<
    string,
    _QueryParameterEntry<QueryParameterTypeId>
>;
/** クエリのパラメータが取る型 */ // TODO: 要る?
export type TypeOfQueryParameter = QueryParameter[string]["type"];

// - なんらかのオブジェクト
// - 発生源
// - 選択した値
//   - 関連した能力
//     - 関連先の能力をどうやって指定するか？
//       - 後から付与された能力も対象になりうる（コピーなど）
//       - つまり、 Ability.id を指定する

// ====================================================================
// MARK: パラメータの演算
// ====================================================================

// /** クエリパラメータのうちの、指定した型であるパラメータ */ // TODO: 要らない?
// export type QueryParameterNameOfSpecificType<
//     T extends QueryParameter,
//     U extends TypeOfQueryParameter,
// > = keyof {
//     [K in keyof T as T[K] extends { type: U } ? K : never]: T[K];
// };

// type QueryParameterNameOfSpecificType2<
//     T extends QueryParameter,
//     U extends TypeOfQueryParameter,
// > = keyof T;

// const x = {
//     p1: { type: "gameObject" },
//     p2: { type: "player" },
//     p3: { type: "gameObject" },
// } satisfies QueryParameter;
// type x2 = QueryParameterNameOfSpecificType<typeof x, "gameObject">;
// const test1: x2 = "p1";
// const test2: x2 = "p2";
// const test3: x2 = "p3";
// type y2 = QueryParameterNameOfSpecificType2<typeof x, "gameObject">;

/** クエリパラメータの総和 */
export function IntersectionOfQueryParameters(
    params: QueryParameter[],
): QueryParameter {
    // FIXME: キーの衝突
    const merged = Object.assign({}, ...params);
    return merged;
}

/** クエリのパラメータを取得する。 */
export function getQueryParameter(
    arg:
        | SetQuery<SetElementType, QueryParameter> // FIXME:
        | ScalarQuery<ScalarType, QueryParameter>
        | Condition<SetElementType, QueryParameter>,
): QueryParameter {
    if (isSetQuery(arg)) {
        return getQueryParameterOfSetQuery(arg);
    } else if (isScalarQuery(arg, undefined)) {
        return getQueryParameterOfScalarQuery(arg);
    } else if (isCondition(arg)) {
        return getQueryParameterOfCondition(arg);
    } else {
        throw new Error(arg);
    }
}

// ==================================================================
// MARK: 型ガード
// ====================================================================
/** QueryParameter */
export function isQueryParameter(arg: unknown): arg is QueryParameter {
    if (!isStringKeyRecord(arg)) {
        return false;
    }

    for (const key in arg) {
        const e = arg[key];
        if (!isObject(e) || !("type" in e) || !("value" in e)) {
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

/**  */
function isTypeOfQueryParameter(arg: unknown): arg is TypeOfQueryParameter {
    return (
        arg === "gameObject" ||
        arg === "player" ||
        arg === "number" ||
        arg === "string"
    );
}

/**  */
// function isQueryParameterNameOfSpecificType<
//     T extends QueryParameter,
//     U extends TypeOfQueryParameter,
// >(
//     parameters: T,
//     type: U,
//     arg: unknown,
// ): arg is QueryParameterNameOfSpecificType<T, U> {
//     if (typeof arg === "string" && parameters[arg] !== undefined) {
//         return parameters[arg]["type"] === type;
//     } else {
//         return false;
//     }
// }

/** 型ガード */
function isObject(arg: unknown): arg is object {
    return typeof arg === "object" && arg !== null;
}
function isStringKeyRecord(arg: unknown): arg is Record<string, unknown> {
    if (!isObject(arg)) {
        return false;
    }
    for (const key in arg) {
        if (!Object.hasOwn(arg, key)) continue;
        if (typeof key !== "string") {
            return false;
        }
    }
    return true;
}
