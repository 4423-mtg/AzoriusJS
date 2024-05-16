'use strict';

class Game {
    /** ゲームを表すオブジェクト */
    id = 0
    players = []
    decks = []
    game_state = new InGameState()

}

class InGameState {
    /** ゲームの状態 */
    game_meta
    turns = []
    objects = []
    players = []
    extra_turns = []
    extra_phasesteps = []
    skip_turns = []
    skip_phasesteps = []
    // 誘発してまだスタックに置かれていない能力
    triggered_abilities = []
    // 遅延誘発型能力
    delayed_triggered_abilities = []
    // 継続的効果
    continuous_effects = []
    // ゲームの履歴
    game_history = new InGameHistory()
    // 優先権を連続でパスしたプレイヤーの数
    pass_count;
    /** クリンナップをもう一度行うかどうか。
     * クリンナップの間に状況起因処理か能力の誘発があった場合、
     * そのクリンナップでは優先権が発生するとともに、追加のクリンナップが発生する。 */
    cleanup_again = false

    get current_turn() {
        return this.turns.length == 0 ? undefined : this.turns[this.turns.length - 1]
    }
    get current_phase() {
    }
    get current_step() {
    }
    get current_phasestep() {
    }
    get active_player() {
    }
    get player_with_priority() {
    }
    set player_with_priority(player) {
    }
    get players_from_active_player() {
    }
    get stack() {
    }

    get_next_player_of(player) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == player) {
                return (i == this.players.length - 1) ?
                    this.players[0] : this.players[i + 1]
            }
        }
        return undefined
    }

    /** メインループ */
    run() {
        let flag_goto_next = true  // 次のターン・フェイズ・ステップに移行するかどうか
        while (true) {
            /* ターン、フェイズ、ステップの移行処理 */
            if (flag_goto_next) {
                flag_goto_next = false

                /* 次のターン or フェイズ or ステップに移行する */
                this.goto_next()

                /* ターン起因処理 */
                this.turn_based_action()

                /* アクティブプレイヤーが優先権を得る */
                if (this.current_step.is_cleanup_step) {
                    this.cleanup_again = this.set_priority_to(this.active_player)
                } else {
                    this.set_priority_to(this.active_player)
                }
            } else {
                /* 行動後、優先権を得る */
                this.set_priority_to(this.player_with_priority)
            }

            /* 優先権を持つプレイヤーの行動 */
            switch (this.current_step) {
                case Step.untap_step:
                    // アンタップ・ステップでは優先権は発生しない。
                    break;
                case Step.cleanup_step:
                    // クリンナップ・ステップでは、
                    // 状況起因処理か能力の誘発があった場合のみ優先権が発生する。
                    if (this.cleanup_again) {
                        this.perform_priority_action()
                    }
                    break;
                default:
                    // 優先権により行動する
                    this.perform_priority_action()
                    break;
            }

            if (this.pass_count == this.players.length) {
                /* 全員が連続でパスした */
                this.pass_count = 0
                if (this.stack.length > 0) {
                    /* スタックに何かある場合、スタック上のものを1つ解決する */
                    this.resolve_stack()
                    /* アクティブプレイヤーが優先権を得る */
                    this.set_priority_to(this.active_player)
                } else {
                    /* スタックが空の場合、次のフェイズ・ステップに移る */
                    flag_goto_next = true
                }
            }
        }
    }

    /** 現在のステップを終了し、次のターンかフェイズかステップに移る。
     * メイン・フェイズである場合は、ステップがないのでフェイズを終了する。
     * 新しいターンが追加されるか、新しいフェイズが追加されるか、
     * 新しいステップが追加される */
    goto_next() {
        if (this.current_step.is_cleanup_step) {
            /* 現在クリンナップ・ステップの場合 */
            if (this.cleanup_again) {
                /* フラグが立っているなら再度クリンナップ・ステップを行う */
                this.goto_new_phase_or_step(new CleanupStep())
            } else {
                /* フラグが立っていないなら新しいターンを始める */
                let turn;
                /** --> ループ */
                /** 次に始まるターンを決定する。
                 * 追加ターンがあれば、最後に発生した追加ターンを取り出す。
                 * その追加ターン効果が消滅するなら消滅する。
                 * 追加ターンがなければ通常のターンとなる。
                */
                if (this.extra_turns.length > 0) {
                    turn =  // FIXME ?
                } else {
                    turn = new Turn(
                        this.current_turn.count++,
                        this.get_next_player_of(this.current_turn.player)
                    )
                }

                /** ターンスキップのチェック。複数ある場合はどれを適用するか選択。
                 * スキップ効果が消滅するなら消滅する */
                // Time Vault
                if (this.skip_turns.length > 0) {
                    // TODO 適用するスキップを選択
                } else {
                    // TODO
                }

                /** <-- ターンが消滅したならループの先頭に戻る */

                /** 決定したターンを開始する */
                this.goto_new_turn(turn)
            }
        } else {
            /* クリンナップ・ステップでない場合は、次のフェイズまたはステップへ移行する */
            let phase_or_step =   // TODO 移行先のフェイズやステップを確認する
            // TODO フェイズ、ステップを追加またスキップする効果
            this.goto_new_phase_or_step(phase_or_step)
        }
        this.cleanup_again = false
    }

    /** ターン起因処理 */
    turn_based_action() {
        this.turns.at(-1).turn_based_action()  // TODO Turn.turn_based_action()
    }

    /** 状況起因処理 */
    state_based_action() {
    }

    /** 誘発した能力をスタックに置く */
    put_triggered_abilities_on_stack() {
    }

    /** プレイヤーが優先権を得る */
    set_priority_to(player) {
        /* 状況起因処理と誘発 */
        let ret = false
        let flag_sba = true
        let flag_trigger = true
        while (flag_sba || flag_trigger) {  // 何もなくなるまで繰り返す
            flag_sba = flag_trigger = false
            /* 状況起因処理 */
            while (this.state_based_action()) {  // なにかあったらtrue
                flag_sba = true
                ret = true
            }
            /* 誘発していた能力をスタックに置く */
            flag_trigger = this.put_triggered_abilities_on_stack()
            if (flag_trigger) {
                ret = true
            }
        }
        /* プレイヤーが優先権を得る */
        this.player_with_priority = player

        return ret
    }

    /** 優先権による行動。呪文を唱える、能力を起動する、特別な処理を行う、優先権をパスする */
    perform_priority_action() {
        let action = ask_action_to_player()  // TODO ask_action_to_player()
        // 呪文を唱える
        if (action == cast_spell) {
            this.pass_count = 0
        }
        // 能力を起動する
        if (action == activate_ability) {
            this.pass_count = 0
        }
        // 特別な処理を行う
        if (action == do_special_action) {
            this.pass_count = 0
        }
        // 優先権をパスする
        if (action == pass_priority) {
            this.set_priority_to(this.get_next_player_of(this.player_with_priority)) // TODO
            this.pass_count++
        }
    }

    /** スタックを1つ解決する */
    resolve_stack() {}

    /** 状況誘発をチェックする */
    check_state_triggers() {
    }

    /** 新しいターンに入る */
    goto_new_turn(turn) {
        this.turns.push(turn)
    }
    /** 新しいフェイズまたはステップに入る */
    goto_new_phase_or_step(phase_or_step) {
        this.turns[-1].push_phase_or_step(phase_or_step)
    }
}

class InGameHistory {
    /** ゲーム内の履歴 */
    game_states = []
}

class InGameObject {
    /** ゲーム内のオブジェクト */
    id
    object_type = ["card"]
    // カード
    // トークン
    // カードやトークンのコピー

    // 呪文であるもの：
    //      カード、カードのコピー、
    // (card | token | copy), (spell | ability)
    zone
    owner
    controller
    name
    card_type
    text
    mana_cost
    power
    toughness
    loyalty
}

class ExtraOrSkip {
    static counter = 0
    constructor(condition) {
        this.id = ++ExtraTurn.counter  // InGameObjectとは別のIDを振る
        this.condition = condition  // 追加やスキップを行うかどうかの判定条件
    }
    // TODO
}


/** ターンやフェイズ・ステップの追加orスキップは継続的効果の一種でしかない？
 * - begin_turn()のような処理を作って置換処理を適用する？
*/
class ExtraSpec {
    static counter = 0
    id = 0
    spec
    constructor(spec) {
        this.id = ++ExtraSpec.counter
        this.spec = spec
    }
    // TODO
}

/** スキップは置換効果の一種である */
// class SkipSpec {
//     static counter = 0
//     id = 0
//     spec
//     constructor(spec) {
//         this.id = ++ExtraSpec.counter
//         this.spec = spec
//     }
//     // TODO
// }
class ReplacementEffect {
    // TODO
}
/** 置換効果を実装するならイベントの実装が必須・・・ */


class Player {
    /** プレイヤー */
    id;
    name;
}

class Turn {
    /** ターン
     * ターン > フェイズ > ステップ の木構造を持つ
     * ターン、フェイズ、ステップは実際に開始するときに初めて生成される
    */
    count;
    player;
    phases = [];
    is_extra = false;

    constructor(count, player, is_extra = false, phases = []) {
        this.count = count
        this.player = player
        this.phases = phases  // フェイズ
        this.is_extra = is_extra
    }

    /** フェイズオブジェクトを追加する */
    push_phase(phase) {
        this.phases.push(phase)
    }
    /** ステップオブジェクトを追加する */
    push_step(step) {
        this.phases[-1].push_step(step)
    }
    /** フェイズオブジェクト、またはステップオブジェクトを追加する */
    push_phase_or_step(phase_or_step) {
        if (Phase.is_phase(phase_or_step)) {
            this.push_phase(phase_or_step)
        }
        if (Step.is_step(phase_or_step)) {
            this.push_step(phase_or_step)
        }
    }

    static turn_def = new Turn(
        count = 0,
        player = undefined,
        phases = [
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
    name
    player
    steps = []
    turn_based_action
    constructor(name, player, steps = []) {
        this.name = name
        this.player = player
        this.steps = steps  // ステップ
    }

    static is_phase(obj) {
        return obj instanceof Phase
    }
    push_step(step) {
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

    static is_step(obj) {
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

class UntapStep {
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
class UpkeepStep {
    constructor(name) {
        this.name = "Upkeep Step"
    }
}
class DrawStep {
    constructor(name) {
        this.name = "Draw Step"
        this.turn_based_action = (game_state) => {
            this.draw(game_state)
        }
    }
    draw(game_state) {}
}
class BeginningOfCombatStep {
    constructor(name) {
        this.name = "Beginning of Combat Step"
        this.turn_based_action = (game_state) => {
            this.select_defending_player(game_state)
        }
    }
    select_defending_player(game_state) {}
}
class DeclareAttackersStep {
    constructor(name) {
        this.name = "Declare Attackers Step"
        this.turn_based_action = (game_state) => {
            this.declare_attackers(game_state)
        }
    }
    declare_attackers(game_state) {}
}
class DeclareBlockersStep {
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
class CombatDamageStep {
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
class EndOfCombatStep {
    constructor(name) {
        this.name = "End of Combat Step"
    }
}
class EndStep {
    constructor(name) {
        this.name = "End Step"
    }
}
class CleanupStep {
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
