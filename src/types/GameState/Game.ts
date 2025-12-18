import type { GameState } from "./GameState.js";
import type { MatchInfo } from "./Match.js";
import { GameObject } from "../GameObject/GameObject.js";
import {
    Turn,
    Phase,
    Step,
    next_phase_and_step,
    first_step_of_phase,
    type PhaseKind,
    type StepKind,
} from "../Turn/Turn.js";
import { StackedAbility } from "../GameObject/StackedAbility.js";
import {
    AdditionalPhaseEffect,
    AdditionalStepEffect,
    AdditionalTurnEffect,
} from "../GameObject/GeneratedEffect/AdditionalTurnEffect.js";
import { type QueryArgument, resolveSingleSpec } from "../Query.js";
import {
    BeginNewPhaseAndStep,
    BeginNewStep,
    BeginNewTurn,
    Instruction,
} from "../Instruction.js";
import { Stack } from "./Zone.js";

// MARK: Game
/** ゲーム全体。ゲームのすべての断面を持つ。 */
export class Game {
    match_info: MatchInfo;

    #history: GameState[] = [];

    constructor(...state: GameState[]) {
        this.#history = state;
    }

    get current(): GameState {
        return this.#history[-1];
    }

    // MARK: Game/メインループ
    /** メインループ */
    run(): void {
        // TODO: ゲーム開始時の手順 (Instruction)、血清の粉末、力線
        while (true) {
            if (
                // 全員が連続で優先権をパスしている。
                // クリンナップ・ステップではフラグが立っている場合のみ。
                // アンタップ・ステップでは優先権は発生しないが、アンタップ・ステップでここに来ることはない。
                this.current.passCount() === this.current.getPlayers().length &&
                (this.current.getStep()?.kind !== "Cleanup" ||
                    this.current.cleanupAgain())
            ) {
                // スタックが空
                if (this.current.stacked_objects().length === 0) {
                    // TODO: 未使用のマナが消滅する
                    // 次のフェイズやステップに移る。
                    this.goto_next();
                    // ターン起因処理
                    this.turn_based_action(
                        this.current.getPhase().kind,
                        this.current.getStep()?.kind
                    );
                    // アクティブプレイヤーが優先権を得る
                    const active_player_index = this.current
                        .getTurnOrder()
                        .indexOf(this.current.activePlayer());
                    if (active_player_index >= 0) {
                        this.set_priority_to(active_player_index);
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
            this.current.getGameObjects({ type: AdditionalStepEffect })
        )) {
            const params: QueryArgument = {
                game: this,
                self: effect,
            };
            if (resolveSingleSpec(effect.condition, params)) {
                this.begin_new_step(effect.generate_step(params));
                return;
            }
        }
        // 同じフェイズに次のステップがあるならそれに移る
        const { phase: next_phase_kind, step: next_step_kind } =
            next_phase_and_step(
                this.current.getPhase().kind,
                this.current.getStep()?.kind
            );
        if (next_phase_kind === this.current.getPhase().kind) {
            this.begin_new_step(
                next_step_kind !== undefined
                    ? new Step(this.#get_new_step_id(), next_step_kind)
                    : undefined
            );
            return;
        }
        // フェイズの追加があるならそれに移る
        for (const effect of toReversed(
            this.current.getGameObjects({ type: AdditionalPhaseEffect })
        )) {
            const params: QueryArgument = {
                game: this,
                self: effect,
            };
            if (resolveSingleSpec(effect.condition, params)) {
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
            this.current.getGameObjects({ type: AdditionalTurnEffect })
        )) {
            const params: QueryArgument = {
                game: this,
                self: effect,
            };
            if (resolveSingleSpec(effect.condition, params)) {
                this.begin_new_turn(effect.generate_turn(params));
                return;
            }
        }
        // ターン順で次のプレイヤーのターンに移る
        const index = this.current.getCurrentTurnOrder();
        this.begin_new_turn(
            new Turn(
                this.#get_new_turn_id(),
                this.current.getTurnOrder()[index !== undefined ? index + 1 : 0]
            )
        );
        // TODO: アクティブプレイヤーが優先権を得る
        // ターンを移る間に能力が誘発したり状況起因処理が必要になったりした場合、
        // 通常通りそれらを処理してからアクティブプレイヤーが優先権を得る
        // ただしアンタップ・ステップには優先権は発生しないのでアップキープになる
        // アンタップステップにも誘発した場合アップキープに好きな順で積む
        return;
    }

    // MARK: Game/Instruction
    /** `Instruction`を実行する。新しい`GameState`を生成し、移行する。 */
    perform(self: GameObject | undefined, instruction: Instruction) {
        const state_new = this.current.deepcopy();
        // TODO: 置換効果、禁止効果など
        instruction.perform(state_new, self, this);
        this.#history.push(state_new);
    }
    /** 複数の Instruction をまとめて一度に処理する。 */
    perform_multi(
        args: { self: GameObject | undefined; instruction: Instruction }[]
    ) {
        const state_new = this.current.deepcopy();
        args.forEach((arg) => {
            arg.instruction.perform(state_new, arg.self, this);
        });
        this.#history.push(state_new);
    }

    // MARK: Game/ターン関連
    /** 新しいターンを開始する。 */
    begin_new_turn(turn: Turn) {
        // BeginNewTurn という Instruction を生成して実行
        this.perform(undefined, new BeginNewTurn(turn));
    }
    /** 新しいフェイズ、ステップを開始する。 */
    begin_new_phase_and_step(phase: Phase, step: Step | undefined) {
        // BeginNewPhaseAndStep という Instruction を生成して実行
        this.perform(undefined, new BeginNewPhaseAndStep(phase, step));
    }
    /** 新しいステップを開始する。 */
    begin_new_step(step: Step | undefined) {
        // BeginNewStep という Instruction を生成して実行
        this.perform(undefined, new BeginNewStep(step));
    }
    /** 新しくターンを生成する際に、そのIDを取得する。（最後のターンのID + 1） */
    #get_new_turn_id(): number {
        return this.current.getTurn().id + 1;
    }
    /** 新しくフェイズを生成する際に、そのIDを取得する。（最後のフェイズのID + 1） */
    #get_new_phase_id(): number {
        return this.current.getPhase().id + 1;
    }
    /** 新しくステップを生成する際に、そのIDを取得する。（最後のステップのID + 1）
     * 最後のステップが存在しないなら 0 を返す。
     */
    #get_new_step_id(): number {
        /** 配列を反転した配列を新たに生成して返す関数。 */
        const toReversed = <T>(array: T[]) => Array.from(array).reverse();

        const latest_step = toReversed(this.#history)
            .find((state) => state.getStep() !== undefined)
            ?.getStep();
        return latest_step !== undefined ? latest_step.id + 1 : 0;
    }

    // MARK: Game/ターン起因
    /** ターン起因処理を行う。 */
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

    // MARK: Game/状況起因処理
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

    // MARK: Game/スタック置く
    /** 誘発していた能力をスタックに置く */
    put_triggered_abilities_on_stack(): void {
        const abilities = this.current
            .getGameObjects({ type: StackedAbility })
            .filter((ab) => ab.zone?.zonetype !== Stack);
        const range = (num: number) =>
            Array(num)
                .fill(undefined)
                .map((_, i) => i);

        // 各プレイヤーごとに
        for (const player of this.current.getPlayersByAPNAPOrder()) {
            // 自分の能力
            let abl = abilities.filter((a) => a.controller === player);
            // 好きな順でスタックに置く
            while (abl.length > 0) {
                const num = select_number(range(abl.length));
                abl[num].zone = this.current.zones([Stack])[0];
                abl = abl.filter((_, i) => i !== num);
            }
        }
    }

    // MARK: Game/優先権を得る
    /** 状況起因処理と誘発チェックを行った後、プレイヤーが優先権を得る */
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
            if (
                this.current
                    .getGameObjects({ type: StackedAbility })
                    .filter((ab) => ab.zone?.zonetype !== Stack).length > 0
            ) {
                this.put_triggered_abilities_on_stack();
                flag_stack = true;
            }
            // どちらも発生しなければ終わる
            if (!flag_sba && !flag_stack) {
                break;
            }
        }
        /* プレイヤーが優先権を得る */
        this.current.setPlayerWithPriority(index);
    }

    // MARK: Game/行動
    /** 優先権による行動。呪文を唱える、能力を起動する、特別な処理を行う、優先権をパスする */
    take_priority_action(): void {
        // TODO:
        // 1. 呪文を唱える
        // 2. 能力を起動する
        // 3. 特別な処理を行う（土地のプレイ）
        // 4. パスする
    }

    // MARK: Game/解決
    /** スタックを1つ解決する */
    resolve_stack(): void {
        const stacked_obj = this.current.stacked_objects()[-1];
        this.perform(stacked_obj, stacked_obj.resolve);
        // 墓地に置くのは誰？
    }

    // MARK: Game/状況誘発
    /** 状況誘発 */
    check_state_triggers(state: GameState): void {
        // TODO: 誘発条件？
    }
}
