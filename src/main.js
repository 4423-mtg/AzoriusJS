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
    // 誘発してまだスタックに置かれていない能力
    triggered_abilities = []
    // 遅延誘発型能力
    delayed_triggered_abilities = []
    // 継続的効果
    continuous_effects = []
    // ゲームの履歴
    game_history = new InGameHistory()
    // 優先権を連続でパスしたプレイヤーの数
    pass_count

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
    }

    /** メインループ */
    run() {
        let flag_goto_next = true  // 次のターン・フェイズ・ステップに移行するかどうか
        let flag_cleanup_again = false  // もう一度クリンナップを行うかどうか
        let state_based_action_is_performed_or_ability_triggered_during_cleanup = false
        while (true) {
            if (flag_goto_next) {
                flag_goto_next = false

                /* 次のターン or フェイズ or ステップに移行する */
                this.goto_next()

                /* ターン起因処理 */
                this.turn_based_action()

                /* アクティブプレイヤーが優先権を得る */
                state_based_action_is_performed_or_ability_triggered_during_cleanup
                    = this.set_priority_to(this.active_player)
            }

            /* 優先権を持つプレイヤーの行動 */
            // アンタップ・ステップでは優先権は発生しない。
            // クリンナップ・ステップではターン起因処理のあと、
            // 状況起因処理か能力の誘発があった場合のみ優先権が発生する。
            switch (this.current_step) {
                case Step.untap_step:
                    break;
                case Step.cleanup_step:
                    if (state_based_action_is_performed_or_ability_triggered_during_cleanup) {
                        this.perform_priority_action()
                    }
                    break;
                default:
                    this.perform_priority_action()
                    break;
            }

            if (this.pass_count == this.players.length) {
                /* 全員が連続でパスした */
                this.pass_count = 0
                if (this.stack.length > 0) {
                    /* スタックに何かある場合 */
                    /* スタック上のものを1つ解決する */
                    resolve_stack()
                    /* アクティブプレイヤーが優先権を得る */
                    this.set_priority_to(this.active_player)
                    flag_goto_next = false
                } else {
                    /* スタックが空の場合 */
                    /* 次のフェイズ・ステップに移る */
                    flag_goto_next = true
                }
            } else {
                /* まだ全員が連続でパスしていない場合 */
                /* 次のプレイヤーが優先権を得る */
                this.set_priority_to(this.get_next_player_of(this.player_with_priority))
                flag_goto_next = false
            }
        }
    }

    /** 次のターン、フェイズ、ステップに移る。
     * 新しいターンが追加されるか、新しいフェイズが追加されるか、
     * 新しいステップが追加される */
    goto_next() {
        if (this.current_step.is_cleanup_step) {
            /* 現在クリンナップ・ステップの場合 */
            if (state_based_action_is_performed_or_ability_triggered_during_cleanup) {
                /* 状況起因処理か誘発があった場合はもう一度クリンナップ・ステップが発生する */
                this.add_turn(new CleanupStep())
                state_based_action_is_performed_or_ability_triggered_during_cleanup = false
            } else {
                /* 新しいターンを始める */
                let turn = this.get_next_turn()
                // TODO ターンを開始するに際して機能する効果
                //   - ターンを追加またスキップする効果
                this.add_turn(turn)
            }
        } else {
            /* クリンナップ・ステップでない場合は、次のフェイズまたはステップへ移行する */
            let phasestep = this.get_next_phase_or_step()
            // TODO フェイズ、ステップを追加またスキップする効果
            this.add_phase_or_step()
        }
    }

    /** 次のターンに移る */
    get_next_turn() {
    }

    /** 次のステップまたはフェイズに移る */
    get_next_phase_or_step() {
    }

    /** 優先権を持っているプレイヤーの行動ループ */  // TODO 行動後に優先権処理を行う必要あり
    perform_priority_action() {
        while (true) {
            let action = ask_action_to_player()
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
                this.pass_count++
            }
        }
    }

    /* プレイヤーが優先権を得る */
    set_priority_to(player) {
        /* 状況起因処理と誘発 */
        let flag_sba = true
        let flag_trigger = true
        while (flag_sba || flag_trigger) {  // 何もなくなるまで繰り返す
            flag_sba = flag_trigger = false
            /* 状況起因処理 */
            while (this.state_based_action()) {  // なにかあったらtrue
                flag_sba = true
            }
            /* 誘発していた能力をスタックに置く */
            flag_trigger = this.put_triggered_abilities_on_stack()
        }
        /* プレイヤーが優先権を得る */
        this.player_with_priority = player
    }

    /* 状況誘発のチェック */
    check_state_triggers() {
    }
    /* 誘発した能力をスタックに置く */
    put_triggered_abilities_on_stack() {
    }
    /* 状況起因処理 */
    state_based_action() {
    }
}

class InGameHistory {
    /** ゲーム内の履歴 */
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
    constructor(count, player, phases = []) {
        this.count = count
        this.player = player
        this.phases = phases  // フェイズ
    }

}

class Phase {
    /** フェイズ */
    constructor(player, phasetype, steps = []) {
        this.player = player
        this.phasetype = phasetype  // フェイズ種別
        this.steps = steps  // ステップ
    }

    static beginning_phase = {
        name: "Beginning Phase",
        steps: [
            Step.untap_step,
            Step.upkeep_step,
            Step.draw_step,
        ],
    }
    static precombat_main_phase = {
        name: "Precombat Main Phase",
        steps: [],
        /* 計略を実行中にする */
        set_scheme_in_motion() {},
        /* 英雄譚に伝承カウンターを置く */
        put_counter_on_saga() {},
        /* アトラクションを観覧するためのサイコロを振る */
        roll_to_visit_attractions() {},
    }
    static combat_phase = {
        name: "Combat Phase",
        steps: [
            Step.beginning_of_combat_step,
            Step.declare_attackers_step,
            Step.declare_blockers_step,
            Step.combat_damage_step,
            Step.end_of_combat_step,
        ]
    }
    static postcombat_main_phase = {
        name: "Postcombat Main Phase",
        steps: [],
    }
    static ending_phase = {
        name: "Ending Phase",
        steps: [
            Step.end_step,
            Step.cleanup_step,
        ]
    }
}
class BeginningPhase extends Phase {
    constructor() {
        super()
        this.name = "Beginning Phase"
    }
}
class PrecombatMainPhase extends Phase {
    constructor() {
        super()
        this.name = "Precombat Main Phase"
    }
}
class CombatPhase extends Phase {
    constructor() {
        super()
        this.name = "Combat Phase"
    }
}
class PostcombatMainPhase extends Phase {
    constructor() {
        super()
        this.name = "Postcombat Main Phase"
    }
}
class EndingPhase extends Phase {
    constructor() {
        super()
        this.name = "Ending Phase"
    }
}


class Step {
    /** ステップ */

    get is_untap_step() {}
    get is_upkeep_step() {}
    get is_draw_step() {}
    get is_beginning_of_combat_step() {}
    get is_declare_attackers_step() {}
    get is_declare_blockers_step() {}
    get is_combat_damage_step() {}
    get is_end_of_combat_step() {}
    get is_end_step() {}
    get is_cleanup_step() {}

    // アンタップ・ステップ
    static untap_step = {
        name: "Untap Step",
        /* フェイズイン、フェイズアウト */
        phasing(game_state) {},
        /* 昼夜が入れ替わる */
        switchDayNight(game_state) {},
        /* アンタップする */
        untap(game_state) {},
    }

    // アップキープ・ステップ
    static upkeep_step = {
        name: "Upkeep Step",
    }

    // ドロー・ステップ
    static draw_step = {
        name: "Draw Step",
        /* カードを引く */
        draw() {},
    }

    // 戦闘開始ステップ
    static beginning_of_combat_step = {
        name: "Beginning of Combat Step",
        /* 防御プレイヤーを1人選ぶ */
        select_defending_player() {},
    }

    // 攻撃クリーチャー指定ステップ
    static declare_attackers_step = {
        name: "Declare Attackers Step",
        /* 攻撃クリーチャーを指定する */
        declare_attackers() {},
    }

    // ブロック・クリーチャー指定ステップ
    static declare_blockers_step = {
        name: "Declare Blockers Step",
        // ブロッククリーチャーを指定する
        declare_blockers() {},
        // 攻撃側のダメージ割り振り順を指定する
        declare_attackers_dealing_damage_order() {},
        // ブロック側のダメージ割り振り順を指定する
        declare_blockers_dealing_damage_order() {},
    }

    // 戦闘ダメージ・ステップ
    static combat_damage_step = {
        name: "Combat Damage Step",
        /* 戦闘ダメージの割り振りを指定する */
        declare_damage() {},
        /* 戦闘ダメージを割り振る */
        deal_damage() {},
    }

    // 戦闘終了ステップ
    static end_of_combat_step = {
        name: "End of Combat Step",
    }

    // 終了ステップ
    static end_step = {
        name: "End Step",
    }

    // クリンナップ・ステップ
    static cleanup_step = {
        name: "Cleanup Step",
        /* 上限を超えた手札を捨てる */
        discard() {},
        /* パーマネントからダメージが取り除かれると同時に、
        ターン終了時までの効果が終了する */
        remove_damage_and_end_effects() {},
    }
}
