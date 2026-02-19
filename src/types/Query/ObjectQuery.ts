import type { Characteristics } from "../Characteristics/Characteristic.js";
import type { CounterOnObject } from "../GameObject/Counter.js";
import type { Marker } from "../GameObject/Marker.js";
import type { Sticker } from "../GameObject/Sticker.js";
import type { BooleanOperation, QueryParameter } from "./Query.js";
import type { ScalarCondition } from "./ScalarQuery.js";

// =================================================================
// MARK: Face
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

// =================================================================
// MARK: Status

// =================================================================
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

// =================================================================
// MARK: Marker
export type MarkerCondition<T extends QueryParameter> = BooleanOperation<{}>;
export type MarkerQuery<T extends QueryParameter> = BooleanOperation<Marker[]>;
export function getQueryParameterOfMarkerQuery(
    query: MarkerQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
//
//

// =================================================================
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

export function isFaceCondition(arg: unknown): arg is FaceCondition {
    // TODO:
    return false;
}
export function isFaceQuery(arg: unknown): arg is FaceQuery {
    // TODO:
    return false;
}

export function isCounterCondition(arg: unknown): arg is CounterCondition {
    // TODO:
    return false;
}
export function isCounterQuery(arg: unknown): arg is CounterQuery {
    // TODO:
    return false;
}

export function isMarkerCondition(arg: unknown): arg is MarkerCondition {
    // TODO:
    return false;
}
export function isMarkerQuery(arg: unknown): arg is MarkerQuery {
    // TODO:
    return false;
}

export function isStickerCondition(arg: unknown): arg is StickerCondition {
    // TODO:
    return false;
}
export function isStickerQuery(arg: unknown): arg is StickerQuery {
    // TODO:
    return false;
}
