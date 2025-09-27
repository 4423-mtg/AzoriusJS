// MARK: Player

import type { PlayerInfo } from "../GameState/Game.js";
import { GameObject } from "./GameObject.js";
import type { Ability } from "./Ability.js";
import type { Counter } from "./Counter.js";

/** プレイヤー */
export class Player extends GameObject {
    info: PlayerInfo;
    life: number;
    counters: Counter[] = [];
    abilities: Ability[] = [];

    /** 勝敗 */
    won: boolean = false;
    lost: boolean = false;

    constructor(info: PlayerInfo, life?: number) {
        super(); // TODO: プレイヤーのオーナー・コントローラー？
        this.info = info;
        this.life = life ?? 20;
    }

    equals(player: Player): boolean {
        return this.id === player.id;
    }
}
