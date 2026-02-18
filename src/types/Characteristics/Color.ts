export type Color = "White" | "Blue" | "Black" | "Red" | "Green";
export type Colorless = "Colorless";

export function isColor(arg: unknown): arg is Color {
    return false;
}
