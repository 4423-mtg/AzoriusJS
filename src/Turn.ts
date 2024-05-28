'use strict';

import { Player } from "./GameObject";

/** ターン、フェイズ、ステップを表すオブジェクト
 *
 */

export {
    Turn,
    Phase,
    BeginningPhase,
    PrecombatMainPhase,
    CombatPhase,
    PostcombatMainPhase,
    EndingPhase,
    Step,
    UntapStep,
    UpkeepStep,
    DrawStep,
    BeginningOfCombatStep,
    DeclareAttackersStep,
    DeclareBlockersStep,
    CombatDamageStep,
    EndOfCombatStep,
    EndStep,
    CleanupStep,
}

class Turn {
    /** ターン
     * ターン > フェイズ > ステップ の木構造を持つ
     * ターン、フェイズ、ステップは実際に開始するときに初めて生成される
    */
    count: number
    player: Player
    phases: Phase[]
    is_extra: boolean = false

    constructor(count, player, phases = [], is_extra = false) {
        this.count = count
        this.player = player
        this.phases = phases  // フェイズ
        this.is_extra = is_extra
    }

    /** フェイズオブジェクトを追加する */
    push_phase(phase: Phase) {
        this.phases.push(phase)
    }
    /** ステップオブジェクトを追加する */
    push_step(step: Step) {
        this.phases[-1].push_step(step)
    }
    /** フェイズオブジェクト、またはステップオブジェクトを追加する */
    push_phase_or_step(phase_or_step: Phase | Step) {
        // if (Phase.is_phase(phase_or_step)) {
        //     this.push_phase(phase_or_step)
        // }
        // if (Step.is_step(phase_or_step)) {
        //     this.push_step(phase_or_step)
        // }
    }

    static turn_def = new Turn(
        0,
        undefined,
        [
            new BeginningPhase(steps = [
                new UntapStep(),
                new UpkeepStep(),
                new DrawStep(),
            ]),
            new PrecombatMainPhase(),
            new CombatPhase(steps = [
                new BeginningOfCombatStep(),
                new DeclareAttackersStep(),
                new DeclareBlockersStep(),
                new CombatDamageStep(),
                new EndOfCombatStep(),
            ]),
            new PostcombatMainPhase(),
            new EndingPhase(steps = [
                new EndStep(),
                new CleanupStep(),
            ])
        ]
    )

    // TODO 次のフェイズ・ステップを返す　ジェネレータ？

    // /** ターン起因処理 */
    // turn_based_action() {
    // }
}

class Phase {
    /** フェイズ */
    name: string
    player: Player
    steps: Step[] = []
    turn_based_action
    constructor(name: string, player: Player, steps = []) {
        this.name = name
        this.player = player
        this.steps = steps  // ステップ
    }

    static is_phase(obj: any) {
        return obj instanceof Phase
    }
    push_step(step: Step) {
        this.steps.push(step)
    }

    get is_beginning_phase() {
        return this instanceof BeginningPhase
    }
    get is_precombat_main_phase() {
        return this instanceof PrecombatMainPhase
    }
    get is_combat_phase() {
        return this instanceof CombatPhase
    }
    get is_postcombat_main_phase() {
        return this instanceof PostcombatMainPhase
    }
    get is_ending_phase() {
        return this instanceof EndingPhase
    }
}
class BeginningPhase extends Phase {
    constructor(name, player, steps) {
        super()
        this.name = "Beginning Phase"
    }
}
class PrecombatMainPhase extends Phase {
    constructor(name, player, steps) {
        super()
        this.name = "Precombat Main Phase"
        this.turn_based_action = (game_state) => {
            this.set_scheme_in_motion()
            this.put_counter_on_saga()
            this.roll_to_visit_attractions()
        }
    }
    /* 計略を実行中にする */
    set_scheme_in_motion() {}
    /* 英雄譚に伝承カウンターを置く */
    put_counter_on_saga() {}
    /* アトラクションを観覧するためのサイコロを振る */
    roll_to_visit_attractions() {}
}
class CombatPhase extends Phase {
    constructor(name, player, steps) {
        super()
        this.name = "Combat Phase"
    }
}
class PostcombatMainPhase extends Phase {
    constructor(name, player, steps) {
        super()
        this.name = "Postcombat Main Phase"
    }
}
class EndingPhase extends Phase {
    constructor(name, player, steps) {
        super()
        this.name = "Ending Phase"
    }
}


class Step {
    /** ステップ */
    name
    player
    turn_based_action
    constructor(name, player) {
        this.name = name
        this.player = player
    }

    static is_step(obj: any) {
        return obj instanceof Step
    }

    get is_untap_step() {
        return this instanceof UntapStep
    }
    get is_upkeep_step() {
        return this instanceof UpkeepStep
    }
    get is_draw_step() {
        return this instanceof DrawStep
    }
    get is_beginning_of_combat_step() {
        return this instanceof BeginningOfCombatStep
    }
    get is_declare_attackers_step() {
        return this instanceof DeclareAttackersStep
    }
    get is_declare_blockers_step() {
        return this instanceof DeclareBlockersStep
    }
    get is_combat_damage_step() {
        return this instanceof CombatDamageStep
    }
    get is_end_of_combat_step() {
        return this instanceof EndOfCombatStep
    }
    get is_end_step() {
        return this instanceof EndStep
    }
    get is_cleanup_step() {
        return this instanceof CleanupStep
    }
}

class UntapStep extends Step {
    constructor(name) {
        this.name = " Step"
        this.turn_based_action = (game_state) => {
            this.phasing(game_state)
            this.switchDayNight(game_state)
            this.untap(game_state)
        }
    }
    phasing(game_state) {}
    switchDayNight(game_state) {}
    untap(game_state) {}
}
class UpkeepStep extends Step {
    constructor(name) {
        this.name = "Upkeep Step"
    }
}
class DrawStep extends Step {
    constructor(name) {
        this.name = "Draw Step"
        this.turn_based_action = (game_state) => {
            this.draw(game_state)
        }
    }
    draw(game_state) {}
}
class BeginningOfCombatStep extends Step {
    constructor(name) {
        this.name = "Beginning of Combat Step"
        this.turn_based_action = (game_state) => {
            this.select_defending_player(game_state)
        }
    }
    select_defending_player(game_state) {}
}
class DeclareAttackersStep extends Step {
    constructor(name) {
        this.name = "Declare Attackers Step"
        this.turn_based_action = (game_state) => {
            this.declare_attackers(game_state)
        }
    }
    declare_attackers(game_state) {}
}
class DeclareBlockersStep extends Step {
    constructor(name) {
        this.name = "Declare Blockers Step"
        this.turn_based_action = (game_state) => {
            this.declare_blockers(game_state)
            this.declare_order_attackers_dealing_damage(game_state)
            this.declare_order_blockers_dealing_damage(game_state)
        }
    }
    declare_blockers(game_state) {}
    declare_order_attackers_dealing_damage(game_state) {}
    declare_order_blockers_dealing_damage(game_state) {}
}
class CombatDamageStep extends Step {
    constructor(name) {
        this.name = "Combat Damage Step"
        this.turn_based_action = (game_state) => {
            this.declare_damage(game_state)
            this.deal_damage(game_state)
        }
    }
    declare_damage(game_state) {}
    deal_damage(game_state) {}
}
class EndOfCombatStep extends Step {
    constructor(name) {
        this.name = "End of Combat Step"
    }
}
class EndStep extends Step {
    constructor(name) {
        this.name = "End Step"
    }
}
class CleanupStep extends Step {
    constructor(name) {
        this.name = "Cleanup Step"
        this.turn_based_action = (game_state) => {
            this.discard(game_state)
            this.remove_damage_and_end_effects(game_state)
        }
    }
    discard(game_state) {}
    remove_damage_and_end_effects(game_state) {}
}
