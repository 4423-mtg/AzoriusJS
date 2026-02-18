// MARK: 型定義: 5
import { isColorQuery, type ColorQuery } from "../../Query/SetQuery.js";
import { type QueryParameter } from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** 色変更 */
export type Layer5<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "5";
        color: ColorQuery<T>;
    };
export function isLayer5(arg: unknown): arg is Layer5 {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "5" &&
        "color" in arg &&
        isColorQuery(arg.color)
    );
}
