import type { Zone } from "../GameState/Zone.js";
import type { Ability } from "./Ability.js";
import type { GameObject } from "./GameObject.js";

/** スタック上の能力 */
export type StackedAbility = GameObject & {
    /** 領域 */
    zone?: Zone;
    /** 発生源となった能力 */
    ability: Ability;
    /** 能力の発生源オブジェクト */
    source?: GameObject;
    /** 能力の種類。起動型、誘発型 */
    kind: string;

    is_modal: boolean;
    // modes;
    // chosen_mode;
    // TODO: いろいろ
    target: GameObject[];
    distribution: Map<GameObject, number>;
    // paid_cost;

    // resolve
};

export function isStackedAbility(arg: unknown): arg is StackedAbility {
    return false;
}
