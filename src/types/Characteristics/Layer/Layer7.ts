// MARK: 型定義: 7a
import { isNumberQuery, type NumberQuery } from "../../Query/NumberQuery.js";
import { type QueryParameter } from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** パワー・タフネスを定義する特性定義能力 */
export type Layer7a<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "7a";
    power?: NumberQuery<T>;
    toughness?: NumberQuery<T>;
};
export function isLayer7a<T extends QueryParameter>(
    arg: unknown,
    parameters: T,
): arg is Layer7a<T> {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "7a" &&
        (!("power" in arg) || isNumberQuery(arg.power, parameters)) &&
        (!("toughness" in arg) || isNumberQuery(arg.toughness, parameters))
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
    arg: unknown,
    parameters: T,
): arg is Layer7b<T> {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "7b" &&
        (!("power" in arg) || isNumberQuery(arg.power, parameters)) &&
        (!("toughness" in arg) || isNumberQuery(arg.toughness, parameters))
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
    arg: unknown,
    parameters: T,
): arg is Layer7c<T> {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "7c" &&
        "power" in arg &&
        isNumberQuery(arg.power, parameters) &&
        "toughness" in arg &&
        isNumberQuery(arg.toughness, parameters)
    );
}

// MARK: 型定義: 7d
/** パワーとタフネスの入れ替え */
export type Layer7d<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "7d";
};
export function isLayer7d<T extends QueryParameter>(
    arg: unknown,
    parameters: T,
): arg is Layer7d<T> {
    return isLayerCommonProperty(arg) && arg.type === "7d";
}

// =======================================================
type param = { target: { type: "card" }; this: { type: "card" } };

const sample: Record<
    string,
    Layer7a<param> | Layer7b<param> | Layer7c<param> | Layer7d<param>
> = {
    // タルモゴイフ
    Tarmogoyf: {
        type: "7a",
        // affected: { argument: "this" },
        power: {
            valueType: "numberOfCardTypes",
            card: { zone: { type: "Graveyard" } },
        },
        toughness: {
            valueType: "total",
            values: [
                {
                    valueType: "numberOfCardTypes",
                    card: { zone: { type: "Graveyard" } },
                },
                1,
            ],
        },
    },
    // 憤激解放/Unleash Fury
    // 対象のクリーチャーのパワーを2倍にする
    "Unleash Fury": {
        type: "7c",
        // affected: { argument: "target" },
        power: {
            valueType: "power",
            card: { argument: "target" },
        },
        toughness: 0,
    },
};
