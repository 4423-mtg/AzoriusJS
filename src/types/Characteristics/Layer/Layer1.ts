// MARK: 型定義: 1a
import type { GameObject } from "../../GameObject/GameObject.js";
import type { Game } from "../../GameState/Game.js";
import { type QueryParameter } from "../../Query/QueryParameter.js";
import {
    isScalarQuery,
    type ScalarQuery,
    type ScalarQueryOperand,
} from "../../Query/ScalarQuery.js";
import type { _q } from "../../Query/ScalarQuery/CopiableValueQuery.js";
import type { SetQuery } from "../../Query/SetQuery.js";
import type { Characteristics, CopiableValue } from "../Characteristic.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** コピー可能な効果の適用 */
export type Layer1a<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "1a";
        copiableValue: ScalarQuery<CopiableValue, T>;
    };
export function isLayer1a(arg: unknown): arg is Layer1a {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "1a" &&
        "copiableValue" in arg &&
        isScalarQuery(arg.copiableValue, "copiableValue")
    );
}
function applyLayer1a<T extends QueryParameter>(
    layer: Layer1a<T>,
    game: Game,
): { object: GameObject; characteristics: Characteristics }[] {
    // TODO:
    return [];
}

// MARK: 型定義: 1b
/** 裏向きによる特性変更 */
export type Layer1b<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "1b";
        copiableValue: ScalarQuery<CopiableValue, T>;
    };
export function isLayer1b(arg: unknown): arg is Layer1b {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "1b" &&
        "copiableValue" in arg &&
        isScalarQuery(arg.copiableValue, "copiableValue")
    );
}

// =============================================================
const sample: Record<string, Layer1a | Layer1b> = {
    // 水銀のガルガンチュアン
    // TODO: PT特性定義能力はコピーされない
    "Quicksilver Gargantuan": {
        type: "1a",
        copiableValue: {
            scalarType: "copiableValue",
            query: {
                original: {
                    scalarType: "copiableValue",
                    query: {
                        object: {
                            elementType: "gameObject",
                            query: { argument: "chosen" },
                        } satisfies SetQuery<GameObject, QueryParameter>,
                    },
                } satisfies ScalarQuery<CopiableValue, QueryParameter>,
                overwrite: {
                    power: { scalarType: "numericalValue", query: 7 },
                    toughness: { scalarType: "numericalValue", query: 7 },
                } satisfies Partial<_q<QueryParameter>>,
            },
        } satisfies ScalarQuery<CopiableValue, QueryParameter>,
        // コピー効果が能力を追加する場合、それは
        // テキストとして追加される？能力として追加される？ => テキスト
    },
    // 巨体変異
    "Hulking Metamorph": {
        type: "1a",
        copiableValue: {
            original: { object: { argument: "chosen" } },
            overwrite: {
                power: {
                    valueType: "power",
                    card: {
                        argument: "this" as const,
                    },
                },
                toughness: {
                    valueType: "toughness",
                    card: { argument: "this" },
                },
            },
            add: {
                cardTypes: ["Artifact", "Creature"],
            },
        },
    },
};
