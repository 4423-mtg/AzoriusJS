import type { ManaSymbol } from "./Symbol.js";
import type { Color } from "./Color.js";
import type { CardType } from "./CardType.js";
import type { Subtype } from "./Subtype.js";
import type { Supertype } from "./Supertype.js";
import type { Ability } from "../GameObject/Ability.js";
import type { MultiSpec } from "../Query/QueryFunction.js";

// CR 109.3 オブジェクトの特性とは、
// 名前、マナ・コスト、色、色指標、
// カード・タイプ、特殊タイプ、サブタイプ、ルール・テキスト、能力、
// パワー、タフネス、忠誠度、守備値、手札補正子、ライフ補正子のことである。

export type NumericalValue = number | "*";

/** 名前 */
export type CardName = string;
/** マナ・コスト */
export type ManaCost = ManaSymbol[];
/** ルール・テキスト */
export type RuleText = string;
/** パワー */
export type Power = NumericalValue;
/** タフネス */
export type Toughness = NumericalValue;
/** 忠誠度 */
export type Loyalty = NumericalValue;
/** 守備値 */
export type Defense = NumericalValue;
/** 手札補正子 */
export type HandModifier = NumericalValue;
/** ライフ補正子 */
export type LifeModifier = NumericalValue;

export type Printed = {
    name?: CardName;
    manaCost?: ManaSymbol[];
    colorIdentity?: Color[];
    cardType?: CardType[];
    subtype?: Subtype[];
    supertypes?: Supertype[];
    text?: string;
    power?: Power;
    toughness?: Toughness;
    loyalty?: Loyalty;
    defense?: Defense;
    hand_modifier?: HandModifier;
    life_modifier?: LifeModifier;
};

/** 特性 */
export type Characteristics = {
    name: CardName | CardName[] | undefined;
    mana_cost: ManaSymbol[] | undefined;
    colors: Color[] | undefined;
    card_types: CardType[] | undefined;
    subtypes: Subtype[] | undefined;
    supertypes: Supertype[] | undefined;
    text: string | undefined;
    abilities: Ability[] | undefined;
    power: Power | undefined;
    toughness: Toughness | undefined;
    loyalty: Loyalty | undefined;
    defense: Defense | undefined;
    hand_modifier: HandModifier | undefined;
    life_modifier: LifeModifier | undefined;
};

/** コピー可能な値。
 * オブジェクトのコピー可能な値とは、オブジェクトに記載されている値
 * (名前、マナ・コスト、色指標、カード・タイプ、サブタイプ、特殊タイプ、ルール・テキスト、
 * パワー、タフネス、忠誠度)に、他のコピー効果、裏向きの位相であること、
 * パワーやタフネス(や、場合によってはその他の特性)を定める「戦場に出るに際し」「オモテになるに際し」の能力、
 * そのオブジェクトを裏向きにする能力による影響を加味したものである。
 */
export type CopiableValue = {
    name: CardName | CardName[];
    manaCost: ManaSymbol[];
    colorIdentity: Color[];
    cardTypes: CardType[];
    subtypes: Subtype[];
    supertypes: Supertype[];
    text: RuleText;
    power: Power;
    toughness: Toughness;
    loyalty: Loyalty;
    // TODO: 守備値
};

/** カードタイプ・サブタイプ・特殊タイプの組。`undefined`のこともある。 */
export type CardTypeSet = {
    cardType: MultiSpec<CardType> | undefined;
    subtype: MultiSpec<Subtype> | undefined;
    supertype: MultiSpec<Supertype> | undefined;
};

/**  */
export function hasCardType(
    chara: Characteristics,
    cardType: CardType,
): boolean {
    return chara.card_types?.includes(cardType) ?? false;
}

/** */
export function hasSupertype(
    chara: Characteristics,
    supertype: Supertype,
): boolean {
    return chara.supertypes?.includes(supertype) ?? false;
}

/** 基本土地であるなら `true` 。 */
export function isBasicLand(chara: Characteristics): boolean {
    return hasCardType(chara, "Land") && hasSupertype(chara, "Basic");
}

/** 基本でない土地であるなら `true` 。 */
export function isNonbasicLand(chara: Characteristics): boolean {
    return hasCardType(chara, "Land") && !hasSupertype(chara, "Basic");
}
