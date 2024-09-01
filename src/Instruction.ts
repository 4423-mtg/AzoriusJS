"use strict";
/** 効果やルールによってゲーム中に行われる指示。
 */

import {
    ReferenceParams,
    SingleSpec,
    MultiSpec,
    resolve_single,
    SingleRef,
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

    instructor?: SingleSpec<GameObject>;

    constructor(args: { instructor?: SingleSpec<GameObject> }) {
        this.id = Instruction.instance_count;
        Instruction.instance_count += 1;
        this.instructor = args.instructor;
    }

    abstract perform: (params: ReferenceParams) => GameState;
}

/** 複数の指示を順に実行する */
// export function performInstructions(
//     instructions: Instruction[],
//     args: PerformArgs
// ): GameState {
//     // 複数の連続処理を置換する効果の確認
//     // 指示を１つ実行
//     // 以下ループ
// }

// 抽象的な処理 ************************************************
/** 選択肢を選ぶ */
// export class MakingChoice extends Instruction {
//     instructions: Instruction[];
// }

/** するかしないか選ぶ */
// export class ChoosingToDo extends Instruction {
//     instruction: Instruction;
// }

/** 同時に行う */
// export class DoingSimultaneously extends Instruction {
//     // 任意のものが同時に行えるわけではない！ --> 本当？
//     // 別々のオブジェクトの、領域または位相の変更のみ
//     // ・ゴブリンの溶接工 アーティファクトを生け贄にすると同時に、墓地のアーティファクトを戦場に戻す
//     // ・砕ける波 タップクリーチャーをアンタップすると同時に、アンタップクリーチャーをタップする
//     // ・時の砂 上と同じ
//     // ・時空の満ち干 フェイズアウトをフェイズインと同時に、他のクリーチャーをフェイズアウト
//     // 位相の変更
//     // 領域の移動
//     // 生け贄
//     // フェイズアウト、フェイズイン
//     // ダメージを与えるとかも同時にやる・・・
//     // instructions: Instruction[];
//     // constructor(instructions: Instruction[]) {
//     //     super();
//     //     this.instructions = instructions;
//     // }
//     // perform(args: Required<QueryParam>): GameState {
//     // }
// }

/** 何もしない */
// export class DoingNothing extends Instruction {
//     // perform(args: Required<QueryParam>): GameState {
//     //     return args.state;
//     // }
// }

// ルール上の処理 ************************************************
/** 継続的効果の生成 */
// export class GeneratingContinuousEffect extends Instruction {
//     // type: ContinousEffectType;
//     // effect: ContinuousEffect;
//     // constructor(continuous_effect: ContinuousEffect) {
//     //     super();
//     //     this.effect = continuous_effect;
//     // }
//     // perform(args: PerformArgs): void {}
// }

/** 値を変更する効果の生成 */
// export class GeneratingValueAlteringEffect extends Instruction {}

/** 手続きを変更する効果の生成 */
// export class GeneratingProcessAlteringEffect extends Instruction {
//     // check: InstructionChecker;
//     // replace: InstructionReplacer;
//     // constructor(
//     //     check: InstructionChecker,
//     //     replace: Instruction | Instruction[] | InstructionReplacer
//     // ) {
//     //     super();
//     //     this.check = check;
//     //     this.replace = CastAsInstructionReplacer(replace);
//     // }
//     // // perform({ state }: PerformArgs) {
//     // //     const ce = new ProcessAlteringContinousEffect(this.check, this.replace);
//     // //     state.continuous_effects.push(ce);
//     // // }
//     // perform(args: Required<QueryParam>): GameState {}
// }

/** 処理を禁止する効果の生成 */
// export class GeneratingProcessForbiddingEffect extends Instruction {
//     // check: InstructionChecker;
//     // constructor(check: InstructionChecker) {
//     //     super();
//     //     this.check = check;
//     // }
//     // perform({ state }: PerformArgs): void {
//     //     const ce = new ProcessForbiddingContinousEffect(this.check);
//     //     state.continuous_effects.push(ce);
//     // }
// }

/** 遅延誘発型能力の生成 */
// export class GeneratingDelayedTriggeredAbility extends Instruction {
//     // ability: DelayedTriggeredAbility;
//     // constructor(delayed_triggered_ability: DelayedTriggeredAbility) {
//     //     super();
//     //     this.ability = delayed_triggered_ability;
//     // }
//     // perform({ state, source }: PerformArgs): void {
//     //     state.delayed_triggered_abilities.push(this.ability.copy()); // 発生源
//     // }
// }

/** 置換効果の生成 */
// export class GeneratingReplacementEffect extends Instruction {
//     // replacement_effect: ReplacementEffect;
//     // constructor(replacement_effect: ReplacementEffect) {
//     //     super();
//     //     this.replacement_effect = replacement_effect;
//     // }
// }

/** 状況誘発のチェック。Instructionの子にしていい？ */
// export class CheckingStateTriggers extends Instruction {}

// キーワードでない処理 ********************************
/** 領域を移動させる */
export class MoveZone extends Instruction {
    /** 移動させるオブジェクトと、移動先領域の組。 */
    moving_specs: {
        /** 移動させるオブジェクト */
        moved: SingleSpec<GameObject>;
        /** 移動先の領域 */
        dest: SingleSpec<Zone>;
    }[];

    constructor(
        args: ConstructorParameters<typeof Instruction>[number] & {
            /** 移動指定の組 */
            specs: {
                /** 移動させるオブジェクト */
                moved: SingleSpec<GameObject>;
                /** 移動先の領域 */
                dest: SingleSpec<Zone>;
            }[];
        }
    ) {
        super(args);
        this.moving_specs = args.specs;
    }

    perform = (params: ReferenceParams) => {
        const new_state = params.state.deepcopy();
        const new_params = { ...params, state: new_state };
        // 各 spec について
        this.moving_specs.forEach((each_spec) => {
            // object_specを解決
            const obj = resolve_single(each_spec.moved, new_params);
            const zone = resolve_single(each_spec.dest, new_params);
            obj.zone = zone;
        });
        return new_state;
    };
}

/** カードを引く */
export class Drawing extends Instruction {
    number: number | ValueReference;

    constructor(number: number | ValueReference, player: Player) {
        super();
        this.number = number;
        this.performer = player;
    }

    perform(args: Required<ReferenceParams>): GameState {
        /** 「カードを1枚引く」をN個作る */
        const number_of_cards =
            typeof this.number === "number"
                ? this.number
                : this.number.execute(args);

        let instructions: Instruction[] = [];
        for (let i = 0; i < number_of_cards; i++) {
            instructions.push(
                new MoveZone(
                    [top_of_library(this.performer)],
                    args.state.get_zone("Hand", this.performer) // 領域をどうやってとる？
                )
            );
        }

        return Instruction.performArray(instructions, args);
    }
}
// 托鉢するものは置換処理の方で特別扱いする

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

    perform(args: Required<ReferenceParams>): GameState {
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
            // ダメージ処理。パーマネントはダメージ、プレイヤーはライフ減少
            // 絆魂 --> 回復Instruction
            // 最後の情報
            if (objs[0] instanceof Player) {
                // ライフ減少　感染は毒カウンター --> カウンター配置Instruction
            } else if (objs[0] instanceof GameObject) {
                // ダメージを負う　感染は-1/-1カウンター
            }
            return new_state;
        }
    }
}

/** ライフを得る */
export class GainingLife extends Instruction {
    specs: { player: MultiSpec<Player>; amount_spec: SingleSpec<number> }[];

    constructor(args: {
        instructor: SingleSpec<GameObject>;
        specs: {
            player: MultiSpec<Player>;
            amount_spec: SingleSpec<number>;
        }[];
    }) {
        super(args);
        this.specs = args.specs;
    }

    perform(params: Required<ReferenceParams>): GameState {
        const new_state = params.state.deepcopy();
        const new_params = { ...params, state: new_state };
        this.specs.forEach((each_spec) => {
            const player = resolve_multiple_spec<Player>(
                each_spec.player,
                new_params
            );
        });

        const am =
            this.amount_spec instanceof ValueReference
                ? this.amount_spec.execute(params)
                : this.amount_spec;
        if (this.perform instanceof Player) {
            const new_state = params.state.deepcopy();
            // new_stateのperformerどうやってとる？
            // (this.performer as Player).life += am;
            return new_state;
        } else {
            throw Error("player undefined");
        }
    }
}

/** カウンターを置く・得る */
// export class PuttingCounter extends Instruction {
//     counters: Counter[];

//     constructor(counters: Counter[]) {
//         super();
//         this.counters = counters;
//     }

//     perform(args: Required<ReferenceParams>): GameState {}
// }

/** 見る */
/** 束に分ける */
/** 値を選ぶ・宣言する */
// export class DeclaringValue extends Instruction {}

/** 裏向きにする・表向きにする */

// 唱える関連の処理 ********************************
/** 唱える */

/** 起動する */

/** 誘発する */
// export class Triggering extends Instruction {}

/** プレイする */

/** 呪文や能力を解決する */
// export class Resolving extends Instruction {}

/** 支払う */
// export class Paying extends Instruction {}

// キーワード処理 常盤木 *****************************************
/** タップ */
export class Tapping extends Instruction {
    refs_objects: MultiSpec<GameObject>[];
    performer?: MultiSpec<Player>;
    constructor(permanents: ObjectReference[], performer?: Player) {
        super();
        this.refs_objects = permanents;
        this.performer = performer;
    }

    perform(params: Required<ReferenceParams>): GameState {
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
// export class Untapping extends Instruction {
//     permanents: ValueReference[];
// }

/** 破壊する */
// export class Destroying extends Instruction {
//     refs_objects = [];
// }

/** 追放する */
export class Exile extends MoveZone {
    constructor(args: ConstructorParameters<typeof MoveZone>[number]) {
        super(args);
        this.moving_specs = this.moving_specs.map((spec) => ({
            moved: spec.moved,
            dest: new SingleRef<Zone>((param: { state: GameState }) =>
                param.state.get_zone(ZoneType.Exile)
            ),
        }));
    }
}

/** 生け贄に捧げる */
export class Sacrifice extends MoveZone {
    constructor(args: ConstructorParameters<typeof MoveZone>[number]) {
        super(args);
        this.moving_specs = this.moving_specs.map((spec) => ({
            moved: spec.moved,
            dest: (param) => param.state.get_zone(ZoneType.Graveyard),
        }));
    }
}

/** 探す */
// export class Searching extends Instruction {
//     searched_objects = [];
// }

/** 切り直す */
// export class Shuffling extends Instruction {}

/** 捨てる */
export class Discarding extends MoveZone {
    discarded_cards = [];
}

/** 公開する */
// export class Revealing extends Instruction {
//     revealed_objects = [];
// }

/** 打ち消す */
export class Countering extends MoveZone {}

/** 生成する */
// export class Creating extends Instruction {}

/** つける */
// export class Attaching extends Instruction {}
/** はずす */
// export class Unattaching extends Instruction {}
/** 格闘を行う */
// export class Fighting extends Instruction {}
/** 切削する */
export class Milling extends MoveZone {}
/** 占術を行う */
// export class Scrying extends Instruction {}
/** 倍にする */
// export class Doubling extends Instruction {}
/** 交換する */
// export class Exchanging extends Instruction {}

// キーワード処理 常盤木 *****************************************
/** 変身する */
// export class Transforming extends Instruction {}

/** 再生する */
// export class Regenerating extends Instruction {}

/** 諜報を行う */
// export class Surveiling extends Instruction {}

// ================================================
// function CastAsInstructionReplacer(
//     arg: Instruction | Instruction[] | InstructionReplacer
// ) {
//     if (typeof arg === "function") {
//         return arg;
//     } else if (Array.isArray(arg)) {
//         return () => arg;
//     } else {
//         return () => [arg];
//     }
// }
