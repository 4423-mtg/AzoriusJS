// MARK: 型定義: 4
import {
    isTypeQuery,
    type QueryParameter,
    type TypeQuery,
} from "../../Query/Query.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** タイプ変更 */
export type Layer4<T extends QueryParameter> = LayerCommonProperty<T> & {
    type: "4";
    types: TypeQuery<T>;
};
export function isLayer4<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
): arg is Layer4<T> {
    return (
        isLayerCommonProperty(parameter, arg) &&
        arg.type === "4" &&
        "types" in arg &&
        isTypeQuery(parameter, arg.types)
    );
}
