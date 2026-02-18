import type { CardName } from "../../Characteristics/Characteristic.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { QueryParameter } from "../Query.js";
import type { SetQuery } from "../SetQuery.js";

// =================================================================
// MARK: Name

export type CardNameConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf";
    name: SetQuery<CardName, T>;
};
export type CardNameQueryOperand<T extends QueryParameter> =
    | CardName
    | CardName[]
    | {
          card: SetQuery<Card, T>;
      }
    | { argument: string };

export function getQueryParameterOfCardNameQueryOperand(
    operand: CardNameQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfCardNameConditionOperand(
    operand: CardNameConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isCardNameConditionOperand(
    arg: unknown,
): arg is CardNameConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isCardNameQueryOperand(
    arg: unknown,
): arg is CardNameQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
