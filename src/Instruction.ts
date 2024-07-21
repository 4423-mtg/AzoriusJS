"use strict";
/** 効果やルールによってゲーム中に行われる指示。
 */

import {
    QueryParam,
    SingleReference,
    MultipleReference,
    Spec,
    SingleSpec,
    MultipleSpec,
    resolve_single_spec,
    resolve_multiple_spec,
    resolve_spec,
    top_of_library,
} from "./Reference";
import { Game, GameHistory, GameState } from "./Game";
import {
    ContinousEffectType,
    ContinuousEffect,
    DelayedTriggeredAbility,
    ProcessForbiddingContinousEffect,
    InstructionChecker,
    InstructionReplacer,
    Player,
    ProcessAlteringContinousEffect,
    ReplacementEffect,
    GameObject,
    Zone,
    ZoneType,
    Counter,
    Card,
} from "./GameObject";

/** `Instruction`の実行関数`perform()`の引数 */
export type PerformArgs = {
    /** 実行前の状態 */
    state: GameState;
    /** 履歴 */
    history: GameHistory;
    // /** 対象物 */
    // objective?: GameObject[];
};

/** 処理指示を表すクラス。効果やターン起因処理、状況起因処理などの行う指示
 * ゲーム中に実行されるときに`Reference`を通じて実際のゲーム内の情報を注入される
 */
export abstract class Instruction {
    /** 生成済みのインスタンスの数 */
    static instance_count = 0;
    /** InstructionのID (0始まり) */
    readonly id: number;

    /** 指示をしているオブジェクト */
    instructor?: MultipleSpec<GameObject>;
    /** 実際に実行するプレイヤー */
    performer?: MultipleSpec<Player>;

    constructor(args: InstructionCommonParams) {
        this.id = Instruction.instance_count;
        Instruction.instance_count += 1;
        this.instructor = args.instructor;
        this.performer = args.performer;
    }

    /** Instructionの種別の判定 */
    // isInstanceOf(x: any): boolean {
    //     return this instanceof x;
    // }

    /** 指示を実行する
     * @param params 参照に渡すためのパラメータ。
     * どんな引数の参照を持つかは実行時までわからないため、すべてのパラメータが必須。
     */
    abstract perform(params: Required<QueryParam>): GameState;
}
type InstructionCommonParams = {
    instructor?: MultipleSpec<GameObject>;
    performer?: MultipleSpec<Player>;
};

/** 複数の指示を順に実行する */
export function performInstructions(
    instructions: Instruction[],
    args: PerformArgs
): GameState {
    // TODO
    // 複数の連続処理を置換する効果の確認
    // 指示を１つ実行
    // 以下ループ
}

// 抽象的な処理 ************************************************
/** 選択肢を選ぶ */
export class MakingChoice extends Instruction {
    instructions: Instruction[];

    // constructor(instructions: Instruction[]) {
    //     super();
    //     this.instructions = instructions;
    // }

    // perform(args: Required<QueryParam>): GameState {
    //     const choice: number = Question(this.instructions); // FIXME
    //     return this.instructions[choice].perform(args);
    // }
}

/** するかしないか選ぶ */
export class ChoosingToDo extends Instruction {
    instruction: Instruction;

    // constructor(instruction: Instruction) {
    //     super();
    //     this.instruction = instruction;
    // }

    // perform(args: Required<QueryParam>): GameState {
    //     const b: Boolean = Question(); // FIXME
    //     if (b) {
    //         return this.instruction.perform(args); // あとで直すかも
    //     } else {
    //         return args.state;
    //     }
    // }
}

/** 同時に行う */
export class DoingSimultaneously extends Instruction {
    // 任意のものが同時に行えるわけではない！ --> 本当？
    // 別々のオブジェクトの、領域または位相の変更のみ
    // ・ゴブリンの溶接工 アーティファクトを生け贄にすると同時に、墓地のアーティファクトを戦場に戻す
    // ・砕ける波 タップクリーチャーをアンタップすると同時に、アンタップクリーチャーをタップする
    // ・時の砂 上と同じ
    // ・時空の満ち干 フェイズアウトをフェイズインと同時に、他のクリーチャーをフェイズアウト
    // 位相の変更
    // 領域の移動
    // 生け贄
    // フェイズアウト、フェイズイン
    // ダメージを与えるとかも同時にやる・・・
    // instructions: Instruction[];
    // constructor(instructions: Instruction[]) {
    //     super();
    //     this.instructions = instructions;
    // }
    // perform(args: Required<QueryParam>): GameState {
    //     // TODO
    // }
}

/** 何もしない */
export class DoingNothing extends Instruction {
    // perform(args: Required<QueryParam>): GameState {
    //     return args.state;
    // }
}

// ルール上の処理 ************************************************
/** 継続的効果の生成 */
export class GeneratingContinuousEffect extends Instruction {
    // type: ContinousEffectType;
    // effect: ContinuousEffect;
    // constructor(continuous_effect: ContinuousEffect) {
    //     super();
    //     this.effect = continuous_effect;
    // }
    // perform(args: PerformArgs): void {}
}

// TODO 途中
/** 値を変更する効果の生成 */
export class GeneratingValueAlteringEffect extends Instruction {}

// OK
/** 手続きを変更する効果の生成 */
export class GeneratingProcessAlteringEffect extends Instruction {
    // check: InstructionChecker;
    // replace: InstructionReplacer;
    // constructor(
    //     check: InstructionChecker,
    //     replace: Instruction | Instruction[] | InstructionReplacer
    // ) {
    //     super();
    //     this.check = check;
    //     this.replace = CastAsInstructionReplacer(replace);
    // }
    // // perform({ state }: PerformArgs) {
    // //     const ce = new ProcessAlteringContinousEffect(this.check, this.replace);
    // //     state.continuous_effects.push(ce);
    // // }
    // perform(args: Required<QueryParam>): GameState {}
}

// OK
/** 処理を禁止する効果の生成 */
export class GeneratingProcessForbiddingEffect extends Instruction {
    // check: InstructionChecker;
    // constructor(check: InstructionChecker) {
    //     super();
    //     this.check = check;
    // }
    // perform({ state }: PerformArgs): void {
    //     const ce = new ProcessForbiddingContinousEffect(this.check);
    //     state.continuous_effects.push(ce);
    // }
}

/** 遅延誘発型能力の生成 */
export class GeneratingDelayedTriggeredAbility extends Instruction {
    // ability: DelayedTriggeredAbility;
    // constructor(delayed_triggered_ability: DelayedTriggeredAbility) {
    //     super();
    //     this.ability = delayed_triggered_ability;
    // }
    // perform({ state, source }: PerformArgs): void {
    //     state.delayed_triggered_abilities.push(this.ability.copy()); // FIXME 発生源
    // }
}

/** 置換効果の生成 */
export class GeneratingReplacementEffect extends Instruction {
    // replacement_effect: ReplacementEffect;
    // constructor(replacement_effect: ReplacementEffect) {
    //     super();
    //     this.replacement_effect = replacement_effect;
    // }
}

/** 状況誘発のチェック。Instructionの子にしていい？ */
export class CheckingStateTriggers extends Instruction {}

// キーワードでない処理 ********************************
/** 領域を移動させる OK */
export class MovingZone extends Instruction {
    /** 移動させるオブジェクトと、移動先領域の組。OK */
    moving_specs: {
        /** 移動させるオブジェクト */
        objects_spec: Spec<GameObject>;
        /** 移動先の領域 */
        dest: SingleSpec<Zone> | SingleReference<Zone, GameObject>;
    }[];

    constructor(
        args: InstructionCommonParams & {
            /** 移動させるオブジェクトと、移動先領域の組。 */
            specs: {
                /** 移動させるオブジェクト */
                moved_objects:
                    | SingleSpec<GameObject>
                    | MultipleReference<GameObject>;
                /** 移動先の領域 */
                dest: SingleSpec<Zone> | SingleReference<Zone, GameObject>;
            }[];
        }
    ) {
        super(args);
        this.moving_specs = args.specs.map((spec) => ({
            objects_spec: spec.moved_objects,
            dest: spec.dest,
        }));
    }

    perform(params: Required<QueryParam>): GameState {
        const new_state = params.state.deepcopy();
        const new_params = { ...params, state: new_state };
        // 各 spec について
        this.moving_specs.forEach((each_spec) => {
            // object_specを解決
            const obj = resolve_spec<GameObject>(
                each_spec.objects_spec,
                new_params
            );
            const _objs = Array.isArray(obj) ? obj : [obj];
            _objs.forEach((o) => {
                // destを解決して代入
                o.zone = resolve_single_spec<Zone, GameObject>(
                    each_spec.dest,
                    Object.assign(o, new_params)
                );
            });
        });
        return new_state;
    }
}

/** カードを引く */
export class Drawing extends Instruction {
    number: number | ValueReference;

    constructor(number: number | ValueReference, player: Player) {
        super();
        this.number = number;
        this.performer = player;
    }

    perform(args: Required<QueryParam>): GameState {
        /** 「カードを1枚引く」をN個作る */
        const number_of_cards =
            typeof this.number === "number"
                ? this.number
                : this.number.execute(args);

        let instructions: Instruction[] = [];
        for (let i = 0; i < number_of_cards; i++) {
            instructions.push(
                new MovingZone(
                    [top_of_library(this.performer)],
                    args.state.get_zone("Hand", this.performer) // TODO 領域をどうやってとる？
                )
            );
        }

        return Instruction.performArray(instructions, args);
    }
}
// TODO 托鉢するものは置換処理の方で特別扱いする

/** ダメージを与える */
export class DealingDamage extends Instruction {
    /** ダメージを与える先のオブジェクト */
    objectives: (GameObject | Player | ObjectReference)[];
    /** ダメージの量 */
    amount: ValueReference;
    /** ダメージの発生源であるオブジェクト */
    source: ObjectReference;

    constructor(
        objectives: (GameObject | Player | ObjectReference)[],
        amount: ValueReference,
        source: ObjectReference
    ) {
        super();
        this.objectives = objectives;
        this.amount = amount;
        this.source = source;
    }

    perform(args: Required<QueryParam>): GameState {
        // 参照の解決
        let objs: (GameObject | Player)[] = this.objectives.flatMap((o) => {
            return o instanceof GameObject || o instanceof Player
                ? o
                : o.execute(args);
        });
        // 個数のチェック
        if (objs.length >= 2) {
            const each_dealings = new DoingSimultaneously(
                objs.map(
                    (o) => new DealingDamage([o], this.amount, this.source)
                )
            );
            // それぞれに同時にダメージ
            return each_dealings.perform(args);
        } else {
            const new_state = args.state.deepcopy();
            // TODO ダメージ処理。パーマネントはダメージ、プレイヤーはライフ減少
            // TODO 絆魂 --> 回復Instruction
            // TODO 最後の情報
            if (objs[0] instanceof Player) {
                // TODO ライフ減少　感染は毒カウンター --> カウンター配置Instruction
            } else if (objs[0] instanceof GameObject) {
                // TODO ダメージを負う　感染は-1/-1カウンター
            }
            return new_state;
        }
    }
}

/** ライフを得る */
export class GainingLife extends Instruction {
    amount: number | ValueReference;

    constructor(player: Player, amount: number | ValueReference) {
        super();
        this.performer = player;
        this.amount = amount;
    }

    perform(args: Required<QueryParam>): GameState {
        const am =
            this.amount instanceof ValueReference
                ? this.amount.execute(args)
                : this.amount;
        if (this.perform instanceof Player) {
            const new_state = args.state.deepcopy();
            // FIXME new_stateのperformerどうやってとる？
            // (this.performer as Player).life += am;
            return new_state;
        } else {
            throw Error("player undefined");
        }
    }
}

/** カウンターを置く・得る */
export class PuttingCounter extends Instruction {
    counters: Counter[];

    constructor(counters: Counter[]) {
        super();
        this.counters = counters;
    }

    perform(args: Required<QueryParam>): GameState {}
}

/** 見る */
/** 束に分ける */
/** 値を選ぶ・宣言する */
export class DeclaringValue extends Instruction {}

/** 裏向きにする・表向きにする */

// 唱える関連の処理 ********************************
/** 唱える */

/** 起動する */

/** 誘発する */
export class Triggering extends Instruction {}

/** プレイする */

/** 呪文や能力を解決する */
export class Resolving extends Instruction {}

/** 支払う */
export class Paying extends Instruction {}

// キーワード処理 常盤木 *****************************************
/** タップ OK */
export class Tapping extends Instruction {
    refs_objects: MultipleSpec<GameObject>[];
    performer?: MultipleSpec<Player>;
    constructor(permanents: ObjectReference[], performer?: Player) {
        super();
        this.refs_objects = permanents;
        this.performer = performer;
    }

    perform(params: Required<QueryParam>): GameState {
        // まずstateをコピーする。このstateを変更して返す
        const new_state = params.state.deepcopy();
        this.refs_objects.forEach((ref) => {
            // コピーしたstateを渡して参照を解決する
            const objects = ref({ ...params, state: new_state });
            // stateを変更する
            objects.forEach((obj) => {
                // パーマネントであればタップする
                if (obj.is_permanent()) {
                    obj.status.tapped = true;
                } else {
                    throw Error("Referenced object is not a permanent.");
                }
            });
        });
        // 変更した新しいstateを返す
        return new_state;
    }
}

/** アンタップ */
export class Untapping extends Instruction {
    permanents: ValueReference[];
}

/** 破壊する */
export class Destroying extends Instruction {
    refs_objects = [];
}

/** 追放する */
export class Exiling extends Instruction {
    refs_objects: (GameObject | ObjectReference)[];

    // perform(params: Required<QueryParam>): GameState {
    //     const new_state = params.state.deepcopy();
    //     this.refs_objects.map(ref => {
    //         if (ref instanceof GameObject) {
    //             return ref
    //         } else if (typeof ref === "function") {
    //             return ref({...params, state: new_state})
    //         } else {
    //             throw new Error("");
    //         }
    //     }).forEach((obj) => {

    //         const objects = ref({ ...params, state: new_state });
    //         const moving_zone = new MovingZone({moved_objects: objects, dest: })
    //     });
    // }
    perform(params: Required<QueryParam>): GameState {
        // FIXME 「各オブジェクトのオーナーの手札」はどうやって指定する？(ZoneReference)
        // const moving_zone = new MovingZone({moved_objects: this.refs_objects, dest: })
    }
}

/** 生け贄に捧げる */
export class Sacrificing extends Instruction {
    sacrificed_permanents = [];
}

/** 探す */
export class Searching extends Instruction {
    searched_objects = [];
}

/** 切り直す */
export class Shuffling extends Instruction {}

/** 捨てる */
export class Discarding extends Instruction {
    discarded_cards = [];
}

/** 公開する */
export class Revealing extends Instruction {
    revealed_objects = [];
}

/** 打ち消す */
export class Countering extends Instruction {}

/** 生成する */
export class Creating extends Instruction {}

/** つける */
export class Attaching extends Instruction {}
/** はずす */
export class Unattaching extends Instruction {}
/** 格闘を行う */
export class Fighting extends Instruction {}
/** 切削する */
export class Milling extends Instruction {}
/** 占術を行う */
export class Scrying extends Instruction {}
/** 倍にする */
export class Doubling extends Instruction {}
/** 交換する */
export class Exchanging extends Instruction {}

// キーワード処理 常盤木 *****************************************
/** 変身する */
export class Transforming extends Instruction {}

/** 再生する */
export class Regenerating extends Instruction {}

/** 諜報を行う */
export class Surveiling extends Instruction {}

// ================================================
function CastAsInstructionReplacer(
    arg: Instruction | Instruction[] | InstructionReplacer
) {
    if (typeof arg === "function") {
        return arg;
    } else if (Array.isArray(arg)) {
        return () => arg;
    } else {
        return () => [arg];
    }
}
