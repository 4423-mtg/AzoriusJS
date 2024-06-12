"use strict";
import {
    ContinuousEffect,
    DelayedTriggeredAbility,
    GameObject,
    Player,
    StackedAbility,
    Zone,
    ZoneType,
} from "./GameObject";
import { Phase, Turn } from "./Turn";
export { Game, GameState, GameHistory };

class Game {
    /** ゲームを表すオブジェクト */
    id: number = 0;
    players: Player[] = [];
    decks = []; // FIXME サイドボード
    game_state: GameState = new GameState();

    initGame(): void {
        // プレイヤーの初期化
        this.game_state.players = this.players;
        // 領域の初期化
        this.game_state.zones.push(
            ...this.game_state.players.flatMap((pl) =>
                [
                    ZoneType.Library,
                    ZoneType.Hand,
                    ZoneType.Graveyard,
                    ZoneType.Command,
                ].map((zt) => new Zone(zt, pl))
            )
        );
        this.game_state.zones.push(new Zone(ZoneType.Battlefield));
        this.game_state.zones.push(new Zone(ZoneType.Exile));
        // TODO ライブラリーとサイドボード
    }
}

/** ゲームの状態 */
class GameState {
    /** ゲームのメタ情報 */
    game_meta; // TODO
    /** プレイヤー */
    players: Player[];
    /** 領域 */
    zones: Zone[];
    /** 生成済みのターン */
    turns: Turn[] = [];
    /** 生成されたオブジェクト */
    objects: GameObject[] = [];

    // FIXME
    extra_turns = [];
    extra_phasesteps = [];
    skip_turns = [];
    skip_phasesteps = [];

    /** 誘発してまだスタックに置かれていない能力 */
    unstacked_abilities: StackedAbility[] = [];
    /** 継続的効果 */
    continuous_effects: ContinuousEffect[] = [];
    /** 生成された遅延誘発型能力 */
    delayed_triggered_abilities: DelayedTriggeredAbility[] = [];

    /** ゲームの履歴 */
    game_history: GameHistory = new GameHistory();
    /** 優先権を連続でパスしたプレイヤーの数 */
    pass_count: number = 0;
    /** クリンナップをもう一度行うかどうか。
     * クリンナップの間に状況起因処理か能力の誘発があった場合、
     * そのクリンナップでは優先権が発生するとともに、追加のクリンナップが発生する。 */
    cleanup_again = false;

    get current_turn(): Turn | undefined {
        return this.turns.length == 0
            ? undefined
            : this.turns[this.turns.length - 1];
    }
    get current_phase(): Phase | undefined {}
    get current_step(): Step | undefined {}
    get current_phasestep(): Phase | Step | undefined {}
    get active_player(): Player | undefined {}
    get player_with_priority(): Player | undefined {}
    set player_with_priority(player: Player) {}
    get players_from_active_player() {}
    get stack(): GameObject[] {}
    getZone(zonetype: ZoneType, owner?: Player): Zone {
        return this.zones.filter(
            (z) => z.zonetype === zonetype && z.owner === owner
        )[0];
    }

    copy(): GameState {
        // FIXME
    }

    get_next_player_of(player: Player): Player | undefined {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == player) {
                return i == this.players.length - 1
                    ? this.players[0]
                    : this.players[i + 1];
            }
        }
        return undefined;
    }

    /** メインループ */
    run() {
        let flag_goto_next = true; // 次のターン・フェイズ・ステップに移行するかどうか
        while (true) {
            /* ターン、フェイズ、ステップの移行処理 */
            if (flag_goto_next) {
                flag_goto_next = false;

                /* 次のターン or フェイズ or ステップに移行する */
                this.goto_next();

                /* ターン起因処理 */
                this.turn_based_action();

                /* アクティブプレイヤーが優先権を得る */
                if (this.current_step.is_cleanup_step) {
                    this.cleanup_again = this.set_priority_to(
                        this.active_player
                    );
                } else {
                    this.set_priority_to(this.active_player);
                }
            } else {
                /* 行動後、優先権を得る */
                this.set_priority_to(this.player_with_priority);
            }

            /* 優先権を持つプレイヤーの行動 */
            switch (this.current_step) {
                case Turn.Step.untap_step:
                    // アンタップ・ステップでは優先権は発生しない。
                    break;
                case Turn.Step.cleanup_step:
                    // クリンナップ・ステップでは、
                    // 状況起因処理か能力の誘発があった場合のみ優先権が発生する。
                    if (this.cleanup_again) {
                        this.perform_priority_action();
                    }
                    break;
                default:
                    // 優先権により行動する
                    this.perform_priority_action();
                    break;
            }

            if (this.pass_count == this.players.length) {
                /* 全員が連続でパスした */
                this.pass_count = 0;
                if (this.stack.length > 0) {
                    /* スタックに何かある場合、スタック上のものを1つ解決する */
                    this.resolve_stack();
                    /* アクティブプレイヤーが優先権を得る */
                    this.set_priority_to(this.active_player);
                } else {
                    /* スタックが空の場合、次のフェイズ・ステップに移る */
                    flag_goto_next = true;
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
                this.goto_new_phase_or_step(new Turn.CleanupStep());
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
                    turn = undefined; // FIXME ?
                } else {
                    turn = new Turn.Turn(
                        this.current_turn.count++,
                        this.get_next_player_of(this.current_turn.player)
                    );
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
                this.goto_new_turn(turn);
            }
        } else {
            /* クリンナップ・ステップでない場合は、次のフェイズまたはステップへ移行する */
            let phase_or_step = // TODO 移行先のフェイズやステップを確認する
                // TODO フェイズ、ステップを追加またスキップする効果
                this.goto_new_phase_or_step(phase_or_step);
        }
        this.cleanup_again = false;
    }

    /** ターン起因処理 */
    turn_based_action() {
        this.turns.at(-1).turn_based_action(); // TODO Turn.turn_based_action()
    }

    /** 状況起因処理 */
    state_based_action() {}

    /** 誘発した能力をスタックに置く */
    put_triggered_abilities_on_stack(): boolean {}

    /** プレイヤーが優先権を得る */
    set_priority_to(player: Player) {
        /* 状況起因処理と誘発 */
        let ret = false;
        let flag_sba = true;
        let flag_trigger = true;
        while (flag_sba || flag_trigger) {
            // 何もなくなるまで繰り返す
            flag_sba = flag_trigger = false;
            /* 状況起因処理 */
            while (this.state_based_action()) {
                // なにかあったらtrue
                flag_sba = true;
                ret = true;
            }
            /* 誘発していた能力をスタックに置く */
            flag_trigger = this.put_triggered_abilities_on_stack();
            if (flag_trigger) {
                ret = true;
            }
        }
        /* プレイヤーが優先権を得る */
        this.player_with_priority = player;

        return ret;
    }

    /** 優先権による行動。呪文を唱える、能力を起動する、特別な処理を行う、優先権をパスする */
    perform_priority_action() {
        let action = ask_action_to_player(); // TODO ask_action_to_player()
        // 呪文を唱える
        if (action == cast_spell) {
            this.pass_count = 0;
        }
        // 能力を起動する
        if (action == activate_ability) {
            this.pass_count = 0;
        }
        // 特別な処理を行う
        if (action == do_special_action) {
            this.pass_count = 0;
        }
        // 優先権をパスする
        if (action == pass_priority) {
            this.set_priority_to(
                this.get_next_player_of(this.player_with_priority)
            ); // TODO
            this.pass_count++;
        }
    }

    /** スタックを1つ解決する */
    resolve_stack() {}

    /** 状況誘発をチェックする */
    check_state_triggers() {}

    /** 新しいターンに入る */
    goto_new_turn(turn) {
        this.turns.push(turn);
    }
    /** 新しいフェイズまたはステップに入る */
    goto_new_phase_or_step(phase_or_step) {
        this.turns[-1].push_phase_or_step(phase_or_step);
    }

    /** 条件を満たすオブジェクトを取得 */
    get_objects(query: any): GameObject[] {
        return [];
    }
}

/** ゲームの履歴。実装は隠蔽する */
class GameHistory {
    /** ゲーム内の履歴 */
    game_states = [];
}
