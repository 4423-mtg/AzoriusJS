import { isZone, type Zone } from "../GameState/Zone.js";
import { isUUID } from "../Other.js";
import type { Card } from "./Card/Card.js";
import { isCounterOnObject } from "./Counter.js";
import { isMarker } from "./Marker.js";
import { isSticker } from "./Sticker.js";
const { randomUUID } = await import("node:crypto");

/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
export type GameObject = {
    objectId: GameObjectId;
    zone: Zone | undefined;
};
export function isGameObject(arg: unknown): arg is GameObject {
    if (typeof arg === "object" && arg !== null) {
        const objectId = "objectId" in arg && isGameObjectId(arg.objectId);
        const zone =
            "zone" in arg && (isZone(arg.zone) || arg.zone === undefined);
        const counters =
            "counters" in arg &&
            ((Array.isArray(arg.counters) &&
                arg.counters.every((e) => isCounterOnObject(e))) ||
                arg.counters === undefined);
        const stickers =
            "stickers" in arg &&
            ((Array.isArray(arg.stickers) &&
                arg.stickers.every((e) => isSticker(e))) ||
                arg.stickers === undefined);
        const markers =
            "markers" in arg &&
            ((Array.isArray(arg.markers) &&
                arg.markers.every((e) => isMarker(e))) ||
                arg.markers === undefined);
        return objectId && zone && counters && stickers && markers;
    } else {
        return false;
    }
}

export type GameObjectParameters = Partial<Omit<GameObject, "objectId">>;

export type GameObjectId = ReturnType<typeof randomUUID>;
export function isGameObjectId(arg: unknown): arg is GameObjectId {
    return isUUID(arg);
}

export function createGameObject(params?: GameObjectParameters): GameObject {
    return {
        objectId: createGameObjectId(),
        zone: params?.zone,
    };
}

function createGameObjectId(): GameObjectId {
    return randomUUID();
}

// ==========================================================================
export function isInBattlefield(obj: GameObject): obj is Card {
    return obj.zone?.type === "Battlefield";
}
