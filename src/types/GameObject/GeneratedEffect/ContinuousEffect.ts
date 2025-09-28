import type { GameState } from "../../GameState/Game.js";
import type { Instruction } from "../../Turn/Instruction.js";
import type { MultiSpec } from "../../Turn/Reference.js";
import type { GameObject } from "../GameObject.js";
import type { LayerInstance } from "../../Characteristics/Layer/LayerInstance.js";
import type { Player } from "../Player.js";

/** 継続的効果 */
export class ContinuousEffect {
    source: any;
    effects: LayerInstance[] = [];
}

/** 継続的効果
 * 1. 特性や値を変更する効果
 * 2. 手続きを修整する効果
 * 3. 手続きを禁止する効果
 */

/** 値や特性を変更する継続的効果 */
export class ModifyCharacteristics extends ContinuousEffect {
    /** 影響を及ぼすオブジェクト */
    affected_objects: MultiSpec<GameObject> = [];
    /** 特性変更 */
    layer_instance: LayerInstance[] = [];
}

/** 手続きを変更する継続的効果 */
export class ModifyingProcedure extends ContinuousEffect {
    /** 変更対象の手続きに該当するかどうかをチェックする関数 */
    check: InstructionChecker;
    /** 変更後の処理 */
    replace: InstructionReplacer;

    constructor(
        /** 変更判定関数 */
        check: InstructionChecker,
        /** 変更後の処理 */
        replace: Instruction | Instruction[] | InstructionReplacer
    ) {
        super();
        this.check = check;
        if (typeof replace === "function") {
            this.replace = replace;
        } else if (Array.isArray(replace)) {
            this.replace = (instruction) => replace;
        } else {
            this.replace = (instruction) => [replace];
        }
    }
}

/** 処理を禁止する継続的効果 */
export class ForbiddingAction extends ContinuousEffect {
    /** 禁止対象の手続きに該当するかどうかをチェックする関数 */
    check: InstructionChecker;

    constructor(check: InstructionChecker) {
        super();
        this.check = check;
    }
}

// =================================================================

/** Instructionの実行が特定の条件を満たすかどうかを判定する関数を表す型 */
type InstructionChecker = (args: {
    instruction: Instruction;
    state: GameState;
    history: any; // FIXME:
    performer: GameObject | Player;
}) => boolean;

/** Instructionを別の1つ以上のInstructionに置き換える関数を表す型 */
type InstructionReplacer = (instruction: Instruction) => Instruction[];
