export type Color = (typeof colors)[number];
const colors = ["W", "U", "B", "R", "G"] as const;

export type TwoColorCombination = (typeof two_color_combination)[number];
const two_color_combination = [
    "W/U",
    "W/B",
    "U/B",
    "U/R",
    "B/R",
    "B/G",
    "R/G",
    "R/W",
    "G/W",
    "G/U",
] as const;

export type ThreeColorCombination = (typeof three_color_combination)[number];
const three_color_combination = [
    "W/U/B", // Esper
    "U/B/R", // Grixis
    "B/R/G", // Jund
    "R/G/W", // Naya
    "G/W/U", // Bant
    "W/U/R", // Jeskai
    "U/B/G", // Sultai
    "B/R/W", // Mardu
    "R/G/U", // Temur
    "G/W/B", // Abzan
] as const;

export type FourColorCombination = (typeof four_color_combination)[number];
const four_color_combination = [
    "W/U/B/R",
    "U/B/R/G",
    "B/R/G/W",
    "R/G/W/U",
    "G/W/U/B",
] as const;

export type FiveColorCombination = (typeof five_color_combination)[number];
const five_color_combination = ["W/U/B/R/G"] as const;
