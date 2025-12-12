import type { QueryParam, SingleSpec } from "../../Reference.js";
import type { Phase, Step, Turn } from "../../Turn/Turn.js";
import { GameObject, type GameObjectOptions } from "../GameObject.js";

/** ターンを追加する効果 */
export class AdditionalTurnEffect extends GameObject {
    /** ターンを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするターンを生成する */
    generateTurn: (params: QueryParam) => Turn;

    constructor(
        condition: SingleSpec<boolean>,
        generateTurn: (params: QueryParam) => Turn,
        options: GameObjectOptions
    ) {
        super(options);
        this.condition = condition;
        this.generateTurn = generateTurn;
    }
}

/** フェイズを追加する効果 */
export class AdditionalPhaseEffect extends GameObject {
    /** フェイズを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするフェイズを生成する */
    generatePhase: (params: QueryParam) => Phase;

    constructor(
        condition: SingleSpec<boolean>,
        generatePhase: (params: QueryParam) => Phase,
        options: GameObjectOptions
    ) {
        super(options);
        this.condition = condition;
        this.generatePhase = generatePhase;
    }
}

/** ステップを追加する効果 */
export class AdditionalStepEffect extends GameObject {
    /** ステップを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするステップを生成する */
    generateStep: (params: QueryParam) => Step;

    constructor(
        condition: SingleSpec<boolean>,
        generateStep: (params: QueryParam) => Step,
        options: GameObjectOptions
    ) {
        super(options);
        this.condition = condition;
        this.generateStep = generateStep;
    }
}
// ターンを追加する
// フェイズ、ステップを追加する
// ターンを追加するが、その追加ターンのステップを飛ばす（瞬間の味わい）
// 次のターンをコントロールし、そのターンの後にターンを追加する（終末エムラ）
// 現在がメインフェイズならこの後にフェイズを追加する（連続突撃）
// ターンを追加するが、そのターンの終了ステップに敗北
// 開始フェイズと、N個のアップキープを追加する（オベカ）
