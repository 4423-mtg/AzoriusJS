import type { Instruction } from "../Turn/Instruction.js";

export class Counter {
    name: string;
    instructions?: Instruction[];

    constructor(name: string, instructions?: Instruction[]) {
        this.name = name;
        this.instructions = instructions;
    }

    static "+1/+1" = new Counter("+1/+1"); // FIXME
    static "-1/-1" = new Counter("-1/-1"); // FIXME
}
