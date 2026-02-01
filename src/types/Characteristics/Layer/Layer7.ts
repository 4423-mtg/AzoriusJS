// MARK: 型定義: 7a

import type { GameObject } from "../../GameObject/GameObject.js";
import { isPTSpec, type PTSpec } from "../../Query/GameObjectQuery.js";
import type { MultiSpec, SingleSpec } from "../../Query/Query.js";
import type { Characteristics } from "../Characteristic.js";
import { isLayerCommonParameter, type LayerCommonParameter } from "./Layer.js";

/** パワー・タフネスを定義する特性定義能力 */
export type Layer7a = LayerCommonParameter & {
    type: "7a";
    PT: PTSpec;
};
export function isLayer7a(arg: unknown): arg is Layer7a {
    return isLayerCommonParameter(arg) && "PT" in arg && isPTSpec(arg.PT);
}

// MARK: 型定義: 7b
/** 基本のパワー・タフネスの変更 */
export type Layer7b = {
    type: "7b";
    affected: MultiSpec<GameObject>;
    PT: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<{ basePower: number; baseToughness: number }>;
};
export function isLayer7b(arg: unknown): arg is Layer7b {
    // return isLayer(arg, "7b");
    // FIXME: 実装
}

// MARK: 型定義: 7c
/** パワー・タフネスの修整 */
export type Layer7c = {
    type: "7c";
    affected: MultiSpec<GameObject>;
    PT: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<{ modifyPower: number; modifyToughness: number }>;
};
export function isLayer7c(arg: unknown): arg is Layer7c {
    // return isLayer(arg, "7c");
    // FIXME: 実装
}

// MARK: 型定義: 7d
/** パワーとタフネスの入れ替え */
export type Layer7d = {
    type: "7d";
    affected: MultiSpec<GameObject>;
};
export function isLayer7d(arg: unknown): arg is Layer7d {
    // return isLayer(arg, "7d");
    // FIXME: 実装
}
