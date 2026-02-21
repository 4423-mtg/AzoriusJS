import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// MARK: Marker
export type MarkerCondition<T extends QueryParameter> = BooleanOperation<{}>;
export type MarkerQuery<T extends QueryParameter> = BooleanOperation<Marker[]>;
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
