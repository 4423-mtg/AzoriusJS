import type { Player } from "./Player.js";
const { randomUUID } = await import("node:crypto");

/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
export type GameObject = {
    objectId: GameObjectId;
} & GameObjectProperty;

export type GameObjectProperty = {
    owner: Player | undefined;
    controller: Player | undefined;
};
export type GameObjectParameter = Partial<GameObjectProperty>;

export type GameObjectId = ReturnType<typeof randomUUID>;

export function createGameObject(parameters?: GameObjectParameter): GameObject {
    return {
        objectId: createGameObjectId(),
        owner: parameters?.owner,
        controller: parameters?.owner,
    };
}

function createGameObjectId() {
    return randomUUID();
}
