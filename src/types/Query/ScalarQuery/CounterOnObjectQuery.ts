import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// ===================================================================
export type CounterCondition<T extends QueryParameter> = BooleanOperation<
    CounterConditionOperand<T>
>;

export type CounterConditionOperand<T extends QueryParameter> = {};

// ===================================================================
export type CounterQuery<T extends QueryParameter> = CounterQueryOperand<T>;

export type CounterQueryOperand<T extends QueryParameter> = {};

// ===================================================================
export function getQueryParameterOfCounterQuery(
    query: CounterQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isCounterCondition(arg: unknown): arg is CounterCondition {
    // TODO:
    return false;
}
export function isCounterQuery(arg: unknown): arg is CounterQuery {
    // TODO:
    return false;
}
