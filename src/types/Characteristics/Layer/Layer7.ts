// MARK: 型定義: 7a
import {
    isPTQuery,
    type PTQuery,
    type QueryParameter,
} from "../../Query/Query.js";
import { isLayerCommonParameter, type LayerCommonParameter } from "./Layer.js";

/** パワー・タフネスを定義する特性定義能力 */
export type Layer7a<T extends QueryParameter> = LayerCommonParameter<T> & {
    type: "7a";
    PT: PTQuery<T>;
};
export function isLayer7a<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is Layer7a<T> {
    return (
        isLayerCommonParameter(parameters, arg) &&
        arg.type === "7a" &&
        "PT" in arg &&
        isPTQuery(arg.PT)
    );
}

// MARK: 型定義: 7b
/** 基本のパワー・タフネスの変更 */
export type Layer7b<T extends QueryParameter> = LayerCommonParameter<T> & {
    type: "7b";
    PT: PTQuery<T>;
};
export function isLayer7b<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is Layer7b<T> {
    return (
        isLayerCommonParameter(parameters, arg) &&
        arg.type === "7b" &&
        "PT" in arg &&
        isPTQuery(arg.PT)
    );
}

// MARK: 型定義: 7c
/** パワー・タフネスの修整 */
export type Layer7c<T extends QueryParameter> = LayerCommonParameter<T> & {
    type: "7c";
    PT: PTQuery<T>;
};
export function isLayer7c<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is Layer7c<T> {
    return (
        isLayerCommonParameter(parameters, arg) &&
        arg.type === "7c" &&
        "PT" in arg &&
        isPTQuery(arg.PT)
    );
}

// MARK: 型定義: 7d
/** パワーとタフネスの入れ替え */
export type Layer7d<T extends QueryParameter> = LayerCommonParameter<T> & {
    type: "7d";
};
export function isLayer7d<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is Layer7d<T> {
    return isLayerCommonParameter(parameters, arg) && arg.type === "7d";
}
