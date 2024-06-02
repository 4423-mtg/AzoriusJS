"use strict";
import { GameHistory, GameState } from "./Game";
/** オブジェクトが持つ能力
 * 起動型能力、誘発型能力、呪文能力、常在型能力
 */

import { GameObject, InstructionChecker, Player } from "./GameObject";
import { Instruction } from "./Instruction";
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
    controller: Player;
    text: string;
}

/** 起動型能力 */
class ActivatedAbility extends Ability {
    costs: any[] = [];
    constraints: any[] = []; // 起動に関する制限  実行に関する制限は？=>発生源で記憶
    instructions: Instruction[];
    // resolve(game_state, game_history, source) {
    //     for (const ins of this.instructions) {
    //         ins.perform(game_state, game_history, this, source)
    //     }
    // }
    constructor() {
        super();
    }
}

/** 誘発型能力 */
class TriggeredAbility extends Ability {
    /** 誘発制限 */
    constraints: any[] = []; // TODO 「1回しか誘発しない」 「1回のみ行える」は効果？
    /** 効果 */
    instructions: Instruction[];

    constructor() {
        super();
    }
    /** イベントをチェックし、誘発判定を行う */
    check: InstructionChecker;
    /** 誘発 */
    trigger(instruction: Instruction[]): void {
        // TODO ALL
    }
}
/** 呪文能力 */
class SpellAbility extends Ability {
    /** 効果処理 */
    instructions: Instruction[];

    /** コンストラクタ。
     * Instruction間の任意の関係を呼び出し側で記述できるようにするため、関数を引数とする */
    constructor(initializer: () => Instruction[]) {
        super();
        this.instructions = initializer();
    }

    /** 効果処理の実行 */
    perform(
        game_state: GameState,
        game_history: GameHistory,
        spell: GameObject
    ) {
        this.instructions.perform(game_state, game_history, spell); // FIXME
    }
}

/** 常在型能力 */
class StaticAbility extends Ability {
    /** 効果。単一の能力が複数の継続的効果を持つこともある（キーワード能力など） */
    effects = []; // ContinuousEffect[]
}

/** キーワード能力 */
class KeywordAbility extends Ability {
    /** 能力名 */
    name: string;
    /** 含まれる能力 */ // TODO 起動型能力を含む複数の能力をもつキーワードってある？
    abilities: Ability[] = [];
}
