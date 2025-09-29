import type { ReferenceParam, SingleSpec } from "../../Reference.js";
import type { Phase, Step, Turn } from "../../Turn/Turn.js";

/** ターンを追加する効果 */
export class AdditionalTurnEffect {
    /** ターンを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするターンを生成する */
    generate_turn: (params: ReferenceParam) => Turn;
}

/** フェイズを追加する効果 */
export class AdditionalPhaseEffect {
    /** フェイズを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするフェイズを生成する */
    generate_phase: (params: ReferenceParam) => Phase;
}

/** ステップを追加する効果 */
export class AdditionalStepEffect {
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
