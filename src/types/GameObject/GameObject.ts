import type { Player } from "./Player.js";

/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
export abstract class GameObject {
    objectId: number;
    owner: Player | undefined;
    controller: Player | undefined;

    private static id_latest = -1;

    constructor(option?: GameObjectOptions) {
        this.objectId = ++GameObject.id_latest;
        this.owner = option?.owner;
        this.controller = option?.controller;
    }
}

export type GameObjectOptions = { owner?: Player; controller?: Player };
