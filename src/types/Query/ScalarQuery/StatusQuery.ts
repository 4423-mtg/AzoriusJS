import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// ===================================================================
/** 位相の条件 */
export type StatusCondition<T extends QueryParameter> = BooleanOperation<
    StatusConditionOperand<T>
>;

export type StatusConditionOperand<T extends QueryParameter> = {
    tapped?: boolean;
    flipped?: boolean;
    isFaceDown?: boolean;
    isPhasedOut?: boolean;
};

export function isStatusCondition(
    arg: unknown,
): arg is StatusCondition<QueryParameter> {
    // TODO:
    return false;
}
export function isStatusConditionOperand(
    arg: unknown,
): arg is StatusConditionOperand<QueryParameter> {
    // TODO:
    return false;
}

// ===================================================================
/** 位相のクエリ */
export type StatusQuery<T extends QueryParameter> = StatusQueryOperand<T>;

export type StatusQueryOperand<T extends QueryParameter> = {};

export function isStatusQuery(
    arg: unknown,
): arg is StatusQuery<QueryParameter> {
    // TODO:
    return false;
}
export function isStatusQueryOperand(
    arg: unknown,
): arg is StatusQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// ===================================================================
export function getQueryParameterOfStatusConditionOperand(
    query: StatusConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfStatusQueryOperand(
    query: StatusQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
