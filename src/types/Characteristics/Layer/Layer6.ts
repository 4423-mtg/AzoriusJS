// MARK: 型定義: 6
import { isAbilityQuery, type AbilityQuery } from "../../Query/SetQuery.js";
import { type QueryParameter } from "../../Query/QueryParameter.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** 能力変更 */
export type Layer6<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "6";
        ability: AbilityQuery<T>;
    };
export function isLayer6(arg: unknown): arg is Layer6 {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "6" &&
        "ability" in arg &&
        isAbilityQuery(arg.ability)
    );
}
