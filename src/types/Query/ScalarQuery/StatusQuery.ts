import type { Status } from "../../GameObject/Card/Card.js";
import type { ScalarCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

/** 位相の条件 */
export type StatusConditionOperand<T extends QueryParameter> = {
    tapped?: boolean;
    flipped?: boolean;
    isFaceDown?: boolean;
    isPhasedOut?: boolean;
};

/** 位相のクエリ */
export type StatusQueryOperand<T extends QueryParameter> = ScalarCondition<
    Status,
    T
>;

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

export function isStatusConditionOperand(
    arg: unknown,
): arg is StatusConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isStatusQueryOperand(
    arg: unknown,
): arg is StatusQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
