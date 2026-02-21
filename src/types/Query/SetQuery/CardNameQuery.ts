import type { CardName } from "../../Characteristics/Characteristic.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetElementCondition, SetQuery } from "../SetQuery.js";

export type CardNameConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf" | "equal";
    names: SetQuery<CardName, T>;
};
export type CardNameQueryOperand<T extends QueryParameter> =
    | CardName
    | CardName[]
    | {
          card: SetQuery<Card, T>;
      }
    | SetElementCondition<CardName, T>
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
