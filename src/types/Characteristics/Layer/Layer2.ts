// MARK: 型定義: 2
import type { PlayerQuery } from "../../Query/ArrayQuery.js";
import { isPlayerQuery, type QueryParameter } from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** コントロール変更 */
export type Layer2<T extends QueryParameter = {}> = LayerCommonProperty & {
    type: "2";
    controller: PlayerQuery<T>;
};
export function isLayer2<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is Layer2<T> {
    return (
        isLayerCommonProperty(parameter, arg) &&
        arg.type === "2" &&
        "controller" in arg &&
        isPlayerQuery(parameter, arg.controller)
    );
}
