import type { GameObject } from "./GameObject.js";
import type { Ability } from "./Ability.js";
import type { Counter } from "./Counter.js";
import type { PlayerInfo } from "../GameState/Match.js";

/** プレイヤー */
export type Player = GameObject & {
    info: PlayerInfo;
    life: number;
    counters: Counter[];
    ability: Ability[];
    won: boolean;
    lost: boolean;
    controller: Player | undefined;
};
