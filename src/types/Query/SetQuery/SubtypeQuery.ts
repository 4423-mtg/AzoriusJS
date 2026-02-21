import type { Subtype } from "../../Characteristics/Subtype.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetQuery } from "../SetQuery.js";

/** サブタイプの条件 */
export type SubtypeConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf" | "equal";
    subtype: SetQuery<Subtype, T>;
};

/** サブタイプのクエリ */
export type SubtypeQueryOperand<T extends QueryParameter> =
    | Subtype
    | Subtype[]
    | { card: SetQuery<Card, T> }
    | SetElementCondition<Subtype, T>
    | { argument: string };

export function getQueryParameterOfSubtypeQueryOperand(
    operand: SubtypeQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfSubtypeConditionOperand(
    operand: SubtypeConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isSubtypeConditionOperand(
    arg: unknown,
): arg is SubtypeConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isSubtypeQueryOperand(
    arg: unknown,
): arg is SubtypeQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
