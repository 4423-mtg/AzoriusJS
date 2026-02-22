import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// ===================================================================
export type CounterCondition<T extends QueryParameter> = BooleanOperation<
    CounterConditionOperand<T>
>;

export type CounterConditionOperand<T extends QueryParameter> = {};

export function isCounterCondition(
    arg: unknown,
): arg is CounterCondition<QueryParameter> {
    // TODO:
    return false;
}
export function isCounterConditionOperand(
    arg: unknown,
): arg is CounterConditionOperand<QueryParameter> {
    // TODO:
    return false;
}

// ===================================================================
export type CounterQuery<T extends QueryParameter> = CounterQueryOperand<T>;

export type CounterQueryOperand<T extends QueryParameter> = {};

export function isCounterQuery(
    arg: unknown,
): arg is CounterQuery<QueryParameter> {
    // TODO:
    return false;
}
export function isCounterQueryOperand(
    arg: unknown,
): arg is CounterQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// ===================================================================
export function getQueryParameterOfCounterQuery(
    query: CounterQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
