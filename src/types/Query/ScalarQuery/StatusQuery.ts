import type { Status } from "../../GameObject/Card/Card.js";
import type { QueryParameter } from "../Query.js";
import type { ScalarQuery } from "../ScalarQuery.js";

/** 位相の条件 */
export type StatusConditionOperand<T extends QueryParameter> = {
    tapped?: boolean;
    flipped?: boolean;
    isFaceDown?: boolean;
    isPhasedOut?: boolean;
};
/** 位相のクエリ */
export type StatusQueryOperand<T extends QueryParameter> = StatusCondition<T>;

export function getQueryParameterOfStatusConditionOperand(
    query: StatusConditionOperand<QueryParameter>,
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
