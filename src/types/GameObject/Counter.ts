import type { GameObject } from "./GameObject.js";

export type CounterOnObject = GameObject & {
    name: string;
};

export function createCounter(name: string) {
    //
}
