"use strict";
import {
    GameObject,
    Player,
    Card,
    StackedAbility,
    ContinuousEffect,
    ReplacementEffect,
    AdditionalTurnEffect,
    AdditionalPhaseEffect,
    AdditionalStepEffect,
    GeneratedEffect,
} from "./GameObject";
import { DelayedTriggeredAbility } from "./Ability";
import { Turn, Phase, Step, next_phase_and_step } from "./Turn";

export { Game, GameState, GameHistory, Zone, ZoneType };

// MARK: Game
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

// MARK: GameState
/** ゲームの状態 */
// NOTE: GameState は immutable であってほしい
class GameState {
    /** ゲームのメタ情報 */
    #game_meta: Game;

    /** プレイヤー */
    #players: Set<Player>;
    /** プレイヤーのターン進行順 */
    #turn_order: Player[];
    #active_player_index?: number;
    #priority_player_index?: number;

    /** 領域 */
    #zones: Set<Zone> = new Set<Zone>();
    /** すべてのオブジェクト */
    #game_objects: GameObject[] = []; // Mapに変えるかも

    /** 現在のターン */
    #turn: Turn;
    /** 現在のフェイズ */
    #phase: Phase;
    /** 現在のステップ */
    #step?: Step;

    /** 優先権を連続でパスしたプレイヤーの数 */
    #pass_count: number = 0;
    /** クリンナップをもう一度行うかどうか。
     * クリンナップの間に状況起因処理か能力の誘発があった場合、
     * そのクリンナップでは優先権が発生するとともに、追加のクリンナップが発生する。 */
    #cleanup_again = false;

    // ==================================================================
    // MARK: GameState/object
    /** すべての領域にあるすべてのカード（トークンやコピーを含む） */
    allCard(): Card[] {
        return this.#game_objects.filter((go) => go instanceof Card);
    }
    /** 指定した領域にあるすべてのカード（トークンやコピーを含む） */
    card_in_zone(zonetype: ZoneType[], player?: Player[]) {
        return this.allCard().filter((card) =>
            this.zones(zonetype, player).includes(card.zone)
        );
    }

    /** パーマネント */
    permanents(): Card[] {
        return this.card_in_zone([ZoneType.Battlefield]);
    }
    /** スタックのオブジェクト */
    objects_on_stack(): (Card | StackedAbility)[] {
        return this.#game_objects
            .filter((go) => go instanceof Card || go instanceof StackedAbility)
            .filter(
                (go) =>
                    (go instanceof Card &&
                        go.zone.zonetype === ZoneType.Stack) ||
                    !(go instanceof Card)
            );
    }
    /** 追放領域のカード（トークンやコピーを含む） */
    cards_in_exile(): Card[] {
        return this.card_in_zone([ZoneType.Exile]);
    }
    /** 手札のカード（トークンやコピーを含む） */
    cards_in_hand(player?: Player[]): Card[] {
        return this.card_in_zone([ZoneType.Hand], player);
    }
    /** ライブラリーのカード（トークンを含む） */
    cards_in_library(player?: Player[]): Card[] {
        return this.card_in_zone([ZoneType.Library], player);
    }
    /** 墓地のカード（トークンを含む） */
    cards_in_graveyard(player?: Player[]): Card[] {
        return this.card_in_zone([ZoneType.Graveyard], player);
    }
    /** 統率領域のカード（トークンを含む） */
    cards_in_command(player?: Player[]): Card[] {
        return this.card_in_zone([ZoneType.Command], player);
    }

    /** すべての生成された効果 */
    generated_effects(): GeneratedEffect[] {
        return this.#game_objects.filter((go) => go instanceof GeneratedEffect);
    }

    /** すべての継続的効果 */
    continuous_effects(): ContinuousEffect[] {
        return this.#game_objects.filter(
            (go) => go instanceof ContinuousEffect
        );
    }
    /** すべての遅延誘発型能力 */
    delayed_triggered_abilities(): DelayedTriggeredAbility[] {
        return this.#game_objects.filter(
            (go) => go instanceof DelayedTriggeredAbility
        );
    }
    /** すべての置換効果 */
    replacement_effects(): ReplacementEffect[] {
        return this.#game_objects.filter(
            (go) => go instanceof ReplacementEffect
        );
    }
    /** すべてのターン追加効果（生成された順） */
    additional_turn_effects(): AdditionalTurnEffect[] {
        return this.#game_objects.filter(
            (go) => go instanceof AdditionalTurnEffect
        );
    }
    /** すべてのフェイズ追加効果（生成された順） */
    additional_phase_effects(): AdditionalPhaseEffect[] {
        return this.#game_objects.filter(
            (go) => go instanceof AdditionalPhaseEffect
        );
    }
    /** すべてのステップ追加効果（生成された順） */
    additional_step_effects(): AdditionalStepEffect[] {
        return this.#game_objects.filter(
            (go) => go instanceof AdditionalStepEffect
        );
    }

    // ==================================================================
    // MARK:GameState/プレイヤー
    /** すべてのプレイヤー */
    players(): Set<Player> {
        return this.#players;
    }
    /** アクティブプレイヤー */
    active_player(): Player | undefined {
        return this.#active_player_index === undefined
            ? undefined
            : this.#turn_order[this.#active_player_index];
    }
    /** 優先権を持つプレイヤー */
    player_with_priority(): Player | undefined {
        return this.#priority_player_index === undefined
            ? undefined
            : this.#turn_order[this.#priority_player_index];
    }

    /** アクティブプレイヤーから始めて各プレイヤーをターン進行順に並べた配列 */
    from_active_player(): Player[] | undefined {
        if (this.#active_player_index === undefined) {
            return undefined;
        } else {
            return new Array<Player>().concat(
                this.#turn_order.slice(this.#active_player_index),
                this.#turn_order.slice(0, this.#active_player_index - 1)
            );
        }
    }
    /** 指定したプレイヤーからターン進行順で次のプレイヤー */
    next_player_of(player: Player): Player | undefined {
        const idx = this.#turn_order.indexOf(player);
        if (idx < 0) {
            return undefined;
        } else {
            return this.#turn_order[
                idx + 1 < this.#turn_order.length ? idx + 1 : 0
            ];
        }
    }

    // ==================================================================
    // MARK: GameState/領域
    /** 戦場 */
    battlefield(): Zone {
        return this.zones([ZoneType.Battlefield])[0];
    }
    /** スタック */
    stack(): Zone {
        return this.zones([ZoneType.Stack])[0];
    }
    /** 追放 */
    exile(): Zone {
        return this.zones([ZoneType.Exile])[0];
    }
    /** 手札（人数分） */
    hand(player: Player): Zone {
        return this.zones([ZoneType.Hand], [player])[0];
    }
    /** ライブラリー（人数分） */
    library(player: Player): Zone {
        return this.zones([ZoneType.Library], [player])[0];
    }
    /** 墓地（人数分） */
    graveyard(player: Player): Zone {
        return this.zones([ZoneType.Graveyard], [player])[0];
    }
    /** 統率（人数分） */
    command(player: Player): Zone {
        return this.zones([ZoneType.Command], [player])[0];
    }

    /** 指定したプレイヤーの指定した種類の領域を取得 */
    zones(zonetype: ZoneType[], owner?: Player[]): Zone[] {
        return new Array(...this.#zones).filter(
            (z) =>
                zonetype.includes(z.zonetype) &&
                (owner === undefined ||
                    owner.length == 0 ||
                    z.owner === undefined ||
                    owner.includes(z.owner))
        );
    }

    // ==================================================================
    // MARK: GameState/ターン
    // TODO:
    get turn(): Turn {
        return this.#turn;
    }
    get phase(): Phase {
        return this.#phase;
    }
    get step(): Step | undefined {
        return this.#step;
    }

    // ==================================================================
    /** ディープコピー */
    deepcopy(): GameState {
        return new GameState(); // TODO:
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
    // run(initial_state: GameState): void {
    //     const history = new Array<GameState>(initial_state);
    //     const current_state = () => history[-1];

    //     let flag_goto_next = true; // 次のターン・フェイズ・ステップに移行するかどうか
    //     while (true) {
    //         /* ターン、フェイズ、ステップの移行処理 */
    //         if (flag_goto_next) {
    //             flag_goto_next = false;

    //             /* 次のターン or フェイズ or ステップに移行する */
    //             history.push();
    //             goto_next(state);

    //             /* ターン起因処理 */
    //             state.turn_based_action();

    //             /* アクティブプレイヤーが優先権を得る */
    //             /* クリンナップの場合、もう一度クリンナップを行う */
    //             if (state.step?.is_cleanup_step()) {
    //                 state.cleanup_again = state.set_priority_to(
    //                     state.active_player
    //                 );
    //             } else {
    //                 state.set_priority_to(state.active_player);
    //             }
    //         } else {
    //             /* 行動後、優先権を得る */
    //             state.set_priority_to(state.player_with_priority);
    //         }

    //         /* 優先権を持つプレイヤーの行動 */
    //         switch (state.current_step) {
    //             case Turn.Step.untap_step:
    //                 // アンタップ・ステップでは優先権は発生しない。
    //                 break;
    //             case Turn.Step.cleanup_step:
    //                 // クリンナップ・ステップでは、
    //                 // 状況起因処理か能力の誘発があった場合のみ優先権が発生する。
    //                 if (state.cleanup_again) {
    //                     state.perform_priority_action();
    //                 }
    //                 break;
    //             default:
    //                 // 優先権により行動する
    //                 state.perform_priority_action();
    //                 break;
    //         }

    //         if (state.pass_count == state.players.length) {
    //             /* 全員が連続でパスした */
    //             state.pass_count = 0;
    //             if (state.stack.length > 0) {
    //                 /* スタックに何かある場合、スタック上のものを1つ解決する */
    //                 state.resolve_stack();
    //                 /* アクティブプレイヤーが優先権を得る */
    //                 state.set_priority_to(state.active_player);
    //             } else {
    //                 /* スタックが空の場合、次のフェイズ・ステップに移る */
    //                 flag_goto_next = true;
    //             }
    //         }
    //     }
    // }

    run2(): void {
        while (true) {
            if (
                // 全員が連続で優先権をパスしている。
                // クリンナップ・ステップではフラグが立っている場合のみ。
                // アンタップ・ステップでは優先権は発生しないが、アンタップ・ステップでここに来ることはない。
                (this.current.step?.kind === "Cleanup" &&
                    this.current.cleanup_again) ||
                this.current.pass_count === this.current.players.size
            ) {
                // スタックが空
                if (this.current.objects_on_stack.length === 0) {
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
            // まだ全員がパスしていない
            else {
                // 優先権に基づく行動。なにか行動するか、または優先権をパスする
                this.take_priority_action();
            }
        }
    }

    /** 現在のステップやフェイズを終了し、次のステップやフェイズに移行する。
     * 移った先のフェイズやステップにターン起因処理がある場合はそれも行う。
     * - 次がメイン・フェイズである場合は、ステップがないのでメイン・フェイズに移る。
     * - 現在がクリンナップ・ステップである場合は、次のターンに移る。
     * - 追加ターンや追加のフェイズ、追加のステップがある場合はそれに移る。
     */
    goto_next(): void {
        // 移る先のフェイズやステップ、ターンを決める。追加ターンや追加のフェイズ・ステップを考慮する

        const next = next_phase_and_step(
            this.current.phase.kind,
            this.current.step?.kind
        );
        // ステップの追加があるならそれに移る FIXME:
        if (1) {
        }
        // ないなら次のステップに移る
        else if (next.step) {
        }
        // 次のステップがないなら、フェイズの追加があるならそれに移る FIXME:
        else if (1) {
        }
        // フェイズの追加がないなら次のフェイズに移る
        else if (next.phase) {
        }
        // 次のフェイズがないなら、ターンの追加があるならそれに移る FIXME:
        else if (1) {
        }
        // ターンの追加がないなら次のターンに移る
        else {
        }
        // TODO: スキップは実際にそれに移ろうとしたタイミングで適用する (in goto_step, goto_phase, goto_turn)

        ("================");
        // if (!this.current.step?.is_cleanup_step()) {
        //     this.goto_new_phase_or_step();
        //     /* クリンナップ・ステップ以外の場合は、次のフェイズまたはステップへ移行する */
        //     // TODO: 移行先のフェイズやステップを確認する
        //     // TODO: フェイズ、ステップを追加またスキップする効果
        // } else {
        //     /* 現在クリンナップ・ステップの場合 */
        //     if (state.cleanup_again) {
        //         /* フラグが立っているなら再度クリンナップ・ステップを行う */
        //         state.goto_new_phase_or_step(new Turn.CleanupStep());
        //     } else {
        //         /* フラグが立っていないなら新しいターンを始める */
        //         let turn;
        //         /** --> ループ */
        //         /** 次に始まるターンを決定する。
        //          * 追加ターンがあれば、最後に発生した追加ターンを取り出す。（追加ターンはスタック式）
        //          * 追加ターンがなければ通常のターンとなる。
        //          */
        //         if (state.extra_turns.length > 0) {
        //             turn = undefined; // FIXME ?
        //         } else {
        //             turn = new Turn.Turn(
        //                 state.current_turn.count++,
        //                 state.get_next_player_of(state.current_turn.player)
        //             );
        //         }
        //         /** ターンスキップのチェック。複数ある場合はどれを適用するか選択。
        //          * スキップ効果が消滅するなら消滅する */
        //         // Time Vault
        //         if (state.skip_turns.length > 0) {
        //             // TODO 適用するスキップを選択
        //         } else {
        //             // TODO
        //         }
        //         /** <-- ターンが消滅したならループの先頭に戻る */
        //         /** 決定したターンを開始する */
        //         state.goto_new_turn(turn);
        //     }
        // }
        // state.cleanup_again = false;
    }

    /** ステップを移る。追加のステップ`step`が渡されたならそれに移る。
     * 渡されなかったなら、通常のステップ順で次のステップに移る。
     * ステップがスキップする場合はそれも考慮する。
     * 現在のフェイズに次のステップがもうないか、
     * 現在のステップがない（メインフェイズ）ならエラーを投げる。 */
    // goto_step(step?: Step): void {
    //     // stepが与えられていないなら新しいステップを生成する
    //     if (step === undefined) {
    //         // 次のステップがない場合はエラー
    //         if (this.current.step?.next_kind === undefined) {
    //             throw new Error("No next step");
    //         } else {
    //             // 新しいステップを生成する
    //             step = new Step(
    //                 this.current.step.next_kind,
    //                 this.current.active_player
    //             ); // FIXME: newした時点でidが振られてしまう。newする際にhistoryを参照して最新+1を振ること。
    //         }
    //     }
    //     // TODO: ターン、フェイズ、ステップを「飛ばす」は置換効果なので、
    //     // 逆に開始することはinstructionとして行う必要がある

    //     // stepを更新する
    //     const new_state = this.current.deepcopy();
    //     new_state.step = step;
    //     // stateを移る
    //     this.#history.push(new_state);

    //     // 移った先のステップのターン起因処理を行う
    //     // TODO:
    // }
    goto_phase(phase?: Phase): void {}
    goto_turn(turn?: Turn): void {}
    get_extra_step(): Step | undefined {}
    get_extra_phase(): Phase | undefined {}
    get_extra_turn(): Turn | undefined {}
    is_skipped(arg: Step | Phase | Turn): boolean {}

    /** スタックを1つ解決する */
    resolve_stack(): void {}

    /** 状況起因処理 (1回) */
    state_based_action(): void {}

    /** 状況誘発 */
    check_state_triggers(state: GameState): void {}

    /** 誘発した能力をスタックに置く */
    put_triggered_abilities_on_stack(): void {}

    /** プレイヤーが優先権を得る */ // FIXME:
    set_priority_to(): void {
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
    }

    /** 優先権による行動。呪文を唱える、能力を起動する、特別な処理を行う、優先権をパスする */
    take_priority_action(): void {
        let action: "cast" | "activate" | "take_special_action" | "pass" =
            ask_action_to_player(); // TODO: ask_action_to_player()
        // 呪文を唱える
        if (action == "cast") {
            // state.pass_count = 0;
        }
        // 能力を起動する
        if (action == "activate") {
            // state.pass_count = 0;
        }
        // 特別な処理を行う
        if (action == "take_special_action") {
            // state.pass_count = 0;
        }
        // 優先権をパスする
        if (action == "pass") {
            // state.set_priority_to(
            //     state.get_next_player_of(state.player_with_priority)
            // ); // TODO:
            // state.pass_count++;
        }
    }
}

/** 領域の種別 OK */
class ZoneType {
    /** 領域の名前 */
    name: string;
    /** オーナーを持つかどうか。 */
    has_owner: boolean;
    /** この領域に置かれているオブジェクトが順序を持つかどうか。 */
    has_order: boolean;

    /**
     *
     * @param name 領域の名前
     * @param has_owner オーナーを持つかどうか。
     * @param has_order この領域に置かれているオブジェクトが順序を持つかどうか。
     */
    constructor(name: string, has_owner: boolean, has_order: boolean) {
        this.name = name;
        this.has_owner = has_owner;
        this.has_order = has_order;
    }

    /** 戦場 */
    static Battlefield = new ZoneType("battlefield", false, false);
    /** 手札 */
    static Hand = new ZoneType("hand", true, false);
    /** ライブラリー */
    static Library = new ZoneType("library", true, true);
    /** 墓地 */
    static Graveyard = new ZoneType("graveyard", true, true);
    /** 追放 */
    static Exile = new ZoneType("exile", false, false);
    /** スタック */
    static Stack = new ZoneType("stack", false, true);
    /** 統率 */
    static Command = new ZoneType("command", true, false);
}

/** 領域 */
class Zone {
    /** 領域の種別 */
    zonetype: ZoneType;
    /** 領域のオーナー */
    owner?: Player;
    /** この領域にあるオブジェクト */
    objects: GameObject[] = [];

    /**
     * @param zonetype 領域の種別
     * @param owner 領域のオーナー
     */
    constructor(zonetype: ZoneType, owner?: Player) {
        if (zonetype.has_owner) {
            if (owner !== undefined) {
                this.zonetype = zonetype;
                this.owner = owner;
            } else {
                throw new Error("owner of zone is undefined");
            }
        } else {
            this.zonetype = zonetype;
        }
    }
}
