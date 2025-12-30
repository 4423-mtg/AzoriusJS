import type { GameObject } from "./GameObject.js";

export type CounterOnObject = GameObject & {
    name: string;
};

export function createCounter(name: string): CounterOnObject {
    //
}

export function isCounterOnObject(arg: unknown): arg is CounterOnObject {
    if (typeof arg === "object" && arg !== null) {
        return "name" in arg && typeof arg.name === "string";
    } else {
        return false;
    }
}
