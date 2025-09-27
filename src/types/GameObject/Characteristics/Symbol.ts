import type { Color, TwoColorCombination } from "./Color.js";

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
type MonoColorSymbol = `{${Color | "C"}}`;
/** 不特定マナ・シンボル */
type NumericalSymbol = `{${[
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16
][number]}}`;
type VariableSymbol = "{X}" | "{Y}" | "{Z}";
/** 混成マナ・シンボル */
type HybridSymbol = `{${TwoColorCombination}}`;
type MonocoloredHybridSymbol = `{2/${Color}}` | `{C/${Color}}`;
/** ファイレクシアマナ・シンボル */
type PhyrexianManaSymbol = `{${Color}/P}`;
type HybridPhyrexianSymbol = `{${TwoColorCombination}/P}`;
/** 氷雪マナ・シンボル */
type SnowManaSymbol = "{S}";

export type TapSymbol = "{T}";
export type UntapSymbol = "{Q}";
export type LoyaltySymbol = "[]"; // FIXME:
export type EnergySymbol = "{E}";
export type TicketSymbol = "{TK}";
/** 獣痕シンボル */
export type PawprintSymbol = "{P}";
