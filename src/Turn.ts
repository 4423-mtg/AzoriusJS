"use strict";

import { Player } from "./GameObject";

/** ターン、フェイズ、ステップを表すオブジェクト */

export { Turn, Phase, Step, PhaseKind, StepKind };

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

    // TODO 次のフェイズ・ステップを返す　ジェネレータ？
}

type PhaseKind =
    | "Beginning"
    | "Precombat Main"
    | "Combat"
    | "Postcombat Main"
    | "Ending";
class Phase {
    /** フェイズ */
    static count = 0;
    id: number;
    kind: PhaseKind;
    active_player?: Player;
    is_extra: boolean;

    constructor(
        kind: PhaseKind,
        active_player?: Player,
        is_extra: boolean = false
    ) {
        this.id = Phase.count;
        Phase.count++;
        this.kind = kind;
        this.active_player = active_player;
        this.is_extra = is_extra;
    }

    get child_step_kinds(): StepKind[] {
        switch (this.kind) {
            case "Beginning":
                return ["Untap", "Upkeep", "Draw"];
            case "Precombat Main":
                return [];
            case "Combat":
                return [
                    "Beginning of Combat",
                    "Declare Attackers",
                    "Declare Blockers",
                    "Combat Damage",
                    "End of Combat",
                ];
            case "Postcombat Main":
                return [];
            case "Ending":
                return ["End", "Cleanup"];
        }
    }
    get has_step(): boolean {
        return this.child_step_kinds.length > 0;
    }
    get next_kind(): PhaseKind | undefined {
        switch (this.kind) {
            case "Beginning":
                return "Precombat Main";
            case "Precombat Main":
                return "Combat";
            case "Combat":
                return "Postcombat Main";
            case "Postcombat Main":
                return "Ending";
            case "Ending":
                return undefined;
        }
    }
}

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
class Step {
    /** ステップ */
    static count = 0;
    id: number;
    kind: StepKind;
    active_player?: Player;
    is_extra: boolean;

    constructor(
        kind: StepKind,
        active_player?: Player,
        is_extra: boolean = false
    ) {
        this.id = Step.count;
        Step.count++;
        this.kind = kind;
        this.active_player = active_player;
        this.is_extra = is_extra;
    }

    get parent_phase_kind(): PhaseKind {
        switch (this.kind) {
            case "Untap":
            case "Upkeep":
            case "Draw":
                return "Beginning";
            case "Beginning of Combat":
            case "Declare Attackers":
            case "Declare Blockers":
            case "Combat Damage":
            case "End of Combat":
                return "Combat";
            case "End":
            case "Cleanup":
                return "Ending";
        }
    }
    get next_kind(): StepKind | undefined {
        const order: (StepKind | undefined)[] = [
            "Untap",
            "Upkeep",
            "Draw",
            undefined,
            "Beginning of Combat",
            "Declare Attackers",
            "Declare Blockers",
            "Combat Damage",
            "End of Combat",
            undefined,
            "End",
            "Cleanup",
            undefined,
        ];
        return order[order.indexOf(this.kind) + 1];
    }
}
