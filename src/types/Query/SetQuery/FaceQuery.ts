import type { BooleanOperation, QueryParameter } from "../Query.js";

// FIXME: SetElementにする
export type FaceCondition<T extends QueryParameter> = BooleanOperation<{}>;
export type FaceQuery<T extends QueryParameter> = BooleanOperation<{
    // FIXME: faceは両面カードだけではない
    front?: {
        printed?: ScalarCondition<Characteristics, T>;
        charcteristics?: ScalarCondition<Characteristics, T>;
    };
    back?: {
        printed?: ScalarCondition<Characteristics, T>;
        charcteristics?: ScalarCondition<Characteristics, T>;
    };
}>;

export function getQueryParameterOfFaceQuery(
    query: FaceQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isFaceCondition(arg: unknown): arg is FaceCondition {
    // TODO:
    return false;
}
export function isFaceQuery(arg: unknown): arg is FaceQuery {
    // TODO:
    return false;
}
