// MARK: 型定義: 7a
import { type QueryParameter } from "../../Query/QueryParameter.js";
import type { ScalarQuery } from "../../Query/ScalarQuery.js";
import type { NumericalValue } from "../Characteristic.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** パワー・タフネスを定義する特性定義能力 */
export type Layer7a<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "7a";
        power?: ScalarQuery<NumericalValue, T>;
        toughness?: ScalarQuery<NumericalValue, T>;
    };
export function isLayer7a(arg: unknown): arg is Layer7a {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "7a" &&
        (!("power" in arg) || isNumberQuery(arg.power)) &&
        (!("toughness" in arg) || isNumberQuery(arg.toughness))
    );
}

// MARK: 型定義: 7b
/** 基本のパワー・タフネスの変更 */
export type Layer7b<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "7b";
        power?: ScalarQuery<NumericalValue, T>;
        toughness?: ScalarQuery<NumericalValue, T>;
    };
export function isLayer7b(arg: unknown): arg is Layer7b {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "7b" &&
        (!("power" in arg) || isNumberQuery(arg.power)) &&
        (!("toughness" in arg) || isNumberQuery(arg.toughness))
    );
}

// MARK: 型定義: 7c
/** パワー・タフネスの修整 */
export type Layer7c<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "7c";
        power: ScalarQuery<NumericalValue, T>;
        toughness: ScalarQuery<NumericalValue, T>;
    };
export function isLayer7c(arg: unknown): arg is Layer7c {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "7c" &&
        "power" in arg &&
        isNumberQuery(arg.power) &&
        "toughness" in arg &&
        isNumberQuery(arg.toughness)
    );
}

// MARK: 型定義: 7d
/** パワーとタフネスの入れ替え */
export type Layer7d<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "7d";
    };
export function isLayer7d(arg: unknown): arg is Layer7d {
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
