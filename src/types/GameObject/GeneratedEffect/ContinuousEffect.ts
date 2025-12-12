import { GameObject, type GameObjectOptions } from "../GameObject.js";
import type { Player } from "../Player.js";
import type { GameState, Timestamp } from "../../GameState/GameState.js";
import type { LayerInstance } from "../../Characteristics/Layer/LayerInstance.js";
import type { MultiSpec } from "../../Reference.js";
import type { Instruction } from "../../Instruction.js";

/** 継続的効果 */
export class ContinuousEffect extends GameObject {
    source: any | undefined;
    timestamp: Timestamp | undefined;

    constructor(options?: GameObjectOptions & ContinuousEffectOptions) {
        super(options);
        this.source = options?.source;
        this.timestamp = options?.timestamp;
    }
}
export type ContinuousEffectOptions = {
    source?: any;
    timestamp?: Timestamp;
};

/** 継続的効果
 * 1. 特性や値を変更する効果
 * 2. 手続きを修整する効果
 * 3. 手続きを禁止する効果
 */

// ↓ 何でもいいのでは...

/** 値や特性を変更する継続的効果 TODO: 2025-12-13 */
export class ModifyCharacteristics extends ContinuousEffect {
    /** 影響を及ぼすオブジェクト */
    affected_objects: MultiSpec<GameObject> = [];
    /** 特性変更 */
    layers: LayerInstance[] = [];
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
