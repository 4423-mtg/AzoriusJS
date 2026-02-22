import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// =================================================================
export type StickerCondition<T extends QueryParameter> = BooleanOperation<
    StickerConditionOperand<T>
>;

export type StickerConditionOperand<T extends QueryParameter> = {};

export function isStickerCondition(
    arg: unknown,
): arg is StickerCondition<QueryParameter> {
    // TODO:
    return false;
}
export function isStickerConditionOperand(
    arg: unknown,
): arg is StickerConditionOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
export type StickerQuery<T extends QueryParameter> = StickerConditionOperand<T>;

export type StickerQueryOperand<T extends QueryParameter> = {};

export function isStickerQuery(
    arg: unknown,
): arg is StickerQuery<QueryParameter> {
    // TODO:
    return false;
}
export function isStickerQueryOperand(
    arg: unknown,
): arg is StickerQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
export function getQueryParameterOfStickerQuery(
    query: StickerQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
