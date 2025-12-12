import { GameObject, type GameObjectOptions } from "../GameObject.js";
import type { Player } from "../Player.js";

/** 置換効果 */
export class ReplacementEffect extends GameObject {
    // /** 置換対象の手続きに該当するかどうかをチェックする関数 */
    // check: InstructionChecker;
    // /** 置換後の処理 */
    // replace: InstructionReplacer;
    // constructor(
    //     check: InstructionChecker,
    //     replace: Instruction | Instruction[] | InstructionReplacer
    // ) {
    //     super();
    //     this.check = check;
    //     if (typeof replace === "function") {
    //         this.replace = replace;
    //     } else if (Array.isArray(replace)) {
    //         this.replace = (instruction) => replace;
    //     } else {
    //         this.replace = (instruction) => [replace];
    //     }
    // }

    constructor(options?: GameObjectOptions) {
        super(options);
    }
}
