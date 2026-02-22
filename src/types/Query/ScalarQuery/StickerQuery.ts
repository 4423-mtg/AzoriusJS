import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// =================================================================
export type StickerCondition<T extends QueryParameter> = BooleanOperation<
    StickerConditionOperand<T>
>;

export type StickerConditionOperand<T extends QueryParameter> = {};

// =================================================================
export type StickerQuery<T extends QueryParameter> = StickerConditionOperand<T>;

export type StickerQueryOperand<T extends QueryParameter> = {};

// =================================================================
export function getQueryParameterOfStickerQuery(
    query: StickerQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

export function isStickerCondition(arg: unknown): arg is StickerCondition {
    // TODO:
    return false;
}
export function isStickerQuery(arg: unknown): arg is StickerQuery {
    // TODO:
    return false;
}
