// MARK: 型定義: 5
import type { ColorQuery } from "../../Query/ArrayQuery.js";
import { isColorQuery, type QueryParameter } from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** 色変更 */
export type Layer5<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "5";
    color: ColorQuery<T>;
};
export function isLayer5<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is Layer5<T> {
    return (
        isLayerCommonProperty(parameter, arg) &&
        arg.type === "5" &&
        "color" in arg &&
        isColorQuery(parameter, arg.color)
    );
}
