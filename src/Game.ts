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
    Spell,
    is_spell,
} from "./GameObject";
import { DelayedTriggeredAbility } from "./Ability";
import {
    Turn,
    Phase,
    Step,
    next_phase_and_step,
    first_step_of_phase,
} from "./Turn";
import { ReferenceParam, resolve_single_spec } from "./Reference";
import {
    BeginNewPhaseAndStep,
    BeginNewStep,
    BeginNewTurn,
    Instruction,
    Resolve,
} from "./Instruction";

export { GameInfo, GameState, Game, Zone, ZoneType };

// MARK: Game
class GameInfo {
    /** ゲームを表すオブジェクト */
    id: number = 0;
    players: Set<Player>;
    decks = []; // FIXME: サイドボード
    game_state: GameState = new GameState();

    // initGame(): void {
    //     // FIXME:
    //     // プレイヤーの初期化
    //     state.game_state.players = state.players;
    //     // 領域の初期化
    //     state.game_state.zones.push(
    //         ...state.game_state.players.flatMap((pl) =>
    //             [
    //                 ZoneType.Library,
    //                 ZoneType.Hand,
    //                 ZoneType.Graveyard,
    //                 ZoneType.Command,
    //             ].map((zt) => new Zone(zt, pl))
    //         )
    //     );
    //     state.game_state.zones.push(new Zone(ZoneType.Battlefield));
    //     state.game_state.zones.push(new Zone(ZoneType.Exile));
    //     // TODO ライブラリーとサイドボード
    // }
    constructor() {}
}

// MARK: GameState
/** ゲームの状態 */
// NOTE: GameState は immutable であってほしい
class GameState {
    /** ゲームのメタ情報 */
    #game_meta: GameInfo;

    /** プレイヤー */
    #players: Set<Player>;
    /** プレイヤーのターン進行順 */
    #turn_order: Player[]; // TODO: get_order(), set_order()
    #active_player_index?: number;
    #priority_player_index?: number;

    /** 領域 */
    #zones: Set<Zone> = new Set<Zone>();
    /** すべてのオブジェクト */
    #game_objects: GameObject[] = []; // TODO: Mapに変えるかも

    /** 現在のターン */
    #turn: Turn;
    /** 現在のフェイズ */
    #phase: Phase;
    /** 現在のステップ */
    #step?: Step;

    /** 優先権を連続でパスしたプレイヤーの数 */
    #pass_count: number = 0;
    pass_count(): number {
        return this.#pass_count;
    }
    /** クリンナップをもう一度行うかどうか。
     * クリンナップの間に状況起因処理か能力の誘発があった場合、
     * そのクリンナップでは優先権が発生するとともに、追加のクリンナップが発生する。 */
    #cleanup_again = false;
    cleanup_again(): boolean {
        return this.#cleanup_again;
    }

    // ==================================================================
    // MARK: GameState/object
    add_game_object(...objects: GameObject[]) {
        this.#game_objects.push(...objects);
    }
    all_game_objects(): GameObject[] {
        return this.#game_objects;
    }

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
    stacked_objects(): (Spell | StackedAbility)[] {
        return this.#game_objects
            .filter(
                (go) =>
                    (go instanceof Card && is_spell(go)) ||
                    go instanceof StackedAbility
            )
            .filter(
                (go) =>
                    go instanceof StackedAbility ||
                    go.zone.zonetype === ZoneType.Stack
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
    // add_player(player: Player) {}
    /** アクティブプレイヤー */
    get_active_player(): Player | undefined {
        return this.#active_player_index === undefined
            ? undefined
            : this.#turn_order[this.#active_player_index];
    }
    set_active_player(player: Player) {
        // TODO:
    }
    /** 優先権を持つプレイヤー */
    get_player_with_priority(): Player | undefined {
        return this.#priority_player_index === undefined
            ? undefined
            : this.#turn_order[this.#priority_player_index];
    }
    set_player_with_priority(player: Player) {
        // TODO:
    }

    /** ターン順 */
    get_turn_order() {
        return this.#turn_order;
    }
    /** ターン順を設定する。ゲームに存在しないプレイヤーが与えられた場合は無視する。 */
    set_turn_order(players: Player[]) {
        this.#turn_order = [];
        players.forEach((pl) => {
            if (this.players().has(pl)) {
                this.#turn_order.push(pl);
            }
        });
    }

    // TODO: これ統合できない？
    // FIXME: アクティブプレイヤーとは現在のターンのオーナーである
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

    /** ターン順で、現在のアクティブ・プレイヤーの次のプレイヤー。
     * アクティブ・プレイヤーが存在しないときは `undefined`
     */
    next_player_of_active_player(): Player | undefined {
        const active_player = this.get_active_player();
        return active_player !== undefined
            ? this.next_player_of(active_player)
            : undefined;
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
    get_turn(): Turn {
        return this.#turn;
    }
    set_turn(turn: Turn) {
        this.#turn = turn;
    }
    get_phase(): Phase {
        return this.#phase;
    }
    set_phase(phase: Phase) {
        this.#phase = phase;
    }
    get_step(): Step | undefined {
        return this.#step;
    }
    set_step(step: Step | undefined) {
        this.#step = step;
    }

    // ==================================================================
    /** ディープコピー */
    deepcopy(): GameState {
        return new GameState(); // TODO:
    }
}

// MARK: GameHistory
/** ゲームの履歴。実装は隠蔽する */
class Game {
    #history: GameState[] = [];

    constructor(...state: GameState[]) {
        this.#history = state;
    }

    get current(): GameState {
        return this.#history[-1];
    }

    /** メインループ */
    run(): void {
        while (true) {
            if (
                // 全員が連続で優先権をパスしている。
                // クリンナップ・ステップではフラグが立っている場合のみ。
                // アンタップ・ステップでは優先権は発生しないが、アンタップ・ステップでここに来ることはない。
                this.current.pass_count() === this.current.players().size &&
                (this.current.get_step()?.kind !== "Cleanup" ||
                    this.current.cleanup_again())
            ) {
                // スタックが空
                if (this.current.stacked_objects().length === 0) {
                    // 次のフェイズやステップに移る。
                    this.goto_next();
                    // TODO: ターン起因処理
                    // アクティブプレイヤーが優先権を得る
                    const active_player = this.current.get_active_player();
                    this.set_priority_to(
                        active_player ?? this.current.get_turn_order()[0]
                    );
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
                // アクティブプレイヤーが優先権に基づいて行動する。または優先権をパスする
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
        /** 配列を反転した配列を新たに生成して返す。 */
        const toReversed = <T>(array: T[]) => Array.from(array).reverse();

        // ステップの追加があるならそれに移る
        for (const effect of toReversed(
            this.current.additional_step_effects()
        )) {
            const params: ReferenceParam = {
                game: this,
                self: effect,
            };
            if (resolve_single_spec(effect.condition, params)) {
                this.begin_new_step(effect.generate_step(params));
                return;
            }
        }
        // 同じフェイズに次のステップがあるならそれに移る
        const { phase: next_phase_kind, step: next_step_kind } =
            next_phase_and_step(
                this.current.get_phase().kind,
                this.current.get_step()?.kind
            );
        if (next_phase_kind === this.current.get_phase().kind) {
            this.begin_new_step(
                next_step_kind !== undefined
                    ? new Step(this.#get_new_step_id(), next_step_kind)
                    : undefined
            );
            return;
        }
        // フェイズの追加があるならそれに移る
        for (const effect of toReversed(
            this.current.additional_phase_effects()
        )) {
            const params: ReferenceParam = {
                game: this,
                self: effect,
            };
            if (resolve_single_spec(effect.condition, params)) {
                const new_phase = effect.generate_phase(params);
                const new_step_kind = first_step_of_phase(new_phase.kind);
                this.begin_new_phase_and_step(
                    new_phase,
                    new_step_kind !== undefined
                        ? new Step(this.#get_new_step_id(), new_step_kind)
                        : undefined
                );
                return;
            }
        }
        // 次のフェイズがあるなら、次のフェイズに移る
        if (next_phase_kind !== undefined) {
            this.begin_new_phase_and_step(
                new Phase(this.#get_new_phase_id(), next_phase_kind),
                next_step_kind !== undefined
                    ? new Step(this.#get_new_step_id(), next_step_kind)
                    : undefined
            );
            return;
        }
        // ターンの追加があるならそれに移る
        for (const effect of toReversed(
            this.current.additional_turn_effects()
        )) {
            const params: ReferenceParam = {
                game: this,
                self: effect,
            };
            if (resolve_single_spec(effect.condition, params)) {
                this.begin_new_turn(effect.generate_turn(params));
                return;
            }
        }
        // 次のプレイヤーのターンに移る
        this.begin_new_turn(
            new Turn(
                this.#get_new_turn_id(),
                this.current.next_player_of_active_player() ??
                    this.current.get_turn_order()[0]
            )
        );
        // TODO: アクティブプレイヤーが優先権を得る
        // ターンを移る間に能力が誘発したり状況起因処理が必要になったりした場合、
        // 通常通りそれらを処理してからアクティブプレイヤーが優先権を得る
        // ただしアンタップ・ステップには優先権は発生しないのでアップキープになる
        // アンタップステップにも誘発した場合アップキープに好きな順で積む
        return;
    }

    /** `Instruction`を実行する。新しい`GameState`を生成し、移行する。 */
    perform(instruction: Instruction, self: GameObject | undefined) {
        const state_new = this.current.deepcopy();
        // TODO: 置換効果、禁止効果など
        instruction.perform(state_new, { game: this, self: self });
        this.#history.push(state_new);
    }

    /** 新しいターンを開始する。 */
    begin_new_turn(turn: Turn) {
        this.perform(new BeginNewTurn(turn), undefined);
    }
    /** 新しいフェイズ、ステップを開始する。 */
    begin_new_phase_and_step(phase: Phase, step: Step | undefined) {
        this.perform(new BeginNewPhaseAndStep(phase, step), undefined);
    }
    begin_new_step(step: Step | undefined) {
        this.perform(new BeginNewStep(step), undefined);
    }

    #get_new_turn_id(): number {
        return this.current.get_turn().id + 1;
    }
    #get_new_phase_id(): number {
        return this.current.get_phase().id + 1;
    }
    #get_new_step_id(): number {
        /** 配列を反転した配列を新たに生成して返す。 */
        const toReversed = <T>(array: T[]) => Array.from(array).reverse();

        const last_step = toReversed(this.#history)
            .find((state) => state.get_step !== undefined)
            ?.get_step();
        return last_step !== undefined ? last_step.id + 1 : 0;
    }

    // TODO:
    // will_skipped(arg: Step | Phase | Turn): boolean {}

    /** プレイヤーが優先権を得る */
    set_priority_to(player: Player): void {
        // TODO:
        /* 状況起因処理と誘発 */
        // let ret = false;
        // let flag = true;
        // while (flag) {
        //     // 何もなくなるまで繰り返す
        //     flag = false;
        //     /* 発生しなくなるまで状況起因処理を繰り返す */
        //     while (state.state_based_action()) {
        //         // なにかあったらtrue
        //         flag = true;
        //         ret = true;
        //     }
        //     /* 誘発していた能力をスタックに置く */
        //     if (state.put_triggered_abilities_on_stack()) {
        //         flag = true;
        //         ret = true;
        //     }
        // }
        // /* プレイヤーが優先権を得る */
        // state.player_with_priority = player;
    }

    /** 状況起因処理 (1回) */
    state_based_action(): void {
        // TODO: 状況起因処理は Instruction を含む
    }

    /** 誘発した能力をスタックに置く */
    put_triggered_abilities_on_stack(): void {
        // TODO:
    }

    /** 状況誘発 */
    check_state_triggers(state: GameState): void {
        // TODO:
    }

    /** スタックを1つ解決する */
    resolve_stack(): void {
        const stacked_obj = this.current.stacked_objects()[-1];
        this.perform(stacked_obj.resolve, stacked_obj);
    }

    /** 優先権による行動。呪文を唱える、能力を起動する、特別な処理を行う、優先権をパスする */
    take_priority_action(): void {
        // let action: "cast" | "activate" | "take_special_action" | "pass" =
        //     ask_action_to_player(); // TODO: ask_action_to_player()
        // // 呪文を唱える
        // if (action == "cast") {
        //     // state.pass_count = 0;
        // }
        // // 能力を起動する
        // if (action == "activate") {
        //     // state.pass_count = 0;
        // }
        // // 特別な処理を行う
        // if (action == "take_special_action") {
        //     // state.pass_count = 0;
        // }
        // // 優先権をパスする
        // if (action == "pass") {
        //     // state.set_priority_to(
        //     //     state.get_next_player_of(state.player_with_priority)
        //     // ); // TODO:
        //     // state.pass_count++;
        // }
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
    /** 追放 */
    static Exile = new ZoneType("exile", false, false);
    /** スタック */
    static Stack = new ZoneType("stack", false, true);
    /** 手札 */
    static Hand = new ZoneType("hand", true, false);
    /** ライブラリー */
    static Library = new ZoneType("library", true, true);
    /** 墓地 */
    static Graveyard = new ZoneType("graveyard", true, true);
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
