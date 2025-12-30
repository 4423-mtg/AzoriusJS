import { isNonNullObject } from "../Other.js";
import type { GameObject } from "./GameObject.js";

export type Sticker = GameObject & {
    name: string;
};

export function isSticker(arg: unknown): arg is Sticker {
    return (
        isNonNullObject(arg) && "name" in arg && typeof arg.name === "string"
    );
}
