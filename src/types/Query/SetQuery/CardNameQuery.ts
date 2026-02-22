import type { CardName } from "../../Characteristics/Characteristic.js";
import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetOperation } from "../SetQuery.js";
import type { CardQuery } from "./CardQuery.js";

// =================================================================
export type CardNameCondition<T extends QueryParameter> = BooleanOperation<
    CardNameConditionOperand<T>
>;

export type CardNameConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf" | "equal";
    names: CardNameQuery<T>;
};
// =================================================================
export type CardNameQuery<T extends QueryParameter> = SetOperation<
    CardNameQueryOperand<T>
>;
export type CardNameQueryOperand<T extends QueryParameter> =
    | CardName
    | CardName[]
    | {
          card: CardQuery<T>;
      }
    | CardNameCondition<T>
    | { argument: string };

// =================================================================
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
