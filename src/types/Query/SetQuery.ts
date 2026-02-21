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
import {
    getQueryParameterOfAbilityQueryOperand,
    isAbilityQueryOperand,
    type AbilityConditionOperand,
    type AbilityQueryOperand,
} from "./SetQuery/AbilityQuery.js";
import {
    getQueryParameterOfCardNameQueryOperand,
    isCardNameQueryOperand,
    type CardNameConditionOperand,
    type CardNameQueryOperand,
} from "./SetQuery/CardNameQuery.js";
import {
    getQueryParameterOfCardQueryOperand,
    isCardQueryOperand,
    type CardConditionOperand,
    type CardQueryOperand,
} from "./SetQuery/CardQuery.js";
import {
    getQueryParameterOfCardTypeQueryOperand,
    isCardTypeQueryOperand,
    type CardTypeConditionOperand,
    type CardTypeQueryOperand,
} from "./SetQuery/CardTypeQuery.js";
import {
    getQueryParameterOfColorQueryOperand,
    isColorQueryOperand,
    type ColorConditionOperand,
    type ColorQueryOperand,
} from "./SetQuery/ColorQuery.js";
import {
    getQueryParameterOfGameObjectQueryOperand,
    isGameObjectQueryOperand,
    type GameObjectConditionOperand,
    type GameObjectQueryOperand,
} from "./SetQuery/GameObjectQuery.js";
import {
    getQueryParameterOfPlayerQueryOperand,
    isPlayerQueryOperand,
    type PlayerConditionOperand,
    type PlayerQueryOperand,
} from "./SetQuery/PlayerQuery.js";
import {
    getQueryParameterOfTextQueryOperand,
    isTextQueryOperand,
    type TextConditionOperand,
    type TextQueryOperand,
} from "./SetQuery/RuleTextQuery.js";
import {
    getQueryParameterOfSubtypeQueryOperand,
    isSubtypeQueryOperand,
    type SubtypeConditionOperand,
    type SubtypeQueryOperand,
} from "./SetQuery/SubtypeQuery.js";
import {
    getQueryParameterOfSupertypeQueryOperand,
    isSupertypeQueryOperand,
    type SupertypeConditionOperand,
    type SupertypeQueryOperand,
} from "./SetQuery/SupertypeQuery.js";
import {
    getQueryParameterOfZoneQueryOperand,
    isZoneQueryOperand,
    type ZoneConditionOperand,
    type ZoneQueryOperand,
} from "./SetQuery/ZoneQuery.js";
import {
    IntersectionOfQueryParameters,
    isBooleanOperation,
    type BooleanOperation,
    type QueryParameter,
} from "./Query.js";

// =================================================================
// MARK: SetElementType
// =================================================================

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
    ruleText: RuleText;
};

/** 集合の要素の型を表す文字列 */
export type SetElementTypeId = keyof _setElementTypeDefinition;
/** 集合の要素の型 */
export type SetElementType<T extends SetElementTypeId = SetElementTypeId> =
    _setElementTypeDefinition[T];

export function isSetElementTypeId(arg: unknown): arg is SetElementTypeId {
    return false;
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

// =================================================================
// MARK: Condition
// =================================================================

// TODO: SetElementCondition を通常のConditionと区別する必要はあるのだろうか？
// 受け取って処理する側を書くときに必要になるかもしれない。
/** 指定した SetElementType に関する条件指定。
 * 条件を満たすものすべてを取ってくるのに使う */
export type SetElementCondition<
    T extends SetElementType,
    U extends QueryParameter,
> = {
    elementType: T; // FIXME: SetElementTypeId of T
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

// =================================================================
// MARK: Query
// =================================================================

/** 集合のクエリ */
export type SetQuery<T extends SetElementType, U extends QueryParameter> = {
    elementType: SetElementTypeId;
    query: SetOperation<SetQueryOperand<T, U>>;
};

export function getQueryParameterOfSetQuery(
    setQuery: SetQuery<SetElementType, QueryParameter>,
): QueryParameter {
    return getQueryParameterOfSetOperation(setQuery.query);
}
export function isSetQuery(
    arg: unknown,
): arg is SetQuery<SetElementType, QueryParameter> {
    return (
        isObject(arg) &&
        "elementType" in arg &&
        isSetElementTypeId(arg.elementType) &&
        "query" in arg &&
        isSetOperation(arg.query)
    );
}

// =================================================================
// MARK: SetOperation
// =================================================================
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
    if (isGameObjectQueryOperand(operand)) {
        return getQueryParameterOfGameObjectQueryOperand(operand);
    } else if (isCardQueryOperand(operand)) {
        return getQueryParameterOfCardQueryOperand(operand);
    } else if (isPlayerQueryOperand(operand)) {
        return getQueryParameterOfPlayerQueryOperand(operand);
    } else if (isCardNameQueryOperand(operand)) {
        return getQueryParameterOfCardNameQueryOperand(operand);
    } else if (isCardTypeQueryOperand(operand)) {
        return getQueryParameterOfCardTypeQueryOperand(operand);
    } else if (isSubtypeQueryOperand(operand)) {
        return getQueryParameterOfSubtypeQueryOperand(operand);
    } else if (isSupertypeQueryOperand(operand)) {
        return getQueryParameterOfSupertypeQueryOperand(operand);
    } else if (isColorQueryOperand(operand)) {
        return getQueryParameterOfColorQueryOperand(operand);
    } else if (isZoneQueryOperand(operand)) {
        return getQueryParameterOfZoneQueryOperand(operand);
    } else if (isAbilityQueryOperand(operand)) {
        return getQueryParameterOfAbilityQueryOperand(operand);
    } else if (isTextQueryOperand(operand)) {
        return getQueryParameterOfTextQueryOperand(operand);
    } else {
        throw new Error(operand);
    }
}

/** 共通部分 */
export type _Intersection<
    T extends SetQueryOperand<SetElementType, QueryParameter>, // QueryParameterは指定可能にすべき？
> = {
    operation: "intersection";
    operand: T[];
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

/** 差集合 */
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
function getQueryParameterOfDifference(
    difference: _Difference<SetQueryOperand<SetElementType, QueryParameter>>,
): QueryParameter {
    const qp_left = isIntersection(difference.left)
        ? getQueryParameterOfIntersection(difference.left)
        : getQueryParameterOfSetQueryOperand(difference.left);
    const qp_right = isSetQueryOperand(difference.right)
        ? getQueryParameterOfSetQueryOperand(difference.right)
        : isIntersection(difference.right)
        ? getQueryParameterOfIntersection(difference.right)
        : difference.right.map((op) =>
              isSetQueryOperand(op)
                  ? getQueryParameterOfSetQueryOperand(op)
                  : getQueryParameterOfIntersection(op),
          );
    return IntersectionOfQueryParameters(
        Array.isArray(qp_right) ? [qp_left, ...qp_right] : [qp_left, qp_right],
    );
}

// Union
// A + (B + C) = A + B + C
// A + (B & C)
// A + (B - C)

/** 集合演算 */
export type SetOperation<
    T extends SetQueryOperand<SetElementType, QueryParameter>,
> =
    | T
    | _Intersection<T>
    | _Difference<T>
    | (T | _Intersection<T> | _Difference<T>)[]; // unionとして解釈する

export function getQueryParameterOfSetOperation(
    operation: SetOperation<SetQueryOperand<SetElementType, QueryParameter>>,
): QueryParameter {
    if (isSetQueryOperand(operation)) {
        return getQueryParameterOfSetQueryOperand(operation);
    } else if (isIntersection(operation)) {
        return getQueryParameterOfIntersection(operation);
    } else if (isDifference(operation)) {
        return getQueryParameterOfDifference(operation);
    } else {
        return IntersectionOfQueryParameters(
            operation.map((op) =>
                isSetQueryOperand(op)
                    ? getQueryParameterOfSetQueryOperand(op)
                    : isIntersection(op)
                    ? getQueryParameterOfIntersection(op)
                    : isDifference(op)
                    ? getQueryParameterOfDifference(op)
                    : {},
            ),
        );
    }
}

export function isSetQueryOperand(
    arg: unknown,
): arg is SetQueryOperand<SetElementType, QueryParameter> {
    return false;
}

function isIntersection(
    arg: unknown,
): arg is _Intersection<SetQueryOperand<SetElementType, QueryParameter>> {
    return (
        isObject(arg) &&
        "operation" in arg &&
        arg.operation === "intersection" &&
        "operand" in arg &&
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

// =================================================================
function isObject(arg: unknown): arg is object {
    return typeof arg === "object" && arg !== null;
}
