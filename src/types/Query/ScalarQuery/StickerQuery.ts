import type { Sticker } from "../../GameObject/Sticker.js";
import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

// MARK: Sticker
export type StickerCondition<T extends QueryParameter> = BooleanOperation<{}>;
export type StickerQuery<T extends QueryParameter> = BooleanOperation<
    Sticker[]
>;
export function getQueryParameterOfStickerQuery(
    query: StickerQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: 型ガード

export function isStickerCondition(arg: unknown): arg is StickerCondition {
    // TODO:
    return false;
}
export function isStickerQuery(arg: unknown): arg is StickerQuery {
    // TODO:
    return false;
}
