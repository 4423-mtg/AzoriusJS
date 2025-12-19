/** ターン、フェイズ、ステップを表すオブジェクト */

import type { Player } from "./GameObject/Player.js";

export {
    Turn,
    Phase,
    Step,
    PhaseKind,
    StepKind,
    next_phase_and_step,
    first_step_of_phase,
};

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

const turn_definition: Array<{
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
    const index = turn_definition.findIndex(
        (e) => e.phase === phasekind && e.step === stepkind
    );
    return turn_definition[index + 1];
}

/** そのフェイズの最初のステップを返す。 */
function first_step_of_phase(phase_kind: PhaseKind): StepKind | undefined {
    return turn_definition.find((e) => e.phase === phase_kind)?.step;
}

/** ターン */
class Turn {
    id: number;
    active_player: Player;
    is_extra: boolean = false;

    constructor(id: number, active_player: Player, is_extra: boolean = false) {
        this.id = id;
        this.active_player = active_player;
        this.is_extra = is_extra;
    }
    equals(turn: Turn): boolean {
        return (
            this.id === turn.id &&
            this.active_player === turn.active_player &&
            this.is_extra === turn.is_extra
        );
    }
}

/** フェイズ */
class Phase {
    id: number;
    kind: PhaseKind;
    is_extra: boolean;

    constructor(id: number, kind: PhaseKind, is_extra: boolean = false) {
        this.id = id;
        this.kind = kind;
        this.is_extra = is_extra;
    }
}

/** ステップ */
class Step {
    id: number;
    kind: StepKind;
    is_extra: boolean;

    constructor(id: number, kind: StepKind, is_extra: boolean = false) {
        this.id = id;
        this.kind = kind;
        this.is_extra = is_extra;
    }
}

// TODO: ターン起因処理
