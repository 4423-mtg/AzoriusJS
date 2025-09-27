"use strict";
import type { Card } from "./Card/Card.js";
import type { Player } from "./Player.js";

/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
export abstract class GameObject {
    id: number;
    owner: Player;
    controller: Player;

    private static id_latest = 0;

    constructor(owner: Player, controller?: Player) {
        this.id = ++GameObject.id_latest;
        this.owner = owner;
        this.controller = controller ?? this.owner;
    }
}
