import type { Player } from "../GameObject/Player.js";

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
    type: ZoneType;
    owner: Player | undefined;
};
