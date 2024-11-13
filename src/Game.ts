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
import { Phase, Step, Turn } from "./Turn";
export { Game, GameState };

class Game {
    /** ゲームを表すオブジェクト */
    id: number = 0;
    players: Set<Player>;
    decks = []; // FIXME: サイドボード
    game_state: GameState = new GameState();

    initGame(): void {
        // プレイヤーの初期化
        state.game_state.players = state.players;
        // 領域の初期化
        state.game_state.zones.push(
            ...state.game_state.players.flatMap((pl) =>
                [
                    ZoneType.Library,
                    ZoneType.Hand,
                    ZoneType.Graveyard,
                    ZoneType.Command,
                ].map((zt) => new Zone(zt, pl))
            )
        );
        state.game_state.zones.push(new Zone(ZoneType.Battlefield));
        state.game_state.zones.push(new Zone(ZoneType.Exile));
        // TODO ライブラリーとサイドボード
    }
    constructor() {}
}

/** ゲームの状態 */
// NOTE: GameState は immutable であってほしい
class GameState {
    /** ゲームのメタ情報 */
    game_meta: Game;

    /** プレイヤー */
    players: Set<Player>;
    /** プレイヤーのターン進行順 */
    turn_order: Player[];
    #active_player_index?: number;
    #priority_player_index?: number;

    /** 領域 */
    zones: Set<Zone>;
    /** すべてのオブジェクト */
    game_objects: GameObject[] = []; // Mapに変えるかも

    /** 現在のターン */
    turn: Turn;
    /** 現在のフェイズ */
    phase: Phase;
    /** 現在のステップ */
    step?: Step;

    /** 優先権を連続でパスしたプレイヤーの数 */
    pass_count: number = 0;
    /** クリンナップをもう一度行うかどうか。
     * クリンナップの間に状況起因処理か能力の誘発があった場合、
     * そのクリンナップでは優先権が発生するとともに、追加のクリンナップが発生する。 */
    cleanup_again = false;

    // ========================================================================
    /** アクティブプレイヤー */
    get active_player(): Player | undefined {
        return this.#active_player_index === undefined
            ? undefined
            : this.turn_order[this.#active_player_index];
    }
    /** 優先権を持つプレイヤー */
    get player_with_priority(): Player | undefined {
        return this.#priority_player_index === undefined
            ? undefined
            : this.turn_order[this.#priority_player_index];
    }

    /** アクティブプレイヤーから始めて各プレイヤーをターン進行順に並べた配列 */
    from_active_player(): Player[] | undefined {
        if (this.#active_player_index === undefined) {
            return undefined;
        } else {
            return new Array<Player>().concat(
                this.turn_order.slice(this.#active_player_index),
                this.turn_order.slice(0, this.#active_player_index - 1)
            );
        }
    }
    /** 指定したプレイヤーからターン進行順で次のプレイヤー */
    get_next_player_of(player: Player): Player | undefined {
        const idx = this.turn_order.findIndex((value) => value === player);
        return idx < this.turn_order.length - 1
            ? this.turn_order[idx + 1]
            : this.turn_order[0];
    }
    // get stack(): GameObject[] {}

    // ========================================================================
    /** 条件を満たすオブジェクトを取得 */
    get_game_objects(query: (obj: GameObject) => boolean): GameObject[] {
        return this.game_objects.filter(query);
    }

    /** 指定したプレイヤーの指定した種類の領域を取得 */
    get_zone(zonetype: ZoneType, owner?: Player): Zone {
        for (const z of this.zones.values()) {
            if (
                z.zonetype === zonetype &&
                (owner === undefined || z.owner === owner)
            ) {
                return z;
            }
        }
        throw new Error("");
    }
    ///** 指定した領域にあるオブジェクトを取得 */

    /** ディープコピー */
    deepcopy(): GameState {
        // TODO:
    }
}

// MARK: GameHistory
/** ゲームの履歴。実装は隠蔽する */
class GameHistory {
    #history: GameState[] = [];

    constructor(...state: GameState[]) {
        this.#history = state;
    }

    get current(): GameState {
        return this.#history[-1];
    }

    /** メインループ */
    run(initial_state: GameState): void {
        const history = new Array<GameState>(initial_state);
        const current_state = () => history[-1];

        let flag_goto_next = true; // 次のターン・フェイズ・ステップに移行するかどうか
        while (true) {
            /* ターン、フェイズ、ステップの移行処理 */
            if (flag_goto_next) {
                flag_goto_next = false;

                /* 次のターン or フェイズ or ステップに移行する */
                history.push();
                goto_next(state);

                /* ターン起因処理 */
                state.turn_based_action();

                /* アクティブプレイヤーが優先権を得る */
                /* クリンナップの場合、もう一度クリンナップを行う */
                if (state.step?.is_cleanup_step()) {
                    state.cleanup_again = state.set_priority_to(
                        state.active_player
                    );
                } else {
                    state.set_priority_to(state.active_player);
                }
            } else {
                /* 行動後、優先権を得る */
                state.set_priority_to(state.player_with_priority);
            }

            /* 優先権を持つプレイヤーの行動 */
            switch (state.current_step) {
                case Turn.Step.untap_step:
                    // アンタップ・ステップでは優先権は発生しない。
                    break;
                case Turn.Step.cleanup_step:
                    // クリンナップ・ステップでは、
                    // 状況起因処理か能力の誘発があった場合のみ優先権が発生する。
                    if (state.cleanup_again) {
                        state.perform_priority_action();
                    }
                    break;
                default:
                    // 優先権により行動する
                    state.perform_priority_action();
                    break;
            }

            if (state.pass_count == state.players.length) {
                /* 全員が連続でパスした */
                state.pass_count = 0;
                if (state.stack.length > 0) {
                    /* スタックに何かある場合、スタック上のものを1つ解決する */
                    state.resolve_stack();
                    /* アクティブプレイヤーが優先権を得る */
                    state.set_priority_to(state.active_player);
                } else {
                    /* スタックが空の場合、次のフェイズ・ステップに移る */
                    flag_goto_next = true;
                }
            }
        }
    }

    run2(): void {
        while (true) {
            if (
                // クリンナップ・ステップ
                (this.current.step?.is_cleanup_step() &&
                    this.current.cleanup_again &&
                    this.current.pass_count === this.current.players.size) ||
                // 通常のフェイズやステップ
                this.current.pass_count === this.current.players.size
            ) {
                // 全員が連続で優先権をパスしている
                // FIXME: アンタップ・ステップでは優先権は発生しない
                // FIXME: クリンナップ・ステップは誘発があった場合のみ発生する？
                // スタックが空
                if (
                    this.current.get_game_objects(
                        (obj) =>
                            obj.zone === this.current.get_zone(ZoneType.Stack)
                    ).length === 0
                    // FIXME: 条件判定をもっと簡潔に書けるようにする
                ) {
                    // 次のフェイズやステップに移る。ターン起因処理も行う
                    this.goto_next();
                    continue;
                }
                // スタックが空でない
                else {
                    // スタックを１つ解決する
                    this.resolve_stack();
                    continue;
                }
            }
            // 全員がパスしていない
            else {
                // 優先権に基づく行動
                this.priority_action();
            }
        }
    }

    /** 現在のステップを終了し、次のターンかフェイズかステップに移る。
     * メイン・フェイズである場合は、ステップがないので次のフェイズに移る。
     * 終了ステップである場合は、クリンナップを行った後次のターンに移る。
     */
    goto_next(state?: GameState): GameState {
        if (state.current_step.is_cleanup_step) {
            /* 現在クリンナップ・ステップの場合 */
            if (state.cleanup_again) {
                /* フラグが立っているなら再度クリンナップ・ステップを行う */
                state.goto_new_phase_or_step(new Turn.CleanupStep());
            } else {
                /* フラグが立っていないなら新しいターンを始める */
                let turn;
                /** --> ループ */
                /** 次に始まるターンを決定する。
                 * 追加ターンがあれば、最後に発生した追加ターンを取り出す。
                 * その追加ターン効果が消滅するなら消滅する。
                 * 追加ターンがなければ通常のターンとなる。
                 */
                if (state.extra_turns.length > 0) {
                    turn = undefined; // FIXME ?
                } else {
                    turn = new Turn.Turn(
                        state.current_turn.count++,
                        state.get_next_player_of(state.current_turn.player)
                    );
                }

                /** ターンスキップのチェック。複数ある場合はどれを適用するか選択。
                 * スキップ効果が消滅するなら消滅する */
                // Time Vault
                if (state.skip_turns.length > 0) {
                    // TODO 適用するスキップを選択
                } else {
                    // TODO
                }

                /** <-- ターンが消滅したならループの先頭に戻る */

                /** 決定したターンを開始する */
                state.goto_new_turn(turn);
            }
        } else {
            /* クリンナップ・ステップでない場合は、次のフェイズまたはステップへ移行する */
            let phase_or_step = // TODO 移行先のフェイズやステップを確認する
                // TODO フェイズ、ステップを追加またスキップする効果
                state.goto_new_phase_or_step(phase_or_step);
        }
        state.cleanup_again = false;
    }

    /** ターン起因処理 */
    turn_based_action(state: GameState, proc): GameState {}

    /** 状況起因処理 (1回) */
    state_based_action(state: GameState): GameState {}

    /** 誘発した能力をスタックに置く */
    put_triggered_abilities_on_stack(state: GameState): GameState {}

    /** プレイヤーが優先権を得る */
    set_priority_to(state: GameState) {
        /* 状況起因処理と誘発 */
        let ret = false;
        let flag = true;
        while (flag) {
            // 何もなくなるまで繰り返す
            flag = false;
            /* 発生しなくなるまで状況起因処理を繰り返す */
            while (state.state_based_action()) {
                // なにかあったらtrue
                flag = true;
                ret = true;
            }
            /* 誘発していた能力をスタックに置く */
            if (state.put_triggered_abilities_on_stack()) {
                flag = true;
                ret = true;
            }
        }
        /* プレイヤーが優先権を得る */
        state.player_with_priority = player;

        return ret;
    }

    /** 優先権による行動。呪文を唱える、能力を起動する、特別な処理を行う、優先権をパスする */
    priority_action(state?: GameState): GameState {
        let action = ask_action_to_player(); // TODO ask_action_to_player()
        // 呪文を唱える
        if (action == cast_spell) {
            state.pass_count = 0;
        }
        // 能力を起動する
        if (action == activate_ability) {
            state.pass_count = 0;
        }
        // 特別な処理を行う
        if (action == do_special_action) {
            state.pass_count = 0;
        }
        // 優先権をパスする
        if (action == pass_priority) {
            state.set_priority_to(
                state.get_next_player_of(state.player_with_priority)
            ); // TODO
            state.pass_count++;
        }
    }

    resolve_stack(state?: GameState): GameState {}

    check_state_triggers(state: GameState): GameState {}

    goto_new_turn(state: GameState): GameState {}

    goto_new_phase_or_step(state: GameState): GameState {}
}
