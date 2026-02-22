import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// ===================================================================
export type MarkerCondition<T extends QueryParameter> = BooleanOperation<
    MarkerConditionOperand<T>
>;

export type MarkerConditionOperand<T extends QueryParameter> = {};

// ===================================================================
export type MarkerQuery<T extends QueryParameter> = MarkerQueryOperand<T>;

export type MarkerQueryOperand<T extends QueryParameter> = {};

// ===================================================================
export function getQueryParameterOfMarkerQuery(
    query: MarkerQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isMarkerCondition(arg: unknown): arg is MarkerCondition {
    // TODO:
    return false;
}
export function isMarkerQuery(arg: unknown): arg is MarkerQuery {
    // TODO:
    return false;
}
