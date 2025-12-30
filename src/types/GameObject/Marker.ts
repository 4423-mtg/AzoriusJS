export type Marker = string;

export function isMarker(arg: unknown): arg is Marker {
    return typeof arg === "string";
}
