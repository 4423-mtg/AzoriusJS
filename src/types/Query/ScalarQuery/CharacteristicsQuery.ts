import type { Characteristics } from "../../Characteristics/Characteristic.js";
import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { AbilityCondition } from "../SetQuery/AbilityQuery.js";
import type { CardNameCondition } from "../SetQuery/CardNameQuery.js";
import type { CardQuery } from "../SetQuery/CardQuery.js";
import type { CardTypeCondition } from "../SetQuery/CardTypeQuery.js";
import type { ColorCondition } from "../SetQuery/ColorQuery.js";
import type { RuleTextCondition } from "../SetQuery/RuleTextQuery.js";
import type { SubtypeCondition } from "../SetQuery/SubtypeQuery.js";
import type { SupertypeCondition } from "../SetQuery/SupertypeQuery.js";
import type { ManaCostCondition } from "./ManaCostQuery.js";
import type { NumericalValueCondition } from "./NumericalValueQuery.js";

// ===================================================================
/** 特性の条件 */
export type CharacteristicsCondition<T extends QueryParameter> =
    BooleanOperation<CharacteristicsConditionOperand<T>>;

export type CharacteristicsConditionOperand<T extends QueryParameter> = {
    name?: CardNameCondition<T>;
    manaCost?: ManaCostCondition<T>;
    color?: ColorCondition<T>;
    cardType?: CardTypeCondition<T>;
    subtype?: SubtypeCondition<T>;
    supertype?: SupertypeCondition<T>;
    text?: RuleTextCondition<T>; // FIXME:
    ability?: AbilityCondition<T>; // FIXME:
    power?: NumericalValueCondition<T>;
    toughness?: NumericalValueCondition<T>;
    loyalty?: NumericalValueCondition<T>;
    defense?: NumericalValueCondition<T>;
    handModifier?: NumericalValueCondition<T>;
    lifeModifier?: NumericalValueCondition<T>;
};

export function isCharacteristicsCondition(
    arg: unknown,
): arg is CharacteristicsCondition<QueryParameter> {
    // TODO:
    return false;
}
export function isCharacteristicsConditionOperand(
    arg: unknown,
): arg is CharacteristicsConditionOperand<QueryParameter> {
    // TODO:
    return false;
}

// ===================================================================
/** 特性のクエリ */
export type CharacteristicsQuery<T extends QueryParameter> =
    CharacteristicsQueryOperand<T>;

export type CharacteristicsQueryOperand<T extends QueryParameter> =
    | Characteristics
    | { card: CardQuery<T> } // FIXME: oneOf? merge?
    | CharacteristicsCondition<T>;

export function isCharacteristicsQuery(
    arg: unknown,
): arg is CharacteristicsQuery<QueryParameter> {
    // TODO:
    return false;
}
export function isCharacteristicsQueryOperand(
    arg: unknown,
): arg is CharacteristicsQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// ===================================================================
export function getQueryParameterOfCharacteristicsConditionOperand(
    query: CharacteristicsConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

export function getQueryParameterOfCharacteristicsQueryOperand(
    query: CharacteristicsQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
