// MARK: 型定義: 6
import { isAbilityQuery, type AbilityQuery } from "../../Query/ArrayQuery.js";
import { type QueryParameter } from "../../Query/Query.js";
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
        isLayerCommonProperty(arg) &&
        arg.type === "6" &&
        "ability" in arg &&
        isAbilityQuery(arg.ability, parameter)
    );
}
