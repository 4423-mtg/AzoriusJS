"use strict";

import { Player } from "./GameObject";

/** ターン、フェイズ、ステップを表すオブジェクト */

export { Turn, Phase, Step, PhaseKind, StepKind, next_phase_and_step };

/** フェイズの種別 */
type PhaseKind =
    | "Beginning"
    | "Precombat Main"
    | "Combat"
    | "Postcombat Main"
    | "Ending";

/** ステップの種別 */
type StepKind =
    | "Untap"
    | "Upkeep"
    | "Draw"
    | "Beginning of Combat"
    | "Declare Attackers"
    | "Declare Blockers"
    | "Combat Damage"
    | "End of Combat"
    | "End"
    | "Cleanup";

const phase_step_def: Array<{
    phase: PhaseKind | undefined;
    step: StepKind | undefined;
}> = [
    { phase: "Beginning", step: "Untap" },
    { phase: "Beginning", step: "Upkeep" },
    { phase: "Beginning", step: "Draw" },
    { phase: "Precombat Main", step: undefined },
    { phase: "Combat", step: "Beginning of Combat" },
    { phase: "Combat", step: "Declare Attackers" },
    { phase: "Combat", step: "Declare Blockers" },
    { phase: "Combat", step: "Combat Damage" },
    { phase: "Combat", step: "End of Combat" },
    { phase: "Postcombat Main", step: undefined },
    { phase: "Ending", step: "End" },
    { phase: "Ending", step: "Cleanup" },
    { phase: undefined, step: undefined },
];

/** フェイズとステップの組から、それの次に来るフェイズとステップを返す。 */
function next_phase_and_step(
    phasekind: PhaseKind,
    stepkind?: StepKind
): {
    phase: PhaseKind | undefined;
    step: StepKind | undefined;
} {
    const index = phase_step_def.indexOf({ phase: phasekind, step: stepkind });
    return phase_step_def[index + 1];
}

class Turn {
    /** ターン
     * ターン > フェイズ > ステップ の木構造を持つ
     * ターン、フェイズ、ステップは実際に開始するときに初めて生成される
     */
    static count: number;
    id: number;
    active_player: Player;
    is_extra: boolean = false;

    constructor(active_player: Player, is_extra: boolean = false) {
        this.id = Turn.count;
        Turn.count++;
        this.active_player = active_player;
        this.is_extra = is_extra;
    }
}

/** フェイズ */
class Phase {
    static count = 0;
    id: number;
    kind: PhaseKind;
    is_extra: boolean;

    constructor(kind: PhaseKind, is_extra: boolean = false) {
        this.id = Phase.count;
        Phase.count++;
        this.kind = kind;
        this.is_extra = is_extra;
    }
}

/** ステップ */
class Step {
    static count = 0;
    id: number;
    kind: StepKind;
    is_extra: boolean;

    constructor(kind: StepKind, is_extra: boolean = false) {
        this.id = Step.count;
        Step.count++;
        this.kind = kind;
        this.is_extra = is_extra;
    }
}
