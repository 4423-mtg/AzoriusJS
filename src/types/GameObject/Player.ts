import type { GameObject } from "./GameObject.js";
import { isAbility, type Ability } from "./Ability.js";
import { isCounterOnObject, type CounterOnObject } from "./Counter.js";
import { isPlayerInfo, type PlayerInfo } from "../GameState/Match.js";

/** プレイヤー */
export type Player = GameObject & {
    info: PlayerInfo;
    life: number;
    counters: CounterOnObject[];
    ability: Ability[];
    won: boolean;
    lost: boolean;
    controller: Player | undefined;
};

export function isPlayer(arg: unknown): arg is Player {
    if (typeof arg === "object" && arg !== null) {
        const info = "info" in arg && isPlayerInfo(arg.info);
        const life = "life" in arg && typeof arg.life === "number";
        const counters =
            "counters" in arg &&
            Array.isArray(arg.counters) &&
            arg.counters.every((e) => isCounterOnObject(e));
        const ability =
            "ability" in arg &&
            Array.isArray(arg.ability) &&
            arg.ability.every((e) => isAbility(e));
        const won = "won" in arg && typeof arg.won === "boolean";
        const lost = "lost" in arg && typeof arg.lost === "boolean";
        const controller =
            "controller" in arg &&
            (arg.controller === undefined || isPlayer(arg.controller));
        return (
            typeof arg === "object" &&
            arg !== null &&
            info &&
            life &&
            counters &&
            ability &&
            won &&
            lost &&
            controller
        );
    } else {
        return false;
    }
}
