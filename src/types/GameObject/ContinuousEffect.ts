import type { ReferenceParam, SingleSpec } from "../Turn/Reference.js";
import type { Phase, Step, Turn } from "../Turn/Turn.js";
import type { LayerInstance } from "./Layer/LayerInstance.js";

/** 継続的効果 */
export class ContinuousEffect {
    source: any;
    effects: LayerInstance[] = [];
}

/** 継続的効果
 * 1. 特性や値を変更する効果
 * 2. 手続きを修整する効果
 */

// MARK: ReplacementEffect
/** 置換効果 */
class ReplacementEffect {
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
}

// =================================================================
// MARK: AdditionalTurnEffect
/** ターンを追加する効果 */
class AdditionalTurnEffect {
    /** ターンを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするターンを生成する */
    generate_turn: (params: ReferenceParam) => Turn;
}

/** フェイズを追加する効果 */
class AdditionalPhaseEffect {
    /** フェイズを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするフェイズを生成する */
    generate_phase: (params: ReferenceParam) => Phase;
}

/** ステップを追加する効果 */
class AdditionalStepEffect {
    /** ステップを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするステップを生成する */
    generate_step: (params: ReferenceParam) => Step;

    constructor(generate_step: (params: ReferenceParam) => Step) {
        super();
        this.generate_step = generate_step;
    }
}
// ターンを追加する
// フェイズ、ステップを追加する
// ターンを追加するが、その追加ターンのステップを飛ばす（瞬間の味わい）
// 次のターンをコントロールし、そのターンの後にターンを追加する（終末エムラ）
// 現在がメインフェイズならこの後にフェイズを追加する（連続突撃）
// ターンを追加するが、そのターンの終了ステップに敗北
// 開始フェイズと、N個のアップキープを追加する（オベカ）

// /** Instructionの実行が特定の条件を満たすかどうかを判定する関数を表す型 */
// type InstructionChecker = (args: {
//     instruction: Instruction;
//     state: GameState;
//     history: GameHistory;
//     performer: GameObject | Player;
// }) => boolean;

// /** Instructionを別の1つ以上のInstructionに置き換える関数を表す型 */
// type InstructionReplacer = (instruction: Instruction) => Instruction[];

// /** 値や特性を変更する継続的効果 */
// class ValueAlteringContinousEffect extends ContinuousEffect {
//     /** 影響を及ぼすオブジェクト */
//     affected_objects: GameObject[] | MultiRef[];
// }

// /** 手続きを変更する継続的効果 */
// class ProcessAlteringContinousEffect extends ContinuousEffect {
//     /** 変更対象の手続きに該当するかどうかをチェックする関数 */
//     check: InstructionChecker;
//     /** 変更後の処理 */
//     replace: InstructionReplacer;

//     constructor(
//         /** 変更判定関数 */
//         check: InstructionChecker,
//         /** 変更後の処理 */
//         replace: Instruction | Instruction[] | InstructionReplacer
//     ) {
//         super();
//         this.check = check;
//         if (typeof replace === "function") {
//             this.replace = replace;
//         } else if (Array.isArray(replace)) {
//             this.replace = (instruction) => replace;
//         } else {
//             this.replace = (instruction) => [replace];
//         }
//     }
// }

// /** 処理を禁止する継続的効果 */
// class ProcessForbiddingContinousEffect extends ContinuousEffect {
//     /** 禁止対象の手続きに該当するかどうかをチェックする関数 */
//     check: InstructionChecker;

//     constructor(check: InstructionChecker) {
//         super();
//         this.check = check;
//     }
// }
