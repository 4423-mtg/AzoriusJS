import type { Color } from "../../Characteristics/Color.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetElementCondition, SetQuery } from "../SetQuery.js";

/** 色の条件 */
export type ColorConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf" | "equal";
    color: SetQuery<Color, T>;
};

/** 色のクエリ */
export type ColorQueryOperand<T extends QueryParameter> =
    | Color
    | Color[]
    | { card: SetQuery<Card, T> } // カードの色
    | SetElementCondition<Color, T>
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
