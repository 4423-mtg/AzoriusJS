import type { Subtype } from "../../Characteristics/Subtype.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { QueryParameter } from "../Query.js";
import type { SetQuery } from "../SetQuery.js";

export type SubtypeConditionOperand<T extends QueryParameter> =
    | SetQuery<Subtype, T>
    | { type: "oneOf"; subtype: SetQuery<Subtype, T> };

export type SubtypeQueryOperand<T extends QueryParameter> =
    | Subtype
    | Subtype[]
    | { card: SetQuery<Card, T> }
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
