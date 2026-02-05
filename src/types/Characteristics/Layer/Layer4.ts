// MARK: 型定義: 4
import {
    isCardTypeQuery,
    isSubtypeQuery,
    isSupertypeQuery,
    type CardTypeQuery,
    type QueryParameter,
    type SubtypeQuery,
    type SupertypeQuery,
} from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** タイプ変更 */
export type Layer4<T extends QueryParameter = {}> = LayerCommonProperty<T> & {
    type: "4";
    types: {
        action: "set" | "append" | "remove";
        typeQuery: CardTypeQuery<T> | SubtypeQuery<T> | SupertypeQuery<T>;
    }[];
};
export function isLayer4<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
): arg is Layer4<T> {
    return (
        isLayerCommonProperty(parameter, arg) &&
        arg.type === "4" &&
        "types" in arg &&
        Array.isArray(arg.types) &&
        arg.types.every(
            (e) =>
                isRecord(e) &&
                "type" in e &&
                (e.type === "set" ||
                    e.type === "append" ||
                    e.type === "remove") &&
                "query" in arg &&
                (isCardTypeQuery(e.query, parameter) ||
                    isSubtypeQuery(e.query, parameter) ||
                    isSupertypeQuery(e.query, parameter)),
        )
    );
}

function isRecord(arg: unknown): arg is Record<string, unknown> {
    return typeof arg === "object" && arg !== null;
}

// Sample
const urborg: Layer4 = {
    type: "4",
    affected: {
        zone: "Battlefield",
        characteristics: { card_types: ["Land"] },
    },
    types: [{ action: "append", typeQuery: ["Swamp"] }],
};
const bloodMoon: Layer4 = {
    type: "4",
    affected: {
        zone: "Battlefield",
        characteristics: { card_types: ["Land"], supertypes: [] }, // FIXME: 特性クエリ
    },
    types: [{ action: "set", typeQuery: ["Mountain"] }],
};

// Sample2
const rustedRelic: Layer4<{ this: { type: "gameObject" } }> = {
    type: "4",
    affected: { argumentName: "this" },
    types: [{ action: "append", typeQuery: ["Artifact", "Creature"] }],
};
