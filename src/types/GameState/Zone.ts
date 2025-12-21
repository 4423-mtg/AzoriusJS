import type { Player } from "../GameObject/Player.js";
const { randomUUID } = await import("node:crypto");

/** 領域の種別 */
export type ZoneType =
    | "Battlefield"
    | "Exile"
    | "Stack"
    | "Hand"
    | "Library"
    | "Graveyard"
    | "Command";

export function hasOwner(zonetype: ZoneType): boolean {
    const owned: ZoneType[] = ["Hand", "Library", "Graveyard"];
    const notOwned: ZoneType[] = ["Battlefield", "Exile", "Stack", "Command"];
    if (owned.includes(zonetype)) {
        return true;
    } else if (notOwned.includes(zonetype)) {
        return false;
    } else {
        throw Error();
    }
}

/** 領域 */
export type Zone = {
    id: ZoneId;
    type: ZoneType;
    owner: Player | undefined;
};
export type ZoneParameters = Omit<Zone, "id" | "owner"> &
    Partial<Pick<Zone, "owner">>;
export type ZoneId = ReturnType<typeof randomUUID>;
export function createZone(params: ZoneParameters): Zone {
    return {
        id: createZoneId(),
        type: params.type,
        owner: params.owner,
    };
}
export function createZoneId(): ZoneId {
    return randomUUID();
}
