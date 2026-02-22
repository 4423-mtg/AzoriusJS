import type { CardType } from "../../Characteristics/CardType.js";
import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetOperation } from "../SetQuery.js";
import type { CardQuery } from "./CardQuery.js";

// =================================================================
/** カードタイプの条件 */
export type CardTypeCondition<T extends QueryParameter> = BooleanOperation<
    CardTypeConditionOperand<T>
>;
export type CardTypeConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf" | "equal";
    cardType: CardTypeQuery<T>;
};

// =================================================================
/** カードタイプのクエリ */
export type CardTypeQuery<T extends QueryParameter> = SetOperation<
    CardTypeQueryOperand<T>
>;
export type CardTypeQueryOperand<T extends QueryParameter> =
    | CardType
    | CardType[]
    | { card: CardQuery<T> }
    | CardTypeCondition<T>
    | { argument: string };

// =================================================================
export function getQueryParameterOfCardTypeQueryOperand(
    query: CardTypeQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfCardTypeConditionOperand(
    query: CardTypeConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isCardTypeConditionOperand(
    arg: unknown,
): arg is CardTypeConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isCardTypeQueryOperand(
    arg: unknown,
): arg is CardTypeQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
