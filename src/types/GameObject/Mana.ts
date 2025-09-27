import type { Color } from "./Characteristics/Color.js";

export type ManaType = Color | "C";

export class Mana {
    manatype: ManaType;

    constructor(manatype: ManaType) {
        this.manatype = manatype;
    }
    // TODO: 特殊効果
}
