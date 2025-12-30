import { isPlayer, type Player } from "../GameObject/Player.js";
import { isUUID } from "../Other.js";
const { randomUUID } = await import("node:crypto");

// ZoneType ===================================================================
const zonetypes = [
    "Battlefield",
    "Exile",
    "Stack",
    "Hand",
    "Library",
    "Graveyard",
    "Command",
] as const;

/** 領域の種別 */
export type ZoneType = (typeof zonetypes)[number];

export function isZoneType(arg: unknown): arg is ZoneType {
    return (
        typeof arg === "string" &&
        zonetypes.map((t) => arg === t).some((e) => e)
    );
}

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

// Zone ========================================================================
/** 領域 */
export type Zone = {
    id: ZoneId;
    type: ZoneType;
    owner: Player | undefined;
};
export type ZoneParameters = Omit<Zone, "id" | "owner"> &
    Partial<Pick<Zone, "owner">>;

export function createZone(params: ZoneParameters): Zone {
    return {
        id: createZoneId(),
        type: params.type,
        owner: params.owner,
    };
}
export function isZone(arg: unknown): arg is Zone {
    if (typeof arg === "object" && arg !== null) {
        const hasId = "id" in arg && isZoneId(arg.id);
        const hasType = "type" in arg && isZoneType(arg.type);
        const hasOwner =
            "owner" in arg && (arg.owner === undefined || isPlayer(arg.owner));
        return hasId && hasType && hasOwner;
    } else {
        return false;
    }
}

// ZoneId =========================================================
export type ZoneId = ReturnType<typeof randomUUID>;
export function createZoneId(): ZoneId {
    return randomUUID();
}
export function isZoneId(obj: unknown): obj is ZoneId {
    return isUUID(obj);
}
