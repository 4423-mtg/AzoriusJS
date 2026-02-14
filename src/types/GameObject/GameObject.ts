import { isZone, type Zone } from "../GameState/Zone.js";
import { isUUID } from "../Other.js";
import type { Card } from "./Card/Card.js";
const { randomUUID } = await import("node:crypto");

/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
export type GameObject = {
    objectId: GameObjectId;
    zone: Zone | undefined;
};
export type GameObjectParameters = Partial<Omit<GameObject, "objectId">>;
export type GameObjectId = ReturnType<typeof randomUUID>;

export function createGameObject(): GameObject {
    return {
        objectId: createGameObjectId(),
        zone: undefined,
    };
}
function createGameObjectId(): GameObjectId {
    return randomUUID();
}

// ==========================================================================
function isInBattlefield(obj: GameObject): obj is Card {
    return obj.zone?.type === "Battlefield";
}

// ==========================================================================
// MARK: 型ガード
export function isGameObject(arg: unknown): arg is GameObject {
    if (typeof arg === "object" && arg !== null) {
        const objectId = "objectId" in arg && isGameObjectId(arg.objectId);
        const zone =
            "zone" in arg && (isZone(arg.zone) || arg.zone === undefined);
        return objectId && zone;
    } else {
        return false;
    }
}
function isGameObjectId(arg: unknown): arg is GameObjectId {
    return isUUID(arg);
}
