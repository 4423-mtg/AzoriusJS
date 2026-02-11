// MARK: 型定義: 6
import type { AbilityQuery } from "../../Query/ArrayQuery.js";
import { isAbilityQuery, type QueryParameter } from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** 能力変更 */
export type Layer6<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "6";
    ability: AbilityQuery<T>;
};
export function isLayer6<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is Layer6<T> {
    return (
        isLayerCommonProperty(parameter, arg) &&
        arg.type === "6" &&
        "ability" in arg &&
        isAbilityQuery(parameter, arg.ability)
    );
}
