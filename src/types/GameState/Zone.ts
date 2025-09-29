import type { Player } from "../GameObject/Player.js";

/** 領域の種別 */
export type ZoneType =
    | typeof Battlefield
    | typeof Exile
    | typeof Stack
    | typeof Hand
    | typeof Library
    | typeof Graveyard
    | typeof Command;

export const Battlefield = {
    name: "Battlefield",
    hasOwner: false,
    hasOrder: true,
} as const;
export const Exile = {
    name: "Exile",
    hasOwner: false,
    hasOrder: false,
} as const;
export const Stack = {
    name: "Stack",
    hasOwner: false,
    hasOrder: true,
} as const;
export const Hand = { name: "Hand", hasOwner: true, hasOrder: false } as const;
export const Library = {
    name: "Library",
    hasOwner: true,
    hasOrder: true,
} as const;
export const Graveyard = {
    name: "Graveyard",
    hasOwner: true,
    hasOrder: true,
} as const;
export const Command = {
    name: "Command",
    hasOwner: true,
    hasOrder: false,
} as const;

export const zoneTypes: ZoneType[] = [
    Battlefield,
    Exile,
    Stack,
    Hand,
    Library,
    Graveyard,
    Command,
];

/** 領域 */
export class Zone {
    /** 領域の種別 */
    zoneType: ZoneType;
    /** 領域のオーナー */
    owner: Player | undefined;

    /**
     * @param zoneType 領域の種別
     * @param owner 領域のオーナー
     */
    constructor(zoneType: ZoneType, owner?: Player) {
        this.zoneType = zoneType;
        if (zoneType.hasOwner && owner === undefined) {
            throw new Error("owner of zone is undefined");
        } else {
            this.owner = owner;
        }
    }
}
