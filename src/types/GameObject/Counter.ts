import type { GameObject } from "./GameObject.js";

export type Counter = GameObject & {
    name: string;
};

export function createCounter(name: string) {
    //
}
