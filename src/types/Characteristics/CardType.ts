export const cardTypes = [
    "Artifact",
    "Battle",
    "Conspiracy",
    "Creature",
    "Dungeon",
    "Enchantment",
    "Instant",
    "Kindred",
    "Land",
    "Phenomenon",
    "Plane",
    "Planeswalker",
    "Scheme",
    "Sorcery",
    "Vanguard",
    // Heroは除外
] as const;
export type CardType = (typeof cardTypes)[number];

export function isCardType(arg: unknown): arg is CardType {
    return false;
}
