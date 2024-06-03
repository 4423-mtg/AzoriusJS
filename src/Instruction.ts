"use strict";
/** 効果やルールによってゲーム中に行われる指示。
 */

import { Reference } from "./Reference";
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
} from "./GameObject";

/** `Instruction`の実行関数`perform()`の引数 */
export type PerformArgs = {
    state: GameState;
    history: GameHistory;
    self: any;
    source: any;
};

/** 処理指示を表すクラス。効果やターン起因処理、状況起因処理などの行う指示
 * ゲーム中に実行されるときに`Reference`を通じて実際のゲーム内の情報を注入される
 */
export abstract class Instruction {
    /** 指示を実行するプレイヤー（あるいはゲーム） */
    performer: Player | undefined;

    constructor(performer?: Player) {
        this.performer = performer;
    }

    isInstanceOf(x: any): boolean {
        return this instanceof x;
    }

    /** 指示を実行する */
    abstract perform(args: PerformArgs): void;
    /** 複数の指示を順に実行する */
    static performArray(instructions: Instruction[], args: PerformArgs) {
        // TODO
        // 複数の連続処理を置換する効果の確認
        // 指示を１つ実行
    }
}
// カードを引く：
//   -

// export class InstructionArray {
//     /** 指示 */
//     instructions: Instruction[];

//     /** コンストラクタ */
//     constructor(instructions: Instruction[]) {
//         this.instructions = instructions;
//     }

//     /** 指示の実行 */
//     perform(gamestate: GameState, game_history: GameHistory, self: any): void {
//         /** instruction列全体のチェック */
//         for (const ce of gamestate.continuous_effects) {
//         }
//         /** 各instructionを順に実行 */

//         /**     各instruction単体のチェック */
//     }
// }

// システム処理 ************************************************
/** 継続的効果の生成 */
export class GeneratingContinuousEffect extends Instruction {
    type: ContinousEffectType;
    effect: ContinuousEffect;

    constructor(continuous_effect: ContinuousEffect) {
        super();
        this.effect = continuous_effect;
    }
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

/** 呪文や能力の解決。
 * 解決というイベントを参照する効果用で、これ自体を解決中の指示として使うものではない
 * */
export class Resolving extends Instruction {}
/** 支払う */
export class Paying extends Instruction {}
/** 状況誘発のチェック。Instructionの子にしていい？ */
export class CheckingStateTriggers extends Instruction {}
/** 値を選ぶ */
export class ChoosingValue extends Instruction {}
/** 選択肢を選ぶ */
export class Selecting extends Instruction {}

/** 同時に行う */
export class PerformSimultaneously extends Instruction {
    instructions = [];
}

/** 何もしない */
export class VoidInstruction extends Instruction {
    perform(args: PerformArgs): void {}
}

// ゲーム的な行動で、キーワードでないもの ***********************************************
/**カードを引く */
export class DrawInstruction extends Instruction {
    number_of_cards = new ValueReference(); // 引いた枚数
    drawn_cards = []; // 引いたカード InGameObjectReference
    draw() {}
    perform() {
        this.draw();
    }
}
// TODO 托鉢するものは置換処理の方で特別扱いする

/** ダメージを与える */
export class DealDamageInstruction extends Instruction {
    dealt_objects = []; // ダメージを与えられたもの（クリーチャー、PW、バトル、プレイヤー）
    amount = new ValueReference(); // ダメージ量
    source = new ObjectReference(); // ダメージの発生源
}

// target

// キーワード処理 1日目 *****************************************
/** タップ */
export class Tapping extends Instruction {
    permanents: Reference[];
    performer: Player | undefined;
    constructor(permanents: Reference[], performer?: Player) {
        super();
        this.permanents = permanents;
        this.performer = performer;
    }
}
/** アンタップ */
export class Untapping extends Instruction {
    permanents: Reference[];
}
/** 唱える */
export class Casting extends Instruction {
    casted_spells = [];
    paid_costs = [];
}
/** 起動する */
export class Activating extends Instruction {
    activated_abilities = [];
}
/** プレイする */
export class Playing extends Instruction {
    played_objects = [];
}
/** 捨てる */
export class Discarding extends Instruction {
    discarded_cards = [];
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
/** 公開する */
export class Revealing extends Instruction {
    revealed_objects = [];
}
/** 探す */
export class Searching extends Instruction {
    searched_objects = [];
}
/** 切り直す */
export class Shuffling extends Instruction {}

// キーワード処理 2日目
export class Countering extends Instruction {}
export class Attaching extends Instruction {}
export class Unattaching extends Instruction {}
export class Creating extends Instruction {}
export class Doubling extends Instruction {}
export class Exchanging extends Instruction {}
export class Fighting extends Instruction {}
export class Scrying extends Instruction {}
export class Milling extends Instruction {}

// キーワード処理 3日目
export class Transforming extends Instruction {}

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
