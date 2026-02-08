// MARK: 型定義: 7a
import {
    isNumberQuery,
    type NumberQuery,
    type QueryParameter,
} from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** パワー・タフネスを定義する特性定義能力 */
export type Layer7a<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "7a";
    power?: NumberQuery<T>;
    toughness?: NumberQuery<T>;
};
export function isLayer7a<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is Layer7a<T> {
    return (
        isLayerCommonProperty(parameters, arg) &&
        arg.type === "7a" &&
        (!("power" in arg) || isNumberQuery(parameters, arg.power)) &&
        (!("toughness" in arg) || isNumberQuery(parameters, arg.toughness))
    );
}

// MARK: 型定義: 7b
/** 基本のパワー・タフネスの変更 */
export type Layer7b<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "7b";
    power?: NumberQuery<T>;
    toughness?: NumberQuery<T>;
};
export function isLayer7b<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is Layer7b<T> {
    return (
        isLayerCommonProperty(parameters, arg) &&
        arg.type === "7b" &&
        (!("power" in arg) || isNumberQuery(parameters, arg.power)) &&
        (!("toughness" in arg) || isNumberQuery(parameters, arg.toughness))
    );
}

// MARK: 型定義: 7c
/** パワー・タフネスの修整 */
export type Layer7c<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "7c";
    power: NumberQuery<T>;
    toughness: NumberQuery<T>;
};
export function isLayer7c<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is Layer7c<T> {
    return (
        isLayerCommonProperty(parameters, arg) &&
        arg.type === "7c" &&
        "power" in arg &&
        isNumberQuery(parameters, arg.power) &&
        "toughness" in arg &&
        isNumberQuery(parameters, arg.toughness)
    );
}

// MARK: 型定義: 7d
/** パワーとタフネスの入れ替え */
export type Layer7d<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "7d";
};
export function isLayer7d<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is Layer7d<T> {
    return isLayerCommonProperty(parameters, arg) && arg.type === "7d";
}

// =======================================================
const sample: Record<
    string,
    | Layer7a<{ target: { type: "gameObject" }; this: { type: "gameObject" } }>
    | Layer7b<{ target: { type: "gameObject" }; this: { type: "gameObject" } }>
    | Layer7c<{ target: { type: "gameObject" }; this: { type: "gameObject" } }>
    | Layer7d<{ target: { type: "gameObject" }; this: { type: "gameObject" } }>
> = {
    // タルモゴイフ
    Tarmogoyf: {
        type: "7a",
        affected: { argument: "this" },
        power: {
            type: "numberOfCardTypes",
            objects: { zone: { type: "Graveyard" } },
        },
        toughness: {
            type: "total",
            values: [
                {
                    type: "numberOfCardTypes",
                    objects: { zone: { type: "Graveyard" } },
                },
                1,
            ],
        },
    },
    // 憤激解放/Unleash Fury
    // 対象のクリーチャーのパワーを2倍にする
    "Unleash Fury": {
        type: "7c",
        affected: { argument: "target" },
        power: {
            type: "characteristics",
            kind: "power",
            card: { argument: "target" },
        },
        toughness: 0,
    },
};
