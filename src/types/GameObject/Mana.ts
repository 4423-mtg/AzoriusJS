import type { Color, Colorless } from "../Characteristics/Color.js";
import type { GameObject } from "./GameObject.js";

/** マナのタイプ */
export type ManaType = Color | Colorless;

/** マナ */
export type Mana = GameObject & {
    type: ManaType;
    // TODO: 特殊効果
};
