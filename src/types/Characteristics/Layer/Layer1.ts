// MARK: 型定義: 1a
import type { GameObject } from "../../GameObject/GameObject.js";
import type { Game } from "../../GameState/Game.js";
import {
    isCopiableValueQuery,
    type CopiableValueQuery,
    type QueryParameter,
} from "../../Query/Query.js";
import type { Characteristics } from "../Characteristic.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** コピー可能な効果の適用 */
export type Layer1a<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "1a";
    copiableValue: CopiableValueQuery<T>;
};
export function isLayer1a<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
): arg is Layer1a<T> {
    return (
        isLayerCommonProperty(parameter, arg) &&
        arg.type === "1a" &&
        "copiableValue" in arg &&
        isCopiableValueQuery(parameter, arg.copiableValue)
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
export type Layer1b<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "1b";
    copiableValue: CopiableValueQuery<T>;
};
export function isLayer1b<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
): arg is Layer1b<T> {
    return (
        isLayerCommonProperty(parameter, arg) &&
        arg.type === "1b" &&
        "copiableValue" in arg &&
        isCopiableValueQuery(parameter, arg.copiableValue)
    );
}

// =============================================================
const sample: Record<
    string,
    | Layer1a<{ this: { type: "gameObject" }; chosen: { type: "gameObject" } }>
    | Layer1b<{ this: { type: "gameObject" }; chosen: { type: "gameObject" } }>
> = {
    // 水銀のガルガンチュアン
    // TODO: PT特性定義能力はコピーされない
    "Quicksilver Gargantuan": {
        type: "1a",
        copiableValue: {
            original: { object: { argument: "chosen" } },
            overwrite: { power: 7, toughness: 7 },
        },
        // コピー効果が能力を追加する場合、それは
        // テキストとして追加される？能力として追加される？
    },
    // 巨体変異
    "Hulking Metamorph": {
        type: "1a",
        copiableValue: {
            original: { object: { argument: "chosen" } },
            overwrite: {
                power: {
                    valueType: "power",
                    card: { argument: "this" },
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
