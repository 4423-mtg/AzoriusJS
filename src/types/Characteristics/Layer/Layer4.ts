// MARK: 型定義: 4

import type { GameObject } from "../../GameObject/GameObject.js";
import type { MultiSpec } from "../../Query/QueryFunction.js";
import type { CardType } from "../CardType.js";
import type { CardTypeSet, Characteristics } from "../Characteristic.js";
import type { Subtype } from "../Subtype.js";
import type { Supertype } from "../Supertype.js";

/** タイプ変更 */
export type Layer4 = {
    type: "4";
    affected: MultiSpec<GameObject>;
    typeAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => CardTypeSet;
};
export function isLayer4(arg: unknown): arg is Layer4 {
    // return isLayer(arg, "4");
    // FIXME: 実装
}
class AlterTypes {
    alter: () => {
        cardType: MultiSpec<CardType>;
        subtype: MultiSpec<Subtype>;
        supertype: MultiSpec<Supertype>;
    };
    constructor(
        alter: () => {
            cardType: MultiSpec<CardType>;
            subtype: MultiSpec<Subtype>;
            supertype: MultiSpec<Supertype>;
        },
    ) {
        this.alter = alter;
    }
}
