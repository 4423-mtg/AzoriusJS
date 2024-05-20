'use strict';

import { SpellAbility } from "./Ability";

/** ゲーム内のオブジェクト
 * カード、スタック上の能力、継続的効果、遅延誘発型能力、置換効果
 */
export {
    GameObject,
    Card,
    StackedAbility,
    ContinuousEffect,
    DelayedTriggeredAbility,
    ReplacementEffect,
}


/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
// TODO
// - オブジェクト
//   - カード
//   - スタック上の能力
//   - 継続的効果
//   - 遅延誘発型能力
class GameObject {
    id
    zone
    owner
    controller

    // ----スタック上で取る特性----
    chosen_mode
    x
    target
    distributing
    paid_cost
    // どんな効果によって唱えたかは記憶する？
    alternative_cost  // 支払った追加コスト

}


/** カード */
class Card extends GameObject {
    constructor(characteristics) {
        if (Array.isArray(characteristics)) {
            this.characteristics_sets = characteristics
        } else {
            this.characteristics_sets.push(characteristics)
        }
    }
    // ====印刷されている値 ====
    /** 印刷されている特性の組（分割や出来事などを含む） */
    characteristics_sets = []
    /** レイアウト */  // TODO 必要？
    layout
    /** その時取っている特性組 */
    get characteristics() { return this.characteristics_sets[0] } // FIXME

    // ==== ゲーム中に取る値 ====
    /** 位相 */
    status
    /** トークンやコピーであるか */
    is_copy
    /** 乗っているカウンター */
    counters
    /** 貼られているステッカー */
    stickers
    /** クラスエンチャントのレベル。LvUpカードはLvカウンターなので関係ない */
    level
    // ----マーカー類----
    /** 怪物的 */
    is_monstrous
    is_renowned
    is_goaded
    is_suspected

    // 解決
    resolve_as_spell(game_state, game_history) {
        for (const spell_ability of this.characteristics.abilities.filter(
                a => a instanceof SpellAbility
            )) {
            spell_ability.perform(game_state, game_history, this)
        }
    }
}

/** スタック上の能力 */
class StackedAbility extends GameObject {
    /** 能力の発生源 */
    source
}

/** 継続的効果 */
class ContinuousEffect extends GameObject {
    continuous_effect = undefined
    // 1. 期間
    // 2. 影響を及ぼすオブジェクト
}

/** 遅延誘発型能力 */
class DelayedTriggeredAbility extends GameObject {
    ability = undefined
}

/** 置換効果 */
class ReplacementEffect extends ContinuousEffect {}

/** 特性 */
class Characteristics {
    constructor({
        name,
        mana_cost,
        color_indicator,
        card_types,
        subtypes,
        supertypes,
        abilities,
        text,
        power,
        toughness,
        loyalty,
        defense,
        hand_modifier,
        life_modifier,
    }) {
        this.name = name
        this.mana_cost = mana_cost
        this.color_indicator = color_indicator
        this.card_types = card_types
        this.subtypes = subtypes
        this.supertypes = supertypes
        this.abilities = abilities
        this.text = text
        this.power = power
        this.toughness = toughness
        this.loyalty = loyalty
        this.defense = defense
        this.hand_modifier = hand_modifier
        this.life_modifier = life_modifier
    }
    name
    mana_cost
    color_indicator
    card_types
    subtypes
    supertypes
    abilities
    text
    power
    toughness
    loyalty
    defense
    hand_modifier
    life_modifier
}

/** 位相 */
class Status {
    tapped
    flipped
    is_face_down
    is_phase_out
}

/** プレイヤー */
class Player {
    id;
    name;
}
