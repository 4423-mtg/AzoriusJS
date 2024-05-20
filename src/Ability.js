'use strict';
/** オブジェクトが持つ能力
 * 起動型能力、誘発型能力、呪文能力、常在型能力
 */

import * as main from "main.js"
export {
    ActivatedAbility,
    TriggeredAbility,
    SpellAbility,
    StaticAbility,
}


/** オブジェクトが持っている能力。スタックに乗る方ではない
 */
class Ability {
    controller
    text
}

/** 起動型能力 */
class ActivatedAbility extends Ability {
    costs = []
    constraints = []  // 起動に関する制限  実行に関する制限は？=>発生源で記憶
    instructions = []
    // resolve(game_state, game_history, source) {
    //     for (const ins of this.instructions) {
    //         ins.perform(game_state, game_history, this, source)
    //     }
    // }
}
/** 誘発型能力 */
class TriggeredAbility extends Ability {
    // TODO 誘発イベント
    constraints = []
    instructions = []
    // resolve(game_state, game_history, source) {
    //     for (const ins of this.instructions) {
    //         ins.perform(game_state, game_history, this, source)
    //     }
    // }
}
/** 呪文能力 */
class SpellAbility extends Ability {
    instructions = []
    constructor(instructions_initializer) {
        this.instructions = instructions_initializer()
    }
    perform(game_state, game_history, spell) {
        for (const ins of this.instructions) {
            ins.perform(game_state, game_history, spell, undefined)
        }
    }
}

/** 常在型能力 */
class StaticAbility extends Ability {
    effects = []  // ContinuousEffect[]
}


