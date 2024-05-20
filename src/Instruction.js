'use strict';
/** 効果やルールによってゲーム中に行われる指示。
 */

import {
    ObjectReference,
    PlayerReference,
    ValueReference,
} from "Reference.js"


/** 処理指示を表すクラス。効果やターン起因処理、状況起因処理などの行う指示
 * ゲーム中に実行されるときにInGameReferenceを通じて実際のゲーム内の情報を注入される
 */
class Instruction {
    id
    performer  // 指示を行うプレイヤー（またはゲーム）
    perform(game_state, game_history, self, source) {}
}

// システム処理 ************************************************
/** 継続的効果の生成 */
export class GeneratingContinuousEffect extends Instruction {}
/** 遅延誘発型能力の生成 */
export class GeneratingDelayedTriggeredAbility extends Instruction {}
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


// ゲーム的な行動 ***********************************************
/**カードを引く */
export class DrawInstruction extends Instruction {
    number_of_cards = new ValueReference() // 引いた枚数
    drawn_cards = [] // 引いたカード InGameObjectReference
    draw() {}
    perform() {
        this.draw()
    }
}
// TODO 托鉢するものは置換処理の方で特別扱いする

/** ダメージを与える */
export class DealDamageInstruction extends Instruction {
    dealt_objects = [] // ダメージを与えられたもの（クリーチャー、PW、バトル、プレイヤー）
    amount = new ValueReference() // ダメージ量
    source = new ObjectReference() // ダメージの発生源
}

// target

// キーワード処理 1日目 *****************************************
/** タップ */
export class Tapping extends Instruction {
    constructor({permanent}){
        this.tapped_permanents = permanent
    }
    permanents = []
}
/** アンタップ */
export class Untapping extends Instruction {
    untapped_permanents = []
}
/** 唱える */
export class Casting extends Instruction {
    casted_spells = []
    paid_costs = []
}
/** 起動する */
export class Activating extends Instruction {
    activated_abilities = []
}
/** プレイする */
export class Playing extends Instruction {
    played_objects = []
}
/** 捨てる */
export class Discarding extends Instruction {
    discarded_cards = []
}
/** 破壊する */
export class Destroying extends Instruction {
    destroyed_permanents = []
}
/** 追放する */
export class Exiling extends Instruction {
    exiled_objects = []
}
/** 生け贄に捧げる */
export class Sacrificing extends Instruction {
    sacrificed_permanents = []
}
/** 公開する */
export class Revealing extends Instruction {
    revealed_objects = []
}
/** 探す */
export class Searching extends Instruction {
    searched_objects = []
}
/** 切り直す */
export class Shuffling extends Instruction {
}

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

