import type { CardType } from "../../Characteristics/CardType.js";
import type {
    CardName,
    CopiableValue,
    ManaCost,
    NumericalValue,
    RuleText,
} from "../../Characteristics/Characteristic.js";
import type { Color } from "../../Characteristics/Color.js";
import type { Subtype } from "../../Characteristics/Subtype.js";
import type { Supertype } from "../../Characteristics/Supertype.js";
import type { GameObject } from "../../GameObject/GameObject.js";
import type { ScalarCondition, SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { ScalarQuery } from "../ScalarQuery.js";
import type { SetQuery } from "../SetQuery.js";

// TODO: 呪文の場合
/** コピー可能な値の条件 */
export type CopiableValueConditionOperand<T extends QueryParameter> = {
    name?: SetElementCondition<CardName, T>;
    manaCost?: ScalarCondition<ManaCost, T>;
    colorIdentity?: SetElementCondition<Color, T>;
    cardTypes?: SetElementCondition<CardType, T>;
    subtypes?: SetElementCondition<Subtype, T>;
    supertypes?: SetElementCondition<Supertype, T>;
    text?: SetElementCondition<RuleText, T>;
    power?: ScalarCondition<NumericalValue, T>;
    toughness?: ScalarCondition<NumericalValue, T>;
    loyalty?: ScalarCondition<NumericalValue, T>;
};

// type x<T extends QueryParameter> = {
//     [K in keyof CopiableValue]: CopiableValue[K] extends (infer U)[]
//         ? SetQuery<U, T>
//         : CopiableValue[K] extends infer U
//         ? ScalarQuery<U, T>
//         : never;
// };

export type _q<T extends QueryParameter> = {
    // FIXME: どうせここでCopiableValueのプロパティを名指ししているので、
    // overwriteについても名指しでいいか？
    // プロパティの値の型を見てジェネリクスする手もある
    name: SetQuery<CardName, T>;
    manaCost: ScalarQuery<ManaCost, T>;
    colorIdentity: SetQuery<Color, T>;
    cardTypes: SetQuery<CardType, T>;
    subtypes: SetQuery<Subtype, T>;
    supertypes: SetQuery<Supertype, T>;
    text: SetQuery<RuleText, T>;
    power: ScalarQuery<NumericalValue, T>;
    toughness: ScalarQuery<NumericalValue, T>;
    loyalty: ScalarQuery<NumericalValue, T>;
};

// TODO: 呪文の場合
/** コピー可能な値のクエリ */
export type CopiableValueQueryOperand<T extends QueryParameter> =
    | _q<T>
    // 参照
    | { object: SetQuery<GameObject, T> } // 1つだけ欲しい場合は？
    // 部分的な修整
    | {
          original: ScalarQuery<CopiableValue, T>;
          overwrite?: Partial<_q<T>>; // FIXME: Partialが困る
          add?: Partial<_q<T>>;
          exclude?: Partial<_q<T>>;
      };
export function getQueryParameterOfCopiableValueConditionOperand(
    query: CopiableValueConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfCopiableValueQueryOperand(
    query: CopiableValueQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

export function isCopiableValueConditionOperand(
    arg: unknown,
): arg is CopiableValueConditionOperand<QueryParameter> {
    return false;
}
export function isCopiableValueQueryOperand(
    arg: unknown,
): arg is CopiableValueQueryOperand<QueryParameter> {
    return false;
}
