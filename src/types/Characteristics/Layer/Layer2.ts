// MARK: 型定義: 2
import { isPlayerQuery, type PlayerQuery } from "../../Query/SetQuery.js";
import { type QueryParameter } from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** コントロール変更 */
export type Layer2<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "2";
        controller: PlayerQuery<T>;
    };
export function isLayer2(arg: unknown): arg is Layer2 {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "2" &&
        "controller" in arg &&
        isPlayerQuery(arg.controller)
    );
}
