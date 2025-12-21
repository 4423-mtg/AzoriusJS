import type { Zone } from "../GameState/Zone.js";
import type { Card } from "./Card/Card.js";
import type { Counter } from "./Counter.js";
import type { Marker } from "./Marker.js";
import type { Sticker } from "./Sticker.js";
const { randomUUID } = await import("node:crypto");

/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
export type GameObject = {
    objectId: GameObjectId;
    zone: Zone | undefined;
    counters: Counter[] | undefined;
    stickers: Sticker[] | undefined;
    markers: Marker[] | undefined;
};

export type GameObjectParameters = Partial<Omit<GameObject, "objectId">>;

export type GameObjectId = ReturnType<typeof randomUUID>;

export function createGameObject(params?: GameObjectParameters): GameObject {
    return {
        objectId: createGameObjectId(),
        zone: params?.zone,
        counters: params?.counters,
        stickers: params?.stickers,
        markers: params?.markers,
    };
}

function createGameObjectId(): GameObjectId {
    return randomUUID();
}

// ==========================================================================
export function isInBattlefield(obj: GameObject): obj is Card {
    return obj.zone?.type === "Battlefield";
}
