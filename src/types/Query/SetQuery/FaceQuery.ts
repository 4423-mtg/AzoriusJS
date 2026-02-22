import type { Characteristics } from "../../Characteristics/Characteristic.js";
import type { ScalarCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetOperation } from "../SetQuery.js";

export type FaceQuery<T extends QueryParameter> = SetOperation<
    FaceQueryOperand<T>
>;

export type FaceConditionOperand<T extends QueryParameter> = {};
export type FaceQueryOperand<T extends QueryParameter> = {
    // FIXME: faceは両面カードだけではない -> Faceも修正
    front?: {
        printed?: ScalarCondition<Characteristics, T>;
        charcteristics?: ScalarCondition<Characteristics, T>;
    };
    back?: {
        printed?: ScalarCondition<Characteristics, T>;
        charcteristics?: ScalarCondition<Characteristics, T>;
    };
};

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
