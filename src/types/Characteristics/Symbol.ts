import type { ManaType } from "../GameObject/Mana.js";
import type { Color } from "./Color.js";

const manaTypeSymbol = {
    White: "W",
    Blue: "U",
    Black: "B",
    Red: "R",
    Green: "G",
    Colorless: "C",
} as const satisfies Record<ManaType, string>;

export type ManaTypeSymbol<T extends ManaType = ManaType> = T extends ManaType
    ? (typeof manaTypeSymbol)[T]
    : never;

// 混成シンボルは前後の違いがない FIXME: 無色マナ混成シンボル
type _2ColorCombination =
    | "W/U"
    | "W/B"
    | "U/B"
    | "U/R"
    | "B/R"
    | "B/G"
    | "R/G"
    | "R/W"
    | "G/W"
    | "G/U";

type _3ColorCombination =
    | "W/U/B" // Esper
    | "U/B/R" // Grixis
    | "B/R/G" // Jund
    | "R/G/W" // Naya
    | "G/W/U" // Bant
    | "W/U/R" // Jeskai
    | "U/B/G" // Sultai
    | "B/R/W" // Mardu
    | "R/G/U" // Temur
    | "G/W/B"; // Abzan

type _4ColorCombination =
    | "W/U/B/R"
    | "U/B/R/G"
    | "B/R/G/W"
    | "R/G/W/U"
    | "G/W/U/B";

type _5ColorCombination = "W/U/B/R/G";

type Variable = "X" | "Y" | "Z";

export type CostSymbol =
    | ManaSymbol
    | TapSymbol
    | UntapSymbol
    | LoyaltySymbol
    | EnergySymbol
    | TicketSymbol
    | PawprintSymbol;

/** マナ・シンボル */
export type ManaSymbol =
    | MonoColorSymbol
    | NumericalSymbol
    | VariableSymbol
    | HybridSymbol
    | MonocoloredHybridSymbol
    | PhyrexianManaSymbol
    | HybridPhyrexianSymbol
    | SnowManaSymbol;

/** 単色マナ・シンボル */
type MonoColorSymbol = `{${ManaTypeSymbol}}`;
/** 不特定マナ・シンボル */
type NumericalSymbol = `{${number}}`;
/** 変数シンボル */
type VariableSymbol = `{${Variable}}`;
/** 混成マナ・シンボル */
type HybridSymbol = `{${_2ColorCombination}}`;
type MonocoloredHybridSymbol = `{2/${Color}}` | `{C/${Color}}`;
/** ファイレクシアマナ・シンボル */
type PhyrexianManaSymbol = `{${Color}/P}`;
type HybridPhyrexianSymbol = `{${_2ColorCombination}/P}`;
/** 氷雪マナ・シンボル */
type SnowManaSymbol = "{S}";

export type TapSymbol = "{T}";
export type UntapSymbol = "{Q}";
export type LoyaltySymbol =
    | `[+${number | Variable}]`
    | `[-${number | Variable}]`
    | `[0]`;
export type EnergySymbol = "{E}";
export type TicketSymbol = "{TK}";
/** 獣痕シンボル */
export type PawprintSymbol = "{P}";
