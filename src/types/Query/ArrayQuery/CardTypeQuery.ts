import type { CardType } from "../../Characteristics/CardType.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { QueryParameter } from "../Query.js";
import type { SetQuery } from "../SetQuery.js";

export type CardTypeConditionOperand<T extends QueryParameter> =
    | SetQuery<CardType, T>
    | {
          type: "oneOf";
          cardType: SetQuery<CardType, T>;
      };
export type CardTypeQueryOperand<T extends QueryParameter> =
    | CardType
    | CardType[]
    | { card: SetQuery<Card, T> }
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
