/** 効果やルールによってゲーム中に行われる指示。 */
import type { GameObject } from "../GameObject/GameObject.js";
import type { Player } from "../GameObject/Player.js";
import type { StackedAbility } from "../GameObject/StackedAbility.js";
import type { Counter } from "../GameObject/Counter.js";
import type { Spell } from "../GameObject/Card/Spell.js";
import type { Zone } from "../GameState/Zone.js";
import type {
    PhaseParameters,
    StepParameters,
    TurnParameters,
} from "../Turn.js";
import type { MultiSpec, SingleSpec } from "../Query.js";

/** 処理。 */
export type Instruction = {
    instructor: SingleSpec<Player>;
    performer: SingleSpec<Player>;
    type: string; // FIXME:
};

// - Instruction は入れ子になることがある。
//   - どのような入れ子になるかは各 Instruction が各自定義する。

// MARK: 基本 ************************************************
/** 複数の処理を同時に行う指示。 */ // ゴブリンの溶接工
export type SimultaneousInstructions = {
    type: "parallel";
    instructions: Instruction[];
};

// MARK: 基本 ************************************************
/** 領域の移動 */
export type Move = Instruction & {
    objects: MultiSpec<GameObject>;
    destination: (
        object: GameObject,
        source: GameObject
    ) => SingleSpec<Zone | undefined>;
};

/** 誘発する */
// class Triggering extends Instruction {}

/** 呪文や能力を解決する。マナ能力を含む */
export type Resolve = Instruction & {
    stackedObject: SingleSpec<Spell | StackedAbility>;
};

/** 支払う */
export type Pay = Instruction & {
    cost: MultiSpec<Instruction>;
    // 任意の処理がコストになりうる（例：炎の編み込み）
};
// 複数のコストは好きな順番で支払える

/** カードを引く */
export type Draw = Instruction & {
    number: SingleSpec<number>;
};
// 托鉢するものは置換処理の方で特別扱いする

/** 新しいターンを開始する */
export type BeginNewTurn = Instruction & {
    type: "BeginNewTurn";
    params: SingleSpec<TurnParameters>;
};

/** 新しいフェイズとステップを開始する */
export type BeginNewPhaseStep = Instruction & {
    type: "BeginNewPhaseStep";
    phase: SingleSpec<PhaseParameters>;
    step?: SingleSpec<StepParameters>;
};

/** 新しいステップを開始する */
export type BeginNewStep = Instruction & {
    type: "BeginNewStep";
    step: SingleSpec<StepParameters>;
};

/** ダメージを与える */ // FIXME:
export type DealDamage = Instruction & {
    /** ダメージの発生源 */
    source: SingleSpec<GameObject>;
    /** ダメージが与えられるオブジェクト */
    object: MultiSpec<GameObject>; // FIXME: only permanent
    /** ダメージの量 */
    number: SingleSpec<number>;
};
// 発生源から対象が決まることも対象から発生源が決まることもあるのでは？（量についても同じ）
// ダメージの結果（絆魂・感染など）
// クリーチャーは被ダメージ、プレイヤーはライフ減少

/** ライフを得る */
export type GainLife = Instruction & {
    amount: (player: Player) => SingleSpec<number>;
};

/** カウンターを置く・得る */
export type PutCounter = Instruction & {
    object: MultiSpec<GameObject>;
    counter: (object: GameObject) => MultiSpec<Counter>;
};

/** 見る */
/** 束に分ける */
/** 値を選ぶ・宣言する */

/** 裏向きにする・表向きにする */

// MARK: 2次的行動 ************************************************
/** 優先権行動 */

/** ターン起因処理 */

//     // MARK: Game/ターン起因
//     /** ターン起因処理を行う。 */
//     turn_based_action(phasekind: PhaseType, stepkind: StepType | undefined) {
//         // TODO:
//         if (phasekind === "Precombat Main") {
//             // 英雄譚にカウンターを置く
//             return;
//         }
//         switch (stepkind) {
//             case "Untap":
//                 // アクティブプレイヤーのパーマネントがフェイズイン／フェイズアウトする
//                 // 条件を満たしていれば昼夜が入れ替わる
//                 // アンタップする
//                 break;

//             case "Draw":
//                 // カードを引く
//                 break;

//             case "Beginning of Combat":
//                 // 多人数戦の一部ルールのみ
//                 break;

//             case "Declare Attackers":
//                 // 攻撃クリーチャーを指定する
//                 break;

//             case "Declare Blockers":
//                 // ブロッククリーチャーを指定する
//                 break;

//             case "Combat Damage":
//                 // APNAP順に戦闘ダメージの割り振りを宣言する
//                 // すべての戦闘ダメージが同時に与えられる
//                 break;

//             case "Cleanup":
//                 // アクティブプレイヤーは手札の上限を超えた分の手札を捨てる
//                 // パーマネントのダメージを取り除き、ターン終了時までの効果を終了する
//                 break;
//         }
//     }

//     // MARK: Game/状況起因処理
//     /** 状況起因処理 (1回)  戻り値は処理を実際に行ったなら true*/
//     state_based_action(): boolean {
//         // TODO: 状況起因処理は一つの Instruction で同時に処理される
//         // ライフが0以下なら敗北する
//         // 毒カウンター10以上なら敗北する
//         // 前回の状況起因処理以降にライブラリー0枚でカードを引こうとしたプレイヤーは敗北する
//         // 致死ダメージを負っているクリーチャーは破壊される
//         // タフネス0以下のクリーチャーは墓地に置かれる
//         // 忠誠度0のPWは墓地に置かれる
//         // 英雄譚が最終章以降かつスタックにそれからの章能力が置かれていないなら生け贄に捧げる
//         // バトルが守備カウンター0個で以下同文
//         // 不正なオーラは墓地に置かれる
//         // 不正な装備品・城砦ははずれる
//         // クリーチャーがなにかにつけられているならはずれる
//         // オーラや装備品や城砦でないパーマネントがなにかにつけられているならはずれる
//         // 戦場にないトークンは消滅する
//         // スタックにない呪文のコピーは消滅する
//         // +1カウンターと-1カウンターを相殺する
//         // レジェンドルール
//         return false; // 状況起因処理を実際に行ったなら true
//     }

// export class Game {
//     match_info: MatchInfo;
//     #history: GameState[] = [];
//
//     /** 現在のステップやフェイズを終了し、次のステップやフェイズに移行する。
//      * 移った先のフェイズやステップにターン起因処理がある場合はそれも行う。
//      * - 次がメイン・フェイズである場合は、ステップがないのでメイン・フェイズに移る。
//      * - 現在がクリンナップ・ステップである場合は、次のターンに移る。
//      * - 追加ターンや追加のフェイズ、追加のステップがある場合はそれに移る。
//      */
//     goto_next(): void {
//         // 移る先のフェイズやステップ、ターンを決める。追加ターンや追加のフェイズ・ステップを考慮する
//         /** 配列を反転した配列を新たに生成して返す。 */
//         const toReversed = <T>(array: T[]) => Array.from(array).reverse();

//         // ステップの追加があるならそれに移る
//         for (const effect of toReversed(
//             this.current.getGameObjects({ type: AdditionalStepEffect })
//         )) {
//             const params: QueryArgument = {
//                 game: this,
//                 self: effect,
//             };
//             if (resolveSingleSpec(effect.condition, params)) {
//                 this.begin_new_step(effect.generate_step(params));
//                 return;
//             }
//         }
//         // 同じフェイズに次のステップがあるならそれに移る
//         const { phase: next_phase_kind, step: next_step_kind } =
//             getNextPhaseAndStep(
//                 this.current.getPhase().kind,
//                 this.current.getStep()?.kind
//             );
//         if (next_phase_kind === this.current.getPhase().kind) {
//             this.begin_new_step(
//                 next_step_kind !== undefined
//                     ? new Step(this.#get_new_step_id(), next_step_kind)
//                     : undefined
//             );
//             return;
//         }
//         // フェイズの追加があるならそれに移る
//         for (const effect of toReversed(
//             this.current.getGameObjects({ type: AdditionalPhaseEffect })
//         )) {
//             const params: QueryArgument = {
//                 game: this,
//                 self: effect,
//             };
//             if (resolveSingleSpec(effect.condition, params)) {
//                 const new_phase = effect.generate_phase(params);
//                 const new_step_kind = getFirstStepOfPhase(new_phase.kind);
//                 this.begin_new_phase_and_step(
//                     new_phase,
//                     new_step_kind !== undefined
//                         ? new Step(this.#get_new_step_id(), new_step_kind)
//                         : undefined
//                 );
//                 return;
//             }
//         }
//         // 次のフェイズがあるなら、次のフェイズに移る
//         if (next_phase_kind !== undefined) {
//             this.begin_new_phase_and_step(
//                 new Phase(this.#get_new_phase_id(), next_phase_kind),
//                 next_step_kind !== undefined
//                     ? new Step(this.#get_new_step_id(), next_step_kind)
//                     : undefined
//             );
//             return;
//         }
//         // ターンの追加があるならそれに移る
//         for (const effect of toReversed(
//             this.current.getGameObjects({ type: AdditionalTurnEffect })
//         )) {
//             const params: QueryArgument = {
//                 game: this,
//                 self: effect,
//             };
//             if (resolveSingleSpec(effect.condition, params)) {
//                 this.begin_new_turn(effect.generate_turn(params));
//                 return;
//             }
//         }
//         // ターン順で次のプレイヤーのターンに移る
//         const index = this.current.getCurrentTurnOrder();
//         this.begin_new_turn(
//             new Turn(
//                 this.#get_new_turn_id(),
//                 this.current.getTurnOrder()[index !== undefined ? index + 1 : 0]
//             )
//         );
//         // TODO: アクティブプレイヤーが優先権を得る
//         // ターンを移る間に能力が誘発したり状況起因処理が必要になったりした場合、
//         // 通常通りそれらを処理してからアクティブプレイヤーが優先権を得る
//         // ただしアンタップ・ステップには優先権は発生しないのでアップキープになる
//         // アンタップステップにも誘発した場合アップキープに好きな順で積む
//         return;
//     }

//     // MARK: Game/スタック置く
//     /** 誘発していた能力をスタックに置く */
//     put_triggered_abilities_on_stack(): void {
//         const abilities = this.current
//             .getGameObjects({ type: StackedAbility })
//             .filter((ab) => ab.zone?.zonetype !== Stack);
//         const range = (num: number) =>
//             Array(num)
//                 .fill(undefined)
//                 .map((_, i) => i);

//         // 各プレイヤーごとに
//         for (const player of this.current.getPlayersByAPNAPOrder()) {
//             // 自分の能力
//             let abl = abilities.filter((a) => a.controller === player);
//             // 好きな順でスタックに置く
//             while (abl.length > 0) {
//                 const num = select_number(range(abl.length));
//                 abl[num].zone = this.current.zones([Stack])[0];
//                 abl = abl.filter((_, i) => i !== num);
//             }
//         }
//     }

//     // MARK: Game/優先権を得る
//     /** 状況起因処理と誘発チェックを行った後、プレイヤーが優先権を得る */
//     set_priority_to(index: number): void {
//         while (true) {
//             // 発生しなくなるまで状況起因処理を繰り返す
//             let flag_sba = false;
//             while (true) {
//                 flag_sba = this.state_based_action();
//                 if (!flag_sba) {
//                     break;
//                 }
//             }
//             // 誘発していた能力をスタックに置く
//             let flag_stack = false;
//             if (
//                 this.current
//                     .getGameObjects({ type: StackedAbility })
//                     .filter((ab) => ab.zone?.zonetype !== Stack).length > 0
//             ) {
//                 this.put_triggered_abilities_on_stack();
//                 flag_stack = true;
//             }
//             // どちらも発生しなければ終わる
//             if (!flag_sba && !flag_stack) {
//                 break;
//             }
//         }
//         /* プレイヤーが優先権を得る */
//         this.current.setPlayerWithPriority(index);
//     }

//     // MARK: Game/行動
//     /** 優先権による行動。呪文を唱える、能力を起動する、特別な処理を行う、優先権をパスする */
//     take_priority_action(): void {
//         // TODO:
//         // 1. 呪文を唱える
//         // 2. 能力を起動する
//         // 3. 特別な処理を行う（土地のプレイ）
//         // 4. パスする
//     }

//     // MARK: Game/解決
//     /** スタックを1つ解決する */
//     resolve_stack(): void {
//         const stacked_obj = this.current.stacked_objects()[-1];
//         this.perform(stacked_obj, stacked_obj.resolve);
//         // 墓地に置くのは誰？
//     }

//     // MARK: Game/状況誘発
//     /** 状況誘発 */
//     check_state_triggers(state: GameState): void {
//         // TODO: 誘発条件？
//     }
// }

// test ok
// const Evacuation = new MoveZone(
//     this.controller,
//     [
//         {
//             moved: new MultiRef((params) => {
//                 return params.game.current
//                     .permanents()
//                     .filter((c) =>
//                         c
//                             .characteristics()
//                             .card_types?.includes(CardType.Creature)
//                     );
//             }),
//             dest: (obj) =>
//                 new SingleRef<Zone>((params) => {
//                     return params.game.current.zones(
//                         [ZoneType.Hand],
//                         [obj.owner]
//                     )[0];
//                 }),
//         },
//     ],
//     this.performer
// );
