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
    PhaseKind,
    StepKind,
} from "./Turn";
import { ReferenceParam, resolve_single_spec } from "./Reference";
import {
    BeginNewPhaseAndStep,
    BeginNewStep,
    BeginNewTurn,
    Instruction,
    Resolve,
} from "./Instruction";

export { PlayerInfo, MatchInfo, GameState, Game, Zone, ZoneType };

type PlayerInfo = {
    id: number;
    name: string;
    deck: Card[];
    sideboard: Card[];
};
// MARK: MatchInfo
class MatchInfo {
    /** ゲームのメタ情報 */
    id: number = 0;

    player_info: Array<PlayerInfo>;

    new_game(): Game {
        const state = new GameState();
        // プレイヤー
        state.set_players(this.player_info.map((info) => new Player(info)));
        // ターン順
        state.set_turn_order(state.get_players());
        // 領域
        state.add_zone(new Zone(ZoneType.Battlefield));
        state.add_zone(new Zone(ZoneType.Stack));
        state.add_zone(new Zone(ZoneType.Exile));
        state.get_players().forEach((player) => {
            state.add_zone(new Zone(ZoneType.Hand, player));
            state.add_zone(new Zone(ZoneType.Library, player));
            state.add_zone(new Zone(ZoneType.Graveyard, player));
            state.add_zone(new Zone(ZoneType.Command, player));
        });
        // カード、ターン等は Game.run() へ

        const new_game = new Game(state);
        // マッチ情報
        new_game.match_info = this;
        return new_game;
    }
}

// MARK: GameState
/** ゲームの状態 */
// NOTE: GameState は immutable であってほしい
class GameState {
    /** プレイヤー */
    #players: Player[];
    /** プレイヤーのターン進行順 */
    #turn_order: Player[];
    /** 最後に通常のターンを行ったプレイヤーの、 turn_order でのインデックス。 */
    #turn_order_latest?: number;
    /** 現在優先権を持っているプレイヤーの、 turn_order でのインデックス。 */
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
    /** 誘発してまだスタックに置かれていない誘発型能力 */
    triggered_abilities_not_on_stack(): StackedAbility[] {
        // TODO:
        return [];
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
    get_players(): Player[] {
        return this.#players;
    }
    set_players(players: Player[]) {
        this.#players = players;
    }
    /** アクティブプレイヤー */
    get_active_player(): Player {
        return this.get_turn().active_player;
    }
    /** 優先権を持つプレイヤー */
    get_player_with_priority(): {
        index: number | undefined;
        player: Player | undefined;
    } {
        return this.#priority_player_index !== undefined
            ? {
                  index: this.#priority_player_index,
                  player: this.#turn_order[this.#priority_player_index],
              }
            : {
                  index: undefined,
                  player: undefined,
              };
    }
    set_player_with_priority(index: number) {
        this.#priority_player_index = index;
    }

    /** ターン順 */
    get_turn_order() {
        return this.#turn_order;
    }
    /** ターン順を設定する。ゲームに存在しないプレイヤーが与えられた場合は無視する。 */
    set_turn_order(players: Player[]) {
        this.#turn_order = [];
        players.forEach((pl) => {
            if (this.get_players().includes(pl)) {
                this.#turn_order.push(pl);
            }
        });
    }
    /** 最後に通常のターンを行ったプレイヤーのインデックス。 */
    get_current_turn_order(): number | undefined {
        return this.#turn_order_latest;
    }

    /** 指定した順番を起点としてターン順に1周する、プレイヤーの配列 */
    turn_order_from(index: number): Player[] {
        if (index === 0) {
            return this.#turn_order;
        } else {
            return new Array<Player>().concat(
                this.#turn_order.slice(index),
                this.#turn_order.slice(0, index - 1)
            );
        }
    }
    /** プレイヤーをAPNAP順で返す。 */
    get_players_apnap(): Player[] {
        const index = this.get_turn_order().indexOf(this.get_active_player());
        return this.turn_order_from(index >= 0 ? index : 0);
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
    add_zone(zone: Zone) {
        this.#zones.add(zone);
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

// MARK: Game
/** ゲームの履歴。実装は隠蔽する */
class Game {
    match_info: MatchInfo;

    #history: GameState[] = [];

    constructor(...state: GameState[]) {
        this.#history = state;
    }

    get current(): GameState {
        return this.#history[-1];
    }

    /** メインループ */
    run(): void {
        // TODO: ゲーム開始時の手順 (Instruction)、血清の粉末、力線
        while (true) {
            if (
                // 全員が連続で優先権をパスしている。
                // クリンナップ・ステップではフラグが立っている場合のみ。
                // アンタップ・ステップでは優先権は発生しないが、アンタップ・ステップでここに来ることはない。
                this.current.pass_count() ===
                    this.current.get_players().length &&
                (this.current.get_step()?.kind !== "Cleanup" ||
                    this.current.cleanup_again())
            ) {
                // スタックが空
                if (this.current.stacked_objects().length === 0) {
                    // TODO: 未使用のマナが消滅する
                    // 次のフェイズやステップに移る。
                    this.goto_next();
                    // ターン起因処理
                    this.turn_based_action(
                        this.current.get_phase().kind,
                        this.current.get_step()?.kind
                    );
                    // アクティブプレイヤーが優先権を得る
                    const active_player_first_index = this.current
                        .get_turn_order()
                        .indexOf(this.current.get_active_player());
                    if (active_player_first_index >= 0) {
                        this.set_priority_to(active_player_first_index);
                    } else {
                        this.set_priority_to(0);
                    }
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
        // ターン順で次のプレイヤーのターンに移る
        const index = this.current.get_current_turn_order();
        this.begin_new_turn(
            new Turn(
                this.#get_new_turn_id(),
                this.current.get_turn_order()[
                    index !== undefined ? index + 1 : 0
                ]
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
    let_to_perform(self: GameObject | undefined, instruction: Instruction) {
        const state_new = this.current.deepcopy();
        // TODO: 置換効果、禁止効果など
        instruction.perform(state_new, { game: this, self: self });
        this.#history.push(state_new);
    }
    /** 複数の Instruction をまとめて一度に処理する。 */
    let_to_perform_multi(
        args: { self: GameObject | undefined; instruction: Instruction }[]
    ) {
        const state_new = this.current.deepcopy();
        args.forEach((arg) => {
            arg.instruction.perform(state_new, { game: this, self: arg.self });
        });
        this.#history.push(state_new);
    }

    /** 新しいターンを開始する。 */
    begin_new_turn(turn: Turn) {
        this.let_to_perform(undefined, new BeginNewTurn(turn));
    }
    /** 新しいフェイズ、ステップを開始する。 */
    begin_new_phase_and_step(phase: Phase, step: Step | undefined) {
        this.let_to_perform(undefined, new BeginNewPhaseAndStep(phase, step));
    }
    begin_new_step(step: Step | undefined) {
        this.let_to_perform(undefined, new BeginNewStep(step));
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

    turn_based_action(phasekind: PhaseKind, stepkind: StepKind | undefined) {
        // TODO:
        if (phasekind === "Precombat Main") {
            // 英雄譚にカウンターを置く
            return;
        }
        switch (stepkind) {
            case "Untap":
                // アクティブプレイヤーのパーマネントがフェイズイン／フェイズアウトする
                // 条件を満たしていれば昼夜が入れ替わる
                // アンタップする
                break;

            case "Draw":
                // カードを引く
                break;

            case "Beginning of Combat":
                // 多人数戦の一部ルールのみ
                break;

            case "Declare Attackers":
                // 攻撃クリーチャーを指定する
                break;

            case "Declare Blockers":
                // ブロッククリーチャーを指定する
                break;

            case "Combat Damage":
                // APNAP順に戦闘ダメージの割り振りを宣言する
                // すべての戦闘ダメージが同時に与えられる
                break;

            case "Cleanup":
                // アクティブプレイヤーは手札の上限を超えた分の手札を捨てる
                // パーマネントのダメージを取り除き、ターン終了時までの効果を終了する
                break;
        }
    }

    /** 状況起因処理 (1回)  戻り値は処理を実際に行ったなら true*/
    state_based_action(): boolean {
        // TODO: 状況起因処理は一つの Instruction で同時に処理される
        // ライフが0以下なら敗北する
        // 毒カウンター10以上なら敗北する
        // 前回の状況起因処理以降にライブラリー0枚でカードを引こうとしたプレイヤーは敗北する
        // 致死ダメージを負っているクリーチャーは破壊される
        // タフネス0以下のクリーチャーは墓地に置かれる
        // 忠誠度0のPWは墓地に置かれる
        // 英雄譚が最終章以降かつスタックにそれからの章能力が置かれていないなら生け贄に捧げる
        // バトルが守備カウンター0個で以下同文
        // 不正なオーラは墓地に置かれる
        // 不正な装備品・城砦ははずれる
        // クリーチャーがなにかにつけられているならはずれる
        // オーラや装備品や城砦でないパーマネントがなにかにつけられているならはずれる
        // 戦場にないトークンは消滅する
        // スタックにない呪文のコピーは消滅する
        // +1カウンターと-1カウンターを相殺する
        // レジェンドルール
        return false; // 状況起因処理を実際に行ったなら true
    }

    /** 誘発した能力をスタックに置く */
    put_triggered_abilities_on_stack(): void {
        const abilities = this.current.triggered_abilities_not_on_stack();
        const range = (num: number) =>
            Array(num)
                .fill(undefined)
                .map((_, i) => i);

        // 各プレイヤーごとに
        for (const player of this.current.get_players_apnap()) {
            // 自分の能力
            let abi = abilities.filter((a) => a.controller === player);
            // 好きな順でスタックに置く
            while (abi.length > 0) {
                const num = select_number(range(abi.length));
                abi[num].zone = this.current.zones([ZoneType.Stack])[0];
                abi = abi.filter((_, i) => i !== num);
            }
        }
    }

    /** プレイヤーが優先権を得る */
    set_priority_to(index: number): void {
        while (true) {
            // 発生しなくなるまで状況起因処理を繰り返す
            let flag_sba = false;
            while (true) {
                flag_sba = this.state_based_action();
                if (!flag_sba) {
                    break;
                }
            }
            // 誘発していた能力をスタックに置く
            let flag_stack = false;
            if (this.current.triggered_abilities_not_on_stack().length > 0) {
                this.put_triggered_abilities_on_stack();
                flag_stack = true;
            }
            // どちらも発生しなければ終わる
            if (!flag_sba && !flag_stack) {
                break;
            }
        }
        /* プレイヤーが優先権を得る */
        this.current.set_player_with_priority(index);
    }

    /** 状況誘発 */
    check_state_triggers(state: GameState): void {
        // TODO: 誘発条件？
    }

    /** 優先権による行動。呪文を唱える、能力を起動する、特別な処理を行う、優先権をパスする */
    take_priority_action(): void {
        // TODO:
        // 1. 呪文を唱える
        // 2. 能力を起動する
        // 3. 特別な処理を行う（土地のプレイ）
        // 4. パスする
    }

    /** スタックを1つ解決する */
    resolve_stack(): void {
        const stacked_obj = this.current.stacked_objects()[-1];
        this.let_to_perform(stacked_obj, stacked_obj.resolve);
        // 墓地に置くのは誰？
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
