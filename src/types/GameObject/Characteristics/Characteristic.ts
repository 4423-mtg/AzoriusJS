"use strict";

import type { ManaSymbol } from "./Symbol.js";
import type { Color } from "./Color.js";
import type { CardType } from "./CardType.js";
import type { Subtype } from "./Subtype.js";
import type { Supertype } from "./Supertype.js";
import type { Ability } from "../Ability.js";

// CR 109.3 オブジェクトの特性とは、
// 名前、マナ・コスト、色、色指標、
// カード・タイプ、特殊タイプ、サブタイプ、ルール・テキスト、能力、
// パワー、タフネス、忠誠度、守備値、手札補正子、ライフ補正子のことである。

type Value = number | string | undefined;

/** 名前 */
export type ObjectName = string | undefined;
/** マナ・コスト */
export type ManaCost = ManaSymbol[];
/** ルール・テキスト */
export type RuleText = string | undefined;
/** パワー */
export type Power = Value;
/** タフネス */
export type Toughness = Value;
/** 忠誠度 */
export type Loyalty = Value;
/** 守備値 */
export type Defense = Value;
/** 手札補正子 */
export type HandModifier = Value;
/** ライフ補正子 */
export type LifeModifier = Value;

/** 特性 */
export type Characteristics = {
    name?: ObjectName | ObjectName[];
    mana_cost?: ManaSymbol[];
    colors?: Color[];
    card_types?: CardType[];
    subtypes?: Subtype[];
    supertypes?: Supertype[];
    text?: string;
    abilities?: Ability[];
    power?: Power;
    toughness?: Toughness;
    loyalty?: Loyalty;
    defense?: Defense;
    hand_modifier?: HandModifier;
    life_modifier?: LifeModifier;
};

/** コピー可能な値。
 * オブジェクトのコピー可能な値とは、オブジェクトに記載されている値
 * (名前、マナ・コスト、色指標、カード・タイプ、サブタイプ、特殊タイプ、ルール・テキスト、
 * パワー、タフネス、忠誠度)に、他のコピー効果、裏向きの位相であること、
 * パワーやタフネス(や、場合によってはその他の特性)を定める「戦場に出るに際し」「オモテになるに際し」の能力、
 * そのオブジェクトを裏向きにする能力による影響を加味したものである。
 */
export type CopiableValue = {
    name: ObjectName | ObjectName[] | undefined;
    mana_cost: ManaSymbol[];
    color_identity: Color[];
    card_types: CardType[];
    subtypes: Subtype[];
    supertypes: Supertype[];
    text: RuleText;
    power: Power;
    toughness: Toughness;
    loyalty: Loyalty;
};
