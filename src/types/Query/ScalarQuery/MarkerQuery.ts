import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// ===================================================================
export type MarkerCondition<T extends QueryParameter> = BooleanOperation<
    MarkerConditionOperand<T>
>;

export type MarkerConditionOperand<T extends QueryParameter> = {};

export function isMarkerCondition(
    arg: unknown,
): arg is MarkerCondition<QueryParameter> {
    // TODO:
    return false;
}
export function isMarkerConditionOperand(
    arg: unknown,
): arg is MarkerConditionOperand<QueryParameter> {
    // TODO:
    return false;
}

// ===================================================================
export type MarkerQuery<T extends QueryParameter> = MarkerQueryOperand<T>;

export type MarkerQueryOperand<T extends QueryParameter> = {};

export function isMarkerQuery(
    arg: unknown,
): arg is MarkerQuery<QueryParameter> {
    // TODO:
    return false;
}
export function isMarkerQueryOperand(
    arg: unknown,
): arg is MarkerQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// ===================================================================
export function getQueryParameterOfMarkerQuery(
    query: MarkerQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
