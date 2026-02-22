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
import {
    isCard,
    isFace,
    type Card,
    type Face,
} from "../GameObject/Card/Card.js";
import { isGameObject, type GameObject } from "../GameObject/GameObject.js";
import { isPlayer, type Player } from "../GameObject/Player.js";
import { isZone, type Zone } from "../GameState/Zone.js";
import {
    getQueryParameterOfAbilityQueryOperand,
    isAbilityQueryOperand,
    type AbilityQueryOperand,
} from "./SetQuery/AbilityQuery.js";
import {
    getQueryParameterOfCardNameQueryOperand,
    isCardNameQueryOperand,
    type CardNameQueryOperand,
} from "./SetQuery/CardNameQuery.js";
import {
    getQueryParameterOfCardQueryOperand,
    isCardQueryOperand,
    type CardQueryOperand,
} from "./SetQuery/CardQuery.js";
import {
    getQueryParameterOfCardTypeQueryOperand,
    isCardTypeQueryOperand,
    type CardTypeQueryOperand,
} from "./SetQuery/CardTypeQuery.js";
import {
    getQueryParameterOfColorQueryOperand,
    isColorQueryOperand,
    type ColorQueryOperand,
} from "./SetQuery/ColorQuery.js";
import {
    getQueryParameterOfGameObjectQueryOperand,
    isGameObjectQueryOperand,
    type GameObjectQueryOperand,
} from "./SetQuery/GameObjectQuery.js";
import {
    getQueryParameterOfPlayerQueryOperand,
    isPlayerQueryOperand,
    type PlayerQueryOperand,
} from "./SetQuery/PlayerQuery.js";
import {
    getQueryParameterOfRuleTextQueryOperand,
    isRuleTextQueryOperand,
    type RuleTextQueryOperand,
} from "./SetQuery/RuleTextQuery.js";
import {
    getQueryParameterOfSubtypeQueryOperand,
    isSubtypeQueryOperand,
    type SubtypeQueryOperand,
} from "./SetQuery/SubtypeQuery.js";
import {
    getQueryParameterOfSupertypeQueryOperand,
    isSupertypeQueryOperand,
    type SupertypeQueryOperand,
} from "./SetQuery/SupertypeQuery.js";
import {
    getQueryParameterOfZoneQueryOperand,
    isZoneQueryOperand,
    type ZoneQueryOperand,
} from "./SetQuery/ZoneQuery.js";
import {
    IntersectionOfQueryParameters,
    type QueryParameter,
} from "./QueryParameter.js";
import {
    getQueryParameterOfFaceQueryOperand,
    isFaceQueryOperand,
    type FaceQueryOperand,
} from "./SetQuery/FaceQuery.js";

// =================================================================
// MARK: SetElementType
// =================================================================
const _setElementTypeId = [
    "ability",
    "cardName",
    "card",
    "cardType",
    "color",
    "face",
    "gameObject",
    "player",
    "ruleText",
    "subtype",
    "supertype",
    "zone",
] satisfies (keyof _SetElementTypeDef)[];

type _SetElementTypeDef = {
    ability: Ability;
    cardName: CardName;
    card: Card;
    cardType: CardType;
    color: Color;
    face: Face;
    gameObject: GameObject;
    player: Player;
    ruleText: RuleText;
    subtype: Subtype;
    supertype: Supertype;
    zone: Zone;
};

/** 集合の要素の型を表す文字列 */
export type SetElementTypeId<T = SetElementType> = keyof {
    [K in keyof _SetElementTypeDef as _SetElementTypeDef[K] extends T
        ? K
        : never]: _SetElementTypeDef[K];
};

/** 集合の要素の型 */
export type SetElementType<
    T extends SetElementTypeId = keyof _SetElementTypeDef,
> = _SetElementTypeDef[T];

/** 型ガード */
export function isSetElementTypeId(arg: unknown): arg is SetElementTypeId {
    return typeof arg === "string" && _setElementTypeId.some((e) => e === arg);
}
export function isSetElementType(arg: unknown): arg is SetElementType {
    return (
        isAbility(arg) ||
        isCardName(arg) ||
        isCard(arg) ||
        isCardType(arg) ||
        isColor(arg) ||
        isFace(arg) ||
        isGameObject(arg) ||
        isPlayer(arg) ||
        isRuleText(arg) ||
        isSubtype(arg) ||
        isSupertype(arg) ||
        isZone(arg)
    );
}

// =================================================================
// MARK: SetQueryOperand
// =================================================================
/** 集合のクエリの１要素 */
export type SetQueryOperand<T extends QueryParameter> =
    | CardQueryOperand<T>
    | PlayerQueryOperand<T>
    | CardNameQueryOperand<T>
    | CardTypeQueryOperand<T>
    | SubtypeQueryOperand<T>
    | SupertypeQueryOperand<T>
    | ColorQueryOperand<T>
    | ZoneQueryOperand<T>
    | AbilityQueryOperand<T>
    | RuleTextQueryOperand<T>
    | FaceQueryOperand<T>
    | GameObjectQueryOperand<T>;

export function getQueryParameterOfSetQueryOperand(
    operand: SetQueryOperand<QueryParameter>,
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
    } else if (isRuleTextQueryOperand(operand)) {
        return getQueryParameterOfRuleTextQueryOperand(operand);
    } else if (isFaceQueryOperand(operand)) {
        return getQueryParameterOfFaceQueryOperand(operand);
    } else {
        throw new Error(operand);
    }
}

// MARK: Intersection
/** 共通部分 */
export type _Intersection<
    T extends SetQueryOperand<QueryParameter>, // QueryParameterは指定可能にすべき？
> = {
    operation: "intersection";
    operand: T[];
};
// A & (B & C) = A & B & C ☑️
// A & (B + C) = (A & B) + (A & C) ☑️
// A & (B - C) = (A & B) - C
function getQueryParameterOfIntersection(
    intersection: _Intersection<SetQueryOperand<QueryParameter>>,
): QueryParameter {
    return IntersectionOfQueryParameters(
        intersection.operand.map((operand) =>
            getQueryParameterOfSetQueryOperand(operand),
        ),
    );
}

// MARK: Difference
/** 差集合 */
export type _Difference<T extends SetQueryOperand<QueryParameter>> = {
    operation: "difference";
    leftOperand: T | _Intersection<T>;
    rightOperand: T | _Intersection<T> | (T | _Intersection<T>)[]; // FIXME: leftとrightの関係
};
// A - (B + C) = (A - B) & (A - C)
// A - (B & C) = (A - B) + (A - C) ☑️
// A - (B - C) = (A - B) + (A & C) ☑️
// (A + B) - C = (A - C) + (B - C) ☑️
// (A & B) - C = (A - C) & (B - C)
// (A - B) - C = A - B - C ☑️
function getQueryParameterOfDifference(
    difference: _Difference<SetQueryOperand<QueryParameter>>,
): QueryParameter {
    const qp_left = isIntersection(difference.leftOperand)
        ? getQueryParameterOfIntersection(difference.leftOperand)
        : getQueryParameterOfSetQueryOperand(difference.leftOperand);
    const qp_right = isSetQueryOperand(difference.rightOperand)
        ? getQueryParameterOfSetQueryOperand(difference.rightOperand)
        : isIntersection(difference.rightOperand)
        ? getQueryParameterOfIntersection(difference.rightOperand)
        : difference.rightOperand.map((op) =>
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

// =================================================================
// MARK: SetOperation
// =================================================================
/** 集合演算 */
export type SetOperation<
    T extends SetQueryOperand<QueryParameter>, // FIXME: SetElementTypeを使っていない
> =
    | T
    | _Intersection<T>
    | _Difference<T>
    | (T | _Intersection<T> | _Difference<T>)[]; // unionとして解釈する

export function getQueryParameterOfSetOperation(
    operation: SetOperation<SetQueryOperand<QueryParameter>>,
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
): arg is SetQueryOperand<QueryParameter> {
    return false;
}

function isIntersection(
    arg: unknown,
): arg is _Intersection<SetQueryOperand<QueryParameter>> {
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
): arg is _Difference<SetQueryOperand<QueryParameter>> {
    return false;
}

export function isSetOperation(
    arg: unknown,
): arg is SetOperation<SetQueryOperand<QueryParameter>> {
    return false;
}

// =================================================================
function isObject(arg: unknown): arg is object {
    return typeof arg === "object" && arg !== null;
}
