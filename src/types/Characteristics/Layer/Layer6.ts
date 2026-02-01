// MARK: 型定義: 6

import type { Ability } from "../../GameObject/Ability.js";
import type { GameObject } from "../../GameObject/GameObject.js";
import type { MultiSpec } from "../../Query/Query.js";
import type { Characteristics } from "../Characteristic.js";

/** 能力変更 */
export type Layer6 = {
    type: "6";
    affected: MultiSpec<GameObject>;
    abilityAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => MultiSpec<Ability>;
};
export function isLayer6(arg: unknown): arg is Layer6 {
    // return isLayer(arg, "6");
    // FIXME: 実装
}
class AlterAbility {
    alter: () => MultiSpec<Ability>;
    constructor(alter: () => MultiSpec<Ability>) {
        this.alter = alter;
    }
}
