import type { Zone } from "../GameState/Game.js";
import type { Ability } from "./Ability.js";
import { GameObject } from "./GameObject.js";

/** スタック上の能力 */
export class StackedAbility extends GameObject {
    /** 領域 */
    zone?: Zone;
    /** 発生源となった能力 */
    ability: Ability;
    /** 能力の発生源オブジェクト */
    source?: GameObject;

    /** 能力の種類。起動型、誘発型 */
    get ability_type() {
        return this.ability.type;
    }

    //
    is_modal: boolean;
    modes;
    chosen_mode;
    // TODO: いろいろ
    target: GameObject[];
    distribution: Map<GameObject, number>;
    paid_cost;
    resolve: Resolve;

    constructor(ability: Ability, controller: Player, source?: GameObject) {
        super();
        this.ability = ability;
        this.controller = controller;
        this.source = source;
    }
}
