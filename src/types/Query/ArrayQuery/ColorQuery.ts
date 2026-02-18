import type { Color } from "../../Characteristics/Color.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { QueryParameter } from "../Query.js";
import type { SetQuery } from "../SetQuery.js";

export type ColorConditionOperand<T extends QueryParameter> =
    | SetQuery<Color, T>
    | {
          type: "oneOf";
          color: SetQuery<Color, T>;
      };

export type ColorQueryOperand<T extends QueryParameter> =
    | Color
    | Color[]
    | { card: SetQuery<Card, T> }
    | { argument: string };

export function getQueryParameterOfColorQueryOperand(
    operand: ColorQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfColorConditionOperand(
    operand: ColorConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isColorConditionOperand(
    arg: unknown,
): arg is ColorConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isColorQueryOperand(
    arg: unknown,
): arg is ColorQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
