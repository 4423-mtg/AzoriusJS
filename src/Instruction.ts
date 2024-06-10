"use strict";
/** 効果やルールによってゲーム中に行われる指示。
 */

import {
    ObjectReference,
    Reference as ValueReference,
    QueryFunc,
    QueryParam,
    top_of_library,
} from "./Reference";
import { GameHistory, GameState } from "./Game";
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
    instructor?: GameObject;
    /** 実際に実行するプレイヤー */
    performer?: Player;

    constructor() {
        this.id = Instruction.instance_count;
        Instruction.instance_count += 1;
    }

    /** Instructionの種別の判定 */
    isInstanceOf(x: any): boolean {
        return this instanceof x;
    }

    /** 指示を実行する */
    abstract perform(args: Required<QueryParam>): GameState;

    /** 複数の指示を順に実行する */
    static performArray(
        instructions: Instruction[],
        args: PerformArgs
    ): GameState {
        // TODO
        // 複数の連続処理を置換する効果の確認
        // 指示を１つ実行
        // 以下ループ
    }
}

// 抽象的な処理 ************************************************
/** 選択肢を選ぶ */
export class MakingChoice extends Instruction {
    instructions: Instruction[];

    constructor(instructions: Instruction[]) {
        super();
        this.instructions = instructions;
    }

    perform(args: Required<QueryParam>): GameState {
        const choice: number = Question(this.instructions); // FIXME
        return this.instructions[choice].perform(args);
    }
}

/** するかしないか選ぶ */
export class ChoosingToDo extends Instruction {
    instruction: Instruction;

    constructor(instruction: Instruction) {
        super();
        this.instruction = instruction;
    }

    perform(args: Required<QueryParam>): GameState {
        const b: Boolean = Question(); // FIXME
        if (b) {
            return this.instruction.perform(args); // あとで直すかも
        } else {
            return args.state;
        }
    }
}

/** 同時に行う */
export class DoingSimultaneously extends Instruction {
    // 任意のものが同時に行えるわけではない！
    // 別々のオブジェクトの、領域または位相の変更のみ
    // ・ゴブリンの溶接工 アーティファクトを生け贄にすると同時に、墓地のアーティファクトを戦場に戻す
    // ・砕ける波 タップクリーチャーをアンタップすると同時に、アンタップクリーチャーをタップする
    // ・時の砂 上と同じ
    // ・時空の満ち干 フェイズアウトをフェイズインと同時に、他のクリーチャーをフェイズアウト

    // 位相の変更
    // 領域の移動
    // 生け贄
    // フェイズアウト、フェイズイン

    perform(args: Required<QueryParam>): GameState {
        // TODO
    }
}

/** 何もしない */
export class DoingNothing extends Instruction {
    perform(args: Required<QueryParam>): GameState {
        return args.state;
    }
}

// ルール上の処理 ************************************************
/** 継続的効果の生成 */
export class GeneratingContinuousEffect extends Instruction {
    type: ContinousEffectType;
    effect: ContinuousEffect;

    constructor(continuous_effect: ContinuousEffect) {
        super();
        this.effect = continuous_effect;
    }

    perform(args: PerformArgs): void {}
}

// TODO 途中
/** 値を変更する効果の生成 */
export class GeneratingValueAlteringEffect extends Instruction {}

// OK
/** 手続きを変更する効果の生成 */
export class GeneratingProcessAlteringEffect extends Instruction {
    check: InstructionChecker;
    replace: InstructionReplacer;

    constructor(
        check: InstructionChecker,
        replace: Instruction | Instruction[] | InstructionReplacer
    ) {
        super();
        this.check = check;
        this.replace = CastAsInstructionReplacer(replace);
    }

    perform({ state }: PerformArgs) {
        const ce = new ProcessAlteringContinousEffect(this.check, this.replace);
        state.continuous_effects.push(ce);
    }
}

// OK
/** 処理を禁止する効果の生成 */
export class GeneratingProcessForbiddingEffect extends Instruction {
    check: InstructionChecker;

    constructor(check: InstructionChecker) {
        super();
        this.check = check;
    }

    perform({ state }: PerformArgs): void {
        const ce = new ProcessForbiddingContinousEffect(this.check);
        state.continuous_effects.push(ce);
    }
}

/** 遅延誘発型能力の生成 */
export class GeneratingDelayedTriggeredAbility extends Instruction {
    ability: DelayedTriggeredAbility;

    constructor(delayed_triggered_ability: DelayedTriggeredAbility) {
        super();
        this.ability = delayed_triggered_ability;
    }

    perform({ state, source }: PerformArgs): void {
        state.delayed_triggered_abilities.push(this.ability.copy()); // FIXME 発生源
    }
}

/** 置換効果の生成 */
export class GeneratingReplacementEffect extends Instruction {
    replacement_effect: ReplacementEffect;
    constructor(replacement_effect: ReplacementEffect) {
        super();
        this.replacement_effect = replacement_effect;
    }
}

/** 状況誘発のチェック。Instructionの子にしていい？ */
export class CheckingStateTriggers extends Instruction {}

// キーワードでない処理 ********************************
/** 領域を移動する */
export class MovingZone extends Instruction {
    objectrefs: ObjectReference[];
    dest: Zone;

    constructor(objectrefs: ObjectReference[] | QueryFunc[], dest: Zone) {
        super();
        if (objectrefs.every((ref) => ref instanceof ObjectReference)) {
            this.objectrefs = objectrefs as ObjectReference[];
        } else if (objectrefs.every((ref) => typeof ref === "function")) {
            this.objectrefs = (objectrefs as QueryFunc[]).map(
                (func: QueryFunc) => new ObjectReference(func)
            );
        }
        this.dest = dest;
    }

    perform(args: Required<QueryParam>): GameState {
        const new_state: GameState = args.state.copy(); // TODO state.copy()を実装する
        const objects = this.objectrefs.flatMap((ref) => ref.execute(args));
        objects.forEach((obj) => (obj.zone = this.dest));
        return new_state;
    }
}

/** カードを引く */
export class DrawInstruction extends Instruction {
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
                    args.state.getZone("Hand", this.performer) // TODO 領域をどうやってとる？
                )
            );
        }

        return Instruction.performArray(instructions, args);
    }
}
// TODO 托鉢するものは置換処理の方で特別扱いする

/** ダメージを与える */
export class DealDamageInstruction extends Instruction {
    dealt_objects = []; // ダメージを与えられたもの（クリーチャー、PW、バトル、プレイヤー）
    amount = new ValueReference(); // ダメージ量
    source = new ObjectReference(); // ダメージの発生源
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
/** タップ */
export class Tapping extends Instruction {
    permanents: ValueReference[];
    performer: Player | undefined;
    constructor(permanents: ValueReference[], performer?: Player) {
        super();
        this.permanents = permanents;
        this.performer = performer;
    }
}

/** アンタップ */
export class Untapping extends Instruction {
    permanents: ValueReference[];
}

/** 破壊する */
export class Destroying extends Instruction {
    destroyed_permanents = [];
}

/** 追放する */
export class Exiling extends Instruction {
    exiled_objects = [];
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
