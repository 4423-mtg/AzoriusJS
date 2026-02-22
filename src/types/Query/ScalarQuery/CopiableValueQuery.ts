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
import type { ScalarCondition, SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { ScalarQuery } from "../ScalarQuery.js";
import type { CardNameQuery } from "../SetQuery/CardNameQuery.js";
import type { CardTypeQuery } from "../SetQuery/CardTypeQuery.js";
import type { ColorQuery } from "../SetQuery/ColorQuery.js";
import type { GameObjectQuery } from "../SetQuery/GameObjectQuery.js";
import type { RuleTextQuery } from "../SetQuery/RuleTextQuery.js";
import type { SubtypeQuery } from "../SetQuery/SubtypeQuery.js";
import type { SupertypeQuery } from "../SetQuery/SupertypeQuery.js";

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
    name: CardNameQuery<T>;
    manaCost: ScalarQuery<ManaCost, T>;
    colorIdentity: ColorQuery<T>;
    cardTypes: CardTypeQuery<T>;
    subtypes: SubtypeQuery<T>;
    supertypes: SupertypeQuery<T>;
    text: RuleTextQuery<T>;
    power: ScalarQuery<NumericalValue, T>;
    toughness: ScalarQuery<NumericalValue, T>;
    loyalty: ScalarQuery<NumericalValue, T>;
};

// TODO: 呪文の場合
/** コピー可能な値のクエリ */
export type CopiableValueQueryOperand<T extends QueryParameter> =
    | _q<T>
    // 参照
    | { object: GameObjectQuery<T> } // 1つだけ欲しい場合は？
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
