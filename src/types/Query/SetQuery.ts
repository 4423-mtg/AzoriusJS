import { isCardType, type CardType } from "../Characteristics/CardType.js";
import {
    isCardName,
    isRuleText,
    type CardName,
    type RuleText,
} from "../Characteristics/Characteristic.js";
import { isColor, type Color } from "../Characteristics/Color.js";
import { isSubtype, type Subtype } from "../Characteristics/Subtype.js";
import { isSupertype, type Supertype } from "../Characteristics/Supertype.js";
import { isAbility, type Ability } from "../GameObject/Ability.js";
import { isCard, type Card } from "../GameObject/Card/Card.js";
import { isGameObject, type GameObject } from "../GameObject/GameObject.js";
import { isPlayer, type Player } from "../GameObject/Player.js";
import { isZone, type Zone } from "../GameState/Zone.js";
import type {
    AbilityConditionOperand,
    AbilityQueryOperand,
    CardConditionOperand,
    CardNameConditionOperand,
    CardNameQueryOperand,
    CardQueryOperand,
    CardTypeConditionOperand,
    CardTypeQueryOperand,
    ColorConditionOperand,
    ColorQueryOperand,
    GameObjectConditionOperand,
    GameObjectQueryOperand,
    PlayerConditionOperand,
    PlayerQueryOperand,
    SubtypeConditionOperand,
    SubtypeQueryOperand,
    SupertypeConditionOperand,
    SupertypeQueryOperand,
    TextConditionOperand,
    TextQueryOperand,
    ZoneConditionOperand,
    ZoneQueryOperand,
} from "./ArrayQuery/GameObjectQuery.js";
import {
    IntersectionOfQueryParameters,
    isBooleanOperation,
    type BooleanOperation,
    type QueryParameter,
} from "./Query.js";

// MARK: SetElementType
type _setElementTypeDefinition = {
    gameObject: GameObject;
    card: Card;
    player: Player;
    cardName: CardName;
    cardtype: CardType;
    subtype: Subtype;
    supertype: Supertype;
    color: Color;
    zone: Zone;
    ability: Ability;
    text: RuleText;
};

/** 集合の要素の型を表す文字列 */
export type SetElementTypeId = keyof _setElementTypeDefinition;
/** 集合の要素の型 */
export type SetElementType<T extends SetElementTypeId = SetElementTypeId> =
    _setElementTypeDefinition[T];

// =================================================================
// MARK: Condition
/** 指定した SetElementType に関する条件指定 */
export type SetElementCondition<
    T extends SetElementType,
    U extends QueryParameter,
> = {
    elementType: T;
    condition: BooleanOperation<SetElementConditionOperand<T, U>>;
};
/** 条件指定のオペランド */
export type SetElementConditionOperand<
    T extends SetElementType,
    U extends QueryParameter,
> = T extends GameObject
    ? GameObjectConditionOperand<U>
    : T extends Card
    ? CardConditionOperand<U>
    : T extends Player
    ? PlayerConditionOperand<U>
    : T extends CardName
    ? CardNameConditionOperand<U>
    : T extends CardType
    ? CardTypeConditionOperand<U>
    : T extends Subtype
    ? SubtypeConditionOperand<U>
    : T extends Supertype
    ? SupertypeConditionOperand<U>
    : T extends Color
    ? ColorConditionOperand<U>
    : T extends Zone
    ? ZoneConditionOperand<U>
    : T extends Ability
    ? AbilityConditionOperand<U>
    : T extends RuleText
    ? TextConditionOperand<U>
    : never;

// MARK: Query
/** 集合のクエリ */
export type SetQuery<T extends SetElementType, U extends QueryParameter> = {
    elementType: SetElementTypeId;
    query: SetOperation<SetQueryOperand<T, U>, U>;
};
/** 集合のクエリの１要素 */
export type SetQueryOperand<
    T extends SetElementType,
    U extends QueryParameter,
> = T extends GameObject
    ? GameObjectQueryOperand<U>
    : T extends Card
    ? CardQueryOperand<U>
    : T extends Player
    ? PlayerQueryOperand<U>
    : T extends CardName
    ? CardNameQueryOperand<U>
    : T extends CardType
    ? CardTypeQueryOperand<U>
    : T extends Subtype
    ? SubtypeQueryOperand<U>
    : T extends Supertype
    ? SupertypeQueryOperand<U>
    : T extends Color
    ? ColorQueryOperand<U>
    : T extends Zone
    ? ZoneQueryOperand<U>
    : T extends Ability
    ? AbilityQueryOperand<U>
    : T extends RuleText
    ? TextQueryOperand<U>
    : never;

export function getQueryParameterOfSetQueryOperand(
    operand: SetQueryOperand<SetElementType, QueryParameter>,
): QueryParameter {
    //
    return {};
}

export function getQueryParameterOfSetQuery<T extends SetElementType>(
    query: SetQuery<T, QueryParameter>,
): QueryParameter {
    return getQueryParameterOfSetOperation(query);
}

// =================================================================
// MARK: SetOperation
export type _Intersection<
    T extends SetQueryOperand<SetElementType, QueryParameter>, // QueryParameterは指定可能にすべき？
> = {
    operation: "intersection";
    operand: T[]; // TODO: ここの型チェックはどうするのか
};
// A & (B & C) = A & B & C ☑️
// A & (B + C) = (A & B) + (A & C) ☑️
// A & (B - C) = (A & B) - C
function getQueryParameterOfIntersection(
    intersection: _Intersection<
        SetQueryOperand<SetElementType, QueryParameter>
    >,
): QueryParameter {
    return IntersectionOfQueryParameters(
        intersection.operand.map((operand) =>
            getQueryParameterOfSetQueryOperand(operand),
        ),
    );
}

export type _Difference<
    T extends SetQueryOperand<SetElementType, QueryParameter>,
> = {
    operation: "difference";
    left: T | _Intersection<T>;
    right: T | _Intersection<T> | (T | _Intersection<T>)[]; // FIXME: leftとrightの関係
};
// A - (B + C) = (A - B) & (A - C)
// A - (B & C) = (A - B) + (A - C) ☑️
// A - (B - C) = (A - B) + (A & C) ☑️
// (A + B) - C = (A - C) + (B - C) ☑️
// (A & B) - C = (A - C) & (B - C)
// (A - B) - C = A - B - C ☑️
function getQueryParameterOfDifference<T extends SetElementType>(
    difference: _Difference<T>,
): QueryParameter {
    //
    return {};
}

// Union
// A + (B + C) = A + B + C
// A + (B & C)
// A + (B - C)

export type SetOperation<
    T extends SetQueryOperand<SetElementType, QueryParameter>,
> =
    | T
    | _Intersection<T>
    | _Difference<T>
    | (T | _Intersection<T> | _Difference<T>)[]; // unionとして解釈する

// FIXME: SetOperationだけでは戻り値の型がわからない。パラメータはSetQueryからしか取れない
// SetQueryからトップダウンにチェックすること
export function getQueryParameterOfSetOperation<T extends SetElementType>(
    query: SetQuery<T, QueryParameter>,
): QueryParameter {
    // TODO: queryが何を取るクエリか判別するのにtypeプロパティが要るかも
    return {};
}

// =========================================================
// MARK: 型ガード
function isRecord(arg: unknown): arg is Record<string, unknown> {
    return typeof arg === "object" && arg !== null;
}
export function isSetElementType(arg: unknown): arg is SetElementType {
    return (
        isGameObject(arg) ||
        isCard(arg) ||
        isPlayer(arg) ||
        isCardName(arg) ||
        isCardType(arg) ||
        isSubtype(arg) ||
        isSupertype(arg) ||
        isColor(arg) ||
        isZone(arg) ||
        isAbility(arg) ||
        isRuleText(arg)
    );
}

export function isSetElementCondition<T extends SetElementType>(
    // FIXME: Tはどうやって指定？
    arg: unknown,
): arg is SetElementCondition<T, QueryParameter> {
    return isBooleanOperation(arg) && arg;
}

export function isSetElementConditionOperand(
    arg: unknown,
): arg is SetElementConditionOperand<SetElementType, QueryParameter> {
    return false;
}

export function isSetQuery(
    arg: unknown,
): arg is SetQuery<SetElementType, QueryParameter> {
    return false;
}
export function isSetQueryOperand(
    arg: unknown,
): arg is SetQueryOperand<SetElementType, QueryParameter> {
    return false;
}

function isIntersection(arg: unknown): arg is _Intersection<SetElementType> {
    return (
        isRecord(arg) &&
        arg.operation === "intersection" &&
        isSetQueryOperand(arg.operand)
    );
}
function isDifference(
    arg: unknown,
): arg is _Difference<SetQueryOperand<SetElementType, QueryParameter>> {
    return false;
}

export function isSetOperation(
    arg: unknown,
): arg is SetOperation<SetQueryOperand<SetElementType, QueryParameter>> {
    return false;
}
