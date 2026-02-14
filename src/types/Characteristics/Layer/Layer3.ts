// MARK: 型定義: 3
import { isTextQuery, type TextQuery } from "../../Query/ArrayQuery.js";
import { type QueryParameter } from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** 文章変更 */
export type Layer3<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "3";
        text: TextQuery<T>; // FIXME: 文章の型
    };
export function isLayer3(arg: unknown): arg is Layer3 {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "3" &&
        "text" in arg &&
        isTextQuery(arg.text)
    );
}
