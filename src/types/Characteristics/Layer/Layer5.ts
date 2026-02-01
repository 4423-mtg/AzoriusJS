// MARK: 型定義: 5

import type { GameObject } from "../../GameObject/GameObject.js";
import type { MultiSpec } from "../../Query/QueryFunction.js";
import type { Characteristics } from "../Characteristic.js";
import type { Color } from "../Color.js";

/** 色変更 */
export type Layer5 = {
    type: "5";
    affected: MultiSpec<GameObject>;
    colorAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => MultiSpec<Color>;
};
export function isLayer5(arg: unknown): arg is Layer5 {
    // return isLayer(arg, "5");
    // FIXME: 実装
}
class AlterColor {
    alter: () => MultiSpec<Color>;
    constructor(alter: () => MultiSpec<Color>) {
        this.alter = alter;
    }
}
