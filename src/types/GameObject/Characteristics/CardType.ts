export type CardType = (typeof card_types)[number];
const card_types = [
    "artifact",
    "battle",
    "conspiracy",
    "creature",
    "dungeon",
    "enchantment",
    "instant",
    "kindred",
    "land",
    "phenomenon",
    "plane",
    "planeswalker",
    "scheme",
    "sorcery",
    "vanguard",
] as const;
