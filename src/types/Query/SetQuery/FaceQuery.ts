import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { CharacteristicsCondition } from "../ScalarQuery/CharacteristicsQuery.js";
import type { SetOperation } from "../SetQuery.js";

// =================================================================
export type FaceCondition<T extends QueryParameter> = BooleanOperation<
    FaceConditionOperand<T>
>;
export type FaceConditionOperand<T extends QueryParameter> = {};

// =================================================================
export type FaceQuery<T extends QueryParameter> = SetOperation<
    FaceQueryOperand<T>
>;
export type FaceQueryOperand<T extends QueryParameter> = {
    // FIXME: faceは両面カードだけではない -> Faceも修正
    front?: {
        printed?: CharacteristicsCondition<T>;
        charcteristics?: CharacteristicsCondition<T>;
    };
    back?: {
        printed?: CharacteristicsCondition<T>;
        charcteristics?: CharacteristicsCondition<T>;
    };
};

// =================================================================
export function getQueryParameterOfFaceQueryOperand(
    query: FaceQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isFaceConditionOperand(
    arg: unknown,
): arg is FaceConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isFaceQueryOperand(
    arg: unknown,
): arg is FaceQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
