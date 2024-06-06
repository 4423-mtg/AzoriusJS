"use strict";
import { GameHistory, GameState } from "./Game";
/** オブジェクトが持つ能力
 * 起動型能力、誘発型能力、呪文能力、常在型能力
 */

import {
    ContinuousEffect,
    GameObject,
    InstructionChecker,
    Player,
    StackedAbility,
    StackedAbilityType,
} from "./GameObject";
import { Instruction, PerformArgs } from "./Instruction";
export {
    Ability,
    ActivatedAbility,
    TriggeredAbility,
    SpellAbility,
    StaticAbility,
    KeywordAbility,
};

/** オブジェクトが持っている能力。スタックに乗る方ではない。抽象クラス */
abstract class Ability {
    /** テキスト */
    text: string;

    constructor(args: { text: string }) {
        this.text = args.text;
    }
}

// ==============================================================================
type Constraint = any; // FIXME

/** 起動型能力 */
class ActivatedAbility extends Ability {
    /** 起動コスト */
    costs: Instruction[] = [];
    /** 効果 */
    instructions: Instruction[];
    /** 起動制限 */
    constraints?: Constraint[] = [];

    constructor(args: {
        text: string;
        costs: Instruction[];
        initializer: () => Instruction[];
        constraints?: Constraint[];
    }) {
        super(args);
        this.costs = args.costs;
        this.instructions = args.initializer();
        this.constraints = args.constraints;
    }

    /** 起動する */ // FIXME これはInstructionで実装する
    activate(state: GameState, controller: Player, source?: GameObject) {
        // TODO ALL 「唱える」とほぼ同じでは？
        // state.stack.push(
        //     new StackedAbility(
        //         StackedAbilityType.Activated,
        //         this,
        //         controller,
        //         source
        //     )
        // );
    }
}

// ==============================================================================
/** 誘発型能力 */
class TriggeredAbility extends Ability {
    /** 誘発判定処理 */
    #checker: InstructionChecker;
    /** 効果 */
    instructions: Instruction[];
    /** 誘発制限 */
    constraints?: Constraint[] = [];
    // 「1回しか誘発しない」は制限、「1回のみ行える」は効果？

    constructor(args: {
        text: string;
        checker: InstructionChecker;
        initializer: () => Instruction[];
        constraints?: Constraint[];
    }) {
        super(args);
        this.#checker = args.checker;
        this.instructions = args.initializer();
        this.constraints = args.constraints;
    }

    /** 誘発するかどうかを判定する */
    check(args: {
        /** 実行されたInstruction */
        instruction: Instruction;
        state: GameState;
        history: GameHistory;
        performer: GameObject | Player;
    }): boolean {
        return this.#checker(args); // TODO 誘発制限
        // アップキープの開始時（特定のタイミング）
        // ～とき、たび（イベント
        // - 通常はイベントの直後の状態を見る
        // - 戦場・墓地を離れる誘発は直前の状態を見る
        //   - 他に、公開から非公開に移動する・コントロールを失う・オブジェクトからはずれる・
        //     フェイズアウトする・なども
        // 既定の実装では直後を見るようにしておいて、領域変更は直前を見るように上書きする
        // 直前の状態は history から InstructionID で引っ張るようにする
        // TODO 遅延誘発型・再帰誘発型はどうする？
    }
    /** 誘発する */ // FIXME <-- これもInstruction！？
    trigger(
        instruction: Instruction,
        state: GameState,
        controller: Player,
        source?: GameObject
    ): void {
        // state.unstacked_abilities.push(
        //     new StackedAbility(
        //         StackedAbilityType.Triggered,
        //         this,
        //         controller,
        //         source
        //     )
        // );
    }
    check_and_trigger(args: {
        /** 実行されたInstruction */
        instruction: Instruction;
        state: GameState;
        history: GameHistory;
        performer: GameObject | Player;
    }) {
        // if (this.check(args)) {
        //     this.trigger(Instruction);
        // }
    }
}

// ==============================================================================
/** 呪文能力 */
class SpellAbility extends Ability {
    /** 効果処理 */
    instructions: Instruction[];

    /** コンストラクタ。
     * Instruction間の任意の関係を呼び出し側で記述できるようにするため、関数を引数にとる */
    constructor(args: { text: string; initializer: () => Instruction[] }) {
        super(args);
        this.instructions = args.initializer();
    }

    /** 効果処理の実行 */
    perform(args: PerformArgs) {
        Instruction.performArray(this.instructions, args);
    }
}

// ==============================================================================
/** 常在型能力 */
class StaticAbility extends Ability {
    /** 効果。単一の能力が複数の継続的効果を持つこともある（キーワード能力など） */
    effects: ContinuousEffect[] = [];
}

// ==============================================================================
/** キーワード能力 */
class KeywordAbility extends Ability {
    /** 修飾語などを除いた、キーワード能力名。能力のテキスト全体は`text`。 */
    name: string;
    /** 含まれる能力 */ // TODO 起動型能力を含む複数の能力をもつキーワードってある？
    abilities: Ability[] = [];

    constructor(args: { text: string; name: string; abilities: Ability[] }) {
        super(args);
        this.name = args.name;
        this.abilities = args.abilities;
    }
}
