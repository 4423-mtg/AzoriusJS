// MARK: 型定義: 2
import { type QueryParameter } from "../../Query/QueryParameter.js";
import {
    isPlayerQuery,
    type PlayerQuery,
} from "../../Query/SetQuery/PlayerQuery.js";
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
