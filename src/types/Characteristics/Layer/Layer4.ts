// MARK: 型定義: 4
import {
    isCardTypeQuery,
    isSubtypeQuery,
    isSupertypeQuery,
    type CardTypeQuery,
    type SubtypeQuery,
    type SupertypeQuery,
} from "../../Query/SetQuery.js";
import { type QueryParameter } from "../../Query/QueryParameter.js";
import { landTypes } from "../Subtype.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** タイプ変更 */
export type Layer4<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "4";
        types: {
            action: "set" | "append" | "remove";
            typeQuery:
                | CardTypeQuery<T>
                | SubtypeQuery<T>
                | SupertypeQuery<T>
                | (CardTypeQuery<T> | SubtypeQuery<T> | SupertypeQuery<T>)[];
        }[];
    };
export function isLayer4(arg: unknown): arg is Layer4 {
    return (
        isLayerCommonProperty(arg) &&
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
                (isCardTypeQuery(e.query) ||
                    isSubtypeQuery(e.query) ||
                    isSupertypeQuery(e.query)),
        )
    );
}

function isRecord(arg: unknown): arg is Record<string, unknown> {
    return typeof arg === "object" && arg !== null;
}

// ================================================================
const sample: Record<string, Layer4> = {
    // アーボーグ
    "Urborg, Tomb of Yawgmoth": {
        type: "4",
        // affected: {
        //     zone: { type: "Battlefield" },
        //     characteristics: { cardType: ["Land"] },
        // },
        types: [{ action: "append", typeQuery: ["Swamp"] }],
    },
    // 血染めの月
    "Blood Moon": {
        type: "4",
        // affected: {
        //     zone: { type: "Battlefield" },
        //     characteristics: {
        //         operation: "and",
        //         operand: [
        //             { operation: "not", operand: { supertype: ["Basic"] } },
        //             { cardType: ["Land"] },
        //         ],
        //     },
        // },
        types: [
            { action: "remove", typeQuery: [...landTypes] }, // FIXME: readonlyのせいでリマップが必要になっている
            { action: "set", typeQuery: ["Mountain"] },
        ],
    },
    // 生命と枝
    "Life and Limb": {
        type: "4",
        // affected: {
        //     zone: { type: "Battlefield" },
        //     characteristics: {
        //         operation: "or",
        //         operand: [
        //             { subtype: ["Forest"] }, // テキストではサブタイプとは書いてないので外したほうがいいかも
        //             { subtype: ["Saproling"] },
        //         ],
        //     },
        // },
        types: [
            {
                action: "append",
                typeQuery: ["Saproling", "Creature", "Forest", "Land"],
            },
        ],
    },
};

// Sample2
const rustedRelic: Layer4<{ this: { type: "gameObject" } }> = {
    type: "4",
    // affected: { argument: "this" },
    types: [{ action: "append", typeQuery: ["Artifact", "Creature"] }],
};
