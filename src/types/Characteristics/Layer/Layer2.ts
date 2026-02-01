// MARK: 型定義: 2

import type { GameObject } from "../../GameObject/GameObject.js";
import type { Player } from "../../GameObject/Player.js";
import type { MultiSpec, SingleSpec } from "../../Query/Query.js";
import type { Characteristics } from "../Characteristic.js";

/** コントロール変更 */
export type Layer2 = {
    type: "2";
    affected: MultiSpec<GameObject>;
    controllerAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<Player>;
};
export function isLayer2(arg: unknown): arg is Layer2 {
    // return isLayer(arg, "2");
    // FIXME: 実装
}
class AlterController {
    alter: () => SingleSpec<Player>;
    constructor(alter: () => SingleSpec<Player>) {
        this.alter = alter;
    }
}
