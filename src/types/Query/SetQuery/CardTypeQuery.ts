import type { CardType } from "../../Characteristics/CardType.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetElementCondition, SetQuery } from "../SetQuery.js";

/** カードタイプの条件 */
export type CardTypeConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf" | "equal";
    cardType: SetQuery<CardType, T>;
};

/** カードタイプのクエリ */
export type CardTypeQueryOperand<T extends QueryParameter> =
    | CardType
    | CardType[]
    | { card: SetQuery<Card, T> }
    | SetElementCondition<CardType, T>
    | { argument: string };

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
