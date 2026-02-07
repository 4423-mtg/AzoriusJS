// MARK: 型定義: 3
import {
    isTextQuery,
    type QueryParameter,
    type TextQuery,
} from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** 文章変更 */
export type Layer3<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "3";
    text: TextQuery<T>; // FIXME: 文章の型
};
export function isLayer3<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
): arg is Layer3<T> {
    return (
        isLayerCommonProperty(parameter, arg) &&
        arg.type === "3" &&
        "text" in arg &&
        isTextQuery(parameter, arg.text)
    );
}
