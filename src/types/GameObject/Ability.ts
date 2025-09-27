"use strict";
import { Game, GameState } from "./Game.js";
/** オブジェクトが持つ能力
 * 起動型能力、誘発型能力、呪文能力、常在型能力
 */

import {
    ContinuousEffect,
    GameObject,
    Player,
    StackedAbility,
} from "./GameObject.js";
import { Instruction } from "./Instruction.js";

export {
    Ability,
    ActivatedAbility,
    TriggeredAbility,
    DelayedTriggeredAbility,
    SpellAbility,
    StaticAbility,
    KeywordAbility,
};

// ==============================================================================

/** オブジェクトが持つ能力。スタックに乗る方ではない。 */
class Ability {
    static id = 0; // 能力オブジェクトID
    id: number; // 能力オブジェクトID。関連している能力などに
    text: string; // ルール文章
    source?: GameObject; // この能力の生成元

    constructor({ text }: { text: string }) {
        this.text = text;
        this.id = Ability.id;
        Ability.id += 1;
    }
}

// ==============================================================================
type Constraint = any; // FIXME

/** オブジェクトの起動型能力 */
class ActivatedAbility extends Ability {
    costs: Instruction[] = []; // 起動コスト
    instructions: Instruction[]; // 効果
    constraints?: Constraint[] = []; // 起動制限

    constructor(
        spec: ConstructorParameters<typeof Ability>[any] & {
            costs: Instruction[];
            effects: Instruction[];
            constraints?: Constraint[];
        }
    ) {
        super(spec);
        this.costs = spec.costs;
        this.instructions = spec.effects;
        this.constraints = spec.constraints;
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
/** オブジェクトの持つ誘発型能力 */
class TriggeredAbility extends Ability {
    #checker: InstructionChecker; // 誘発判定
    instructions: Instruction[]; // 効果
    constraints?: Constraint[] = []; // 誘発制限
    // NOTE:「1回しか誘発しない」は制限、「1回のみ行える」は効果？

    constructor(
        spec: ConstructorParameters<typeof Ability>[any] & {
            trigger_condition: InstructionChecker;
            effects: Instruction[] | ((event) => Instruction[]); // TODO
            // 誘発型能力は生成するときに誘発イベントの情報が必要では？
            constraints?: Constraint[];
        }
    ) {
        super(spec);
        this.#checker = spec.trigger_condition;
        if (Array.isArray(spec.effects)) {
            this.instructions = spec.effects;
        } else {
            this.instructions = spec.effects();
        }
        this.constraints = spec.constraints;
    }

    /** 誘発するかどうかを判定する */
    check(args: {
        /** 実行されたInstruction */
        instruction: Instruction;
        state: GameState;
        history: Game;
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
        history: Game;
        performer: GameObject | Player;
    }) {
        // if (this.check(args)) {
        //     this.trigger(Instruction);
        // }
    }
}

class DelayedTriggeredAbility extends TriggeredAbility {}

// ==============================================================================
/** オブジェクトの持つ呪文能力 */
class SpellAbility extends Ability {
    /** 効果処理 */
    instructions: Instruction[];

    /** コンストラクタ */
    constructor(
        spec: ConstructorParameters<typeof Ability>[any] & {
            /** 効果、または効果の初期化処理 */
            effects: Instruction[] | (() => Instruction[]);
        }
    ) {
        super(spec);
        if (Array.isArray(spec.effects)) {
            this.instructions = spec.effects;
        } else {
            this.instructions = spec.effects();
        }
    }

    /** 効果処理の実行 */
    perform(args: PerformArgs) {
        performInstructions(this.instructions, args);
    }
}

// ==============================================================================
/** オブジェクトの常在型能力 */
class StaticAbility extends Ability {
    /** 効果。単一の能力が複数の継続的効果を持つこともある（キーワード能力など） */
    effects: ContinuousEffect[] = [];

    constructor(spec: ConstructorParameters<typeof Ability>[any] & {}) {
        super(spec);
    }
}

// ==============================================================================
/** キーワード能力 */
// 起動型能力とそうでない能力を含むキーワード能力もある（レベル・クラス棒
// 起動型能力を２つ持つ能力もある（換装
class KeywordAbility extends Ability {
    name: string; // キーワード能力名
    abilities: Ability[] = []; // 構成する各能力

    constructor(args: { text: string; name: string; abilities: Ability[] }) {
        super(args);
        this.name = args.name;
        this.abilities = args.abilities;
    }
}
