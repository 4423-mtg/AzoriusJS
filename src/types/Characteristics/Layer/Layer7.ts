// MARK: 型定義: 7a
import {
    createCharacteristicsAlteringEffect,
    type CharacteristicsAlteringEffect,
} from "../../GameObject/GeneratedEffect/ContinuousEffect.js";
import { createTimestamp } from "../../GameState/Timestamp.js";
import { type QueryParameter } from "../../Query/QueryParameter.js";
import {
    isNumericalValueQuery,
    type NumericalValueQuery,
} from "../../Query/ScalarQuery/NumericalValueQuery.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** パワー・タフネスを定義する特性定義能力 */
export type Layer7a<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "7a";
        power?: NumericalValueQuery<T>;
        toughness?: NumericalValueQuery<T>;
    };
export function isLayer7a(arg: unknown): arg is Layer7a {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "7a" &&
        (!("power" in arg) || isNumericalValueQuery(arg.power)) &&
        (!("toughness" in arg) || isNumericalValueQuery(arg.toughness))
    );
}

// MARK: 型定義: 7b
/** 基本のパワー・タフネスの変更 */
export type Layer7b<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "7b";
        power?: NumericalValueQuery<T>;
        toughness?: NumericalValueQuery<T>;
    };
export function isLayer7b(arg: unknown): arg is Layer7b {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "7b" &&
        (!("power" in arg) || isNumericalValueQuery(arg.power)) &&
        (!("toughness" in arg) || isNumericalValueQuery(arg.toughness))
    );
}

// MARK: 型定義: 7c
/** パワー・タフネスの修整 */
export type Layer7c<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "7c";
        power: NumericalValueQuery<T>;
        toughness: NumericalValueQuery<T>;
    };
export function isLayer7c(arg: unknown): arg is Layer7c {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "7c" &&
        "power" in arg &&
        isNumericalValueQuery(arg.power) &&
        "toughness" in arg &&
        isNumericalValueQuery(arg.toughness)
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

const _: CharacteristicsAlteringEffect[] = [
    // タルモゴイフ
    createCharacteristicsAlteringEffect({
        timestamp: createTimestamp(),
        generatedBy: "タルモゴイフ/Tarmogoyf",
        affected: { argument: "source" },
        layer7a: {
            type: "7a",
            power: {
                valueType: "numberOfCardTypes",
                card: { zone: { type: "Graveyard" } },
            },
        },
    }),
    // 憤激解放/Unleash Fury
    // 対象のクリーチャーのパワーを2倍にする
    createCharacteristicsAlteringEffect({
        timestamp: createTimestamp(),
        generatedBy: "憤激解放/Unleash Fury",
        affected: { argument: "target" },
        layer7c: {
            type: "7c",
            // affected: { argument: "target" },
            power: {
                valueType: "power",
                card: { argument: "target" },
            },
            toughness: 0,
        },
    }),
];
