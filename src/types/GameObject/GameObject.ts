import type { Zone } from "../GameState/Zone.js";
import type { Counter } from "./Counter.js";
import type { Marker } from "./Marker.js";
import type { Player } from "./Player.js";
import type { Sticker } from "./Sticker.js";
const { randomUUID } = await import("node:crypto");

/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
export type GameObject = {
    objectId: GameObjectId;
    owner: Player | undefined;
    controller: Player | undefined;
    zone: Zone | undefined;
    counters: Counter[] | undefined;
    stickers: Sticker[] | undefined;
    markers: Marker[] | undefined;
};

export type GameObjectParameter = Partial<Omit<GameObject, "objectId">>;

export type GameObjectId = ReturnType<typeof randomUUID>;

export function createGameObject(parameters?: GameObjectParameter): GameObject {
    return {
        objectId: createGameObjectId(),
        owner: parameters?.owner,
        controller: parameters?.owner,
        zone: parameters?.zone,
        counters: parameters?.counters,
        stickers: parameters?.stickers,
        markers: parameters?.markers,
    };
}

function createGameObjectId() {
    return randomUUID();
}
