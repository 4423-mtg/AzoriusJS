import type { CounterOnObject } from "../../GameObject/Counter.js";
import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// MARK: Counter
export type CounterCondition<T extends QueryParameter> = CounterOnObject[];
export type CounterQuery<T extends QueryParameter> = BooleanOperation<
    CounterCondition<T>
>;
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
