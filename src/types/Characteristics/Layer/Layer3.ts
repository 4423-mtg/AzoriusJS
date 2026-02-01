// MARK: 型定義: 3

import type { GameObject } from "../../GameObject/GameObject.js";
import type { MultiSpec } from "../../Query/Query.js";
import type { Characteristics } from "../Characteristic.js";

/** 文章変更 */
export type Layer3 = {
    type: "3";
    affected: MultiSpec<GameObject>;
    textAltering: (current: Characteristics, source?: GameObject) => any; // FIXME: 文章の型
};
export function isLayer3(arg: unknown): arg is Layer3 {
    // return isLayer(arg, "3");
    // FIXME: 実装
}
class AlterText {
    alter: () => MultiSpec<CardText>;
    constructor(alter: () => MultiSpec<CardText>) {
        this.alter = alter;
    }
}
