import type { CardType } from "../../Characteristics/CardType.js";
import type {
    CardName,
    Characteristics,
    ManaCost,
    NumericalValue,
    RuleText,
} from "../../Characteristics/Characteristic.js";
import type { Color } from "../../Characteristics/Color.js";
import type { Subtype } from "../../Characteristics/Subtype.js";
import type { Supertype } from "../../Characteristics/Supertype.js";
import type { Ability } from "../../GameObject/Ability.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { Condition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { ScalarCondition } from "../ScalarQuery.js";
import type { SetElementCondition, SetQuery } from "../SetQuery.js";

/** 特性の条件 */
export type CharacteristicsConditionOperand<T extends QueryParameter> = {
    name?: SetElementCondition<CardName, T>;
    manaCost?: ScalarCondition<ManaCost, T>;
    color?: SetElementCondition<Color, T>;
    cardType?: SetElementCondition<CardType, T>;
    subtype?: SetElementCondition<Subtype, T>;
    supertype?: SetElementCondition<Supertype, T>;
    text?: SetElementCondition<RuleText, T>; // FIXME:
    ability?: SetElementCondition<Ability, T>; // FIXME:
    power?: ScalarCondition<NumericalValue, T>;
    toughness?: ScalarCondition<NumericalValue, T>;
    loyalty?: ScalarCondition<NumericalValue, T>;
    defense?: ScalarCondition<NumericalValue, T>;
    handModifier?: ScalarCondition<NumericalValue, T>;
    lifeModifier?: ScalarCondition<NumericalValue, T>;
};

/** 特性のクエリ */
export type CharacteristicsQueryOperand<T extends QueryParameter> =
    | Characteristics
    | { card: SetQuery<Card, T> } // FIXME: oneOf? merge?
    | Condition<Characteristics, T>;

// ===================================================================
export function getQueryParameterOfCharacteristicsConditionOperand(
    query: CharacteristicsConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isCharacteristicsConditionOperand(
    arg: unknown,
): arg is CharacteristicsConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isCharacteristicsQueryOperand(
    arg: unknown,
): arg is CharacteristicsQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
