import type { CardType } from "../Characteristics/CardType.js";
import type {
    CardName,
    Characteristics,
    CopiableValue,
    ManaCost,
    NumericalValue,
    RuleText,
} from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Card, Face, Status } from "../GameObject/Card/Card.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type { Player } from "../GameObject/Player.js";
import type { Zone } from "../GameState/Zone.js";
import {
    IntersectionOfQueryParameters,
    type QueryParameter,
} from "./QueryParameter.js";
import {
    isScalarType,
    isScalarTypeId,
    type ScalarType,
    type ScalarTypeId,
} from "./ScalarQuery.js";
import {
    getQueryParameterOfCharacteristicsConditionOperand,
    isCharacteristicsConditionOperand,
    type CharacteristicsConditionOperand,
} from "./ScalarQuery/CharacteristicsQuery.js";
import {
    getQueryParameterOfCopiableValueConditionOperand,
    isCopiableValueConditionOperand,
    type CopiableValueConditionOperand,
} from "./ScalarQuery/CopiableValueQuery.js";
import {
    getQueryParameterOfManaCostConditionOperand,
    isManaCostConditionOperand,
    type ManaCostConditionOperand,
} from "./ScalarQuery/ManaCostQuery.js";
import {
    getQueryParameterOfNumericalValueConditionOperand,
    isNumericalValueConditionOperand,
    type NumericalValueConditionOperand,
} from "./ScalarQuery/NumericalValueQuery.js";
import {
    getQueryParameterOfStatusConditionOperand,
    isStatusConditionOperand,
    type StatusConditionOperand,
} from "./ScalarQuery/StatusQuery.js";
import {
    isSetElementType,
    isSetElementTypeId,
    type SetElementType,
    type SetElementTypeId,
} from "./SetQuery.js";
import {
    getQueryParameterOfAbilityConditionOperand,
    isAbilityConditionOperand,
    type AbilityConditionOperand,
} from "./SetQuery/AbilityQuery.js";
import {
    getQueryParameterOfCardNameConditionOperand,
    isCardNameConditionOperand,
    type CardNameConditionOperand,
} from "./SetQuery/CardNameQuery.js";
import {
    getQueryParameterOfCardConditionOperand,
    isCardConditionOperand,
    type CardConditionOperand,
} from "./SetQuery/CardQuery.js";
import {
    getQueryParameterOfCardTypeConditionOperand,
    isCardTypeConditionOperand,
    type CardTypeConditionOperand,
} from "./SetQuery/CardTypeQuery.js";
import {
    getQueryParameterOfColorConditionOperand,
    isColorConditionOperand,
    type ColorConditionOperand,
} from "./SetQuery/ColorQuery.js";
import {
    getQueryParameterOfGameObjectConditionOperand,
    isGameObjectConditionOperand,
    type GameObjectConditionOperand,
} from "./SetQuery/GameObjectQuery.js";
import {
    getQueryParameterOfPlayerConditionOperand,
    isPlayerConditionOperand,
    type PlayerConditionOperand,
} from "./SetQuery/PlayerQuery.js";
import {
    getQueryParameterOfRuleTextConditionOperand,
    isRuleTextConditionOperand,
    type RuleTextConditionOperand,
} from "./SetQuery/RuleTextQuery.js";
import {
    getQueryParameterOfSubtypeConditionOperand,
    isSubtypeConditionOperand,
    type SubtypeConditionOperand,
} from "./SetQuery/SubtypeQuery.js";
import {
    getQueryParameterOfSupertypeConditionOperand,
    isSupertypeConditionOperand,
    type SupertypeConditionOperand,
} from "./SetQuery/SupertypeQuery.js";
import {
    getQueryParameterOfZoneConditionOperand,
    isZoneConditionOperand,
    type ZoneConditionOperand,
} from "./SetQuery/ZoneQuery.js";
import type { FaceConditionOperand } from "./SetQuery/FaceQuery.js";

// ========================================================================
// MARK: ConditionTargetType
// ========================================================================

// TODO: SetElementCondition を通常のConditionと区別する必要はあるのだろうか？
// 受け取って処理する側を書くときに必要になるかもしれない。
export type ConditionTargetTypeId = SetElementTypeId | ScalarTypeId;
export type ConditionTargetType<
    T extends ConditionTargetTypeId = ConditionTargetTypeId,
> = T extends SetElementTypeId
    ? SetElementType<T>
    : T extends ScalarTypeId
    ? ScalarType<T>
    : never;

export function isConditionTargetTypeId(
    arg: unknown,
): arg is ConditionTargetTypeId {
    return isSetElementTypeId(arg) || isScalarTypeId(arg);
}
export function isConditionTargetType(
    arg: unknown,
): arg is ConditionTargetType {
    return isSetElementType(arg) || isScalarType(arg);
}

// ========================================================================
// MARK: Condition
// ========================================================================
/** 条件 */
export type Condition<
    T extends ConditionTargetType,
    U extends QueryParameter,
> = { targetType: T; condition: BooleanOperation<BooleanQueryOperand<T, U>> };

/** 条件のオペランド */
export type BooleanQueryOperand<
    T extends ConditionTargetType,
    U extends QueryParameter,
> = T extends Ability // SetElement
    ? AbilityConditionOperand<U>
    : T extends CardName
    ? CardNameConditionOperand<U>
    : T extends Card
    ? CardConditionOperand<U>
    : T extends CardType
    ? CardTypeConditionOperand<U>
    : T extends Color
    ? ColorConditionOperand<U>
    : T extends Face
    ? FaceConditionOperand<U>
    : T extends Player
    ? PlayerConditionOperand<U>
    : T extends RuleText
    ? RuleTextConditionOperand<U>
    : T extends Subtype
    ? SubtypeConditionOperand<U>
    : T extends Supertype
    ? SupertypeConditionOperand<U>
    : T extends Zone
    ? ZoneConditionOperand<U>
    : T extends GameObject
    ? GameObjectConditionOperand<U>
    : // Scalar
    T extends NumericalValue
    ? NumericalValueConditionOperand<U>
    : T extends ManaCost
    ? ManaCostConditionOperand<U>
    : T extends Characteristics
    ? CharacteristicsConditionOperand<U>
    : T extends CopiableValue
    ? CopiableValueConditionOperand<U>
    : T extends Status
    ? StatusConditionOperand<U>
    : never;

/** 条件演算 */
type _Not<T extends BooleanQueryOperand<ConditionTargetType, QueryParameter>> =
    { operation: "not"; operand: T };
type _And<T extends BooleanQueryOperand<ConditionTargetType, QueryParameter>> =
    (T | _Not<T>)[];
type _Or<T extends BooleanQueryOperand<ConditionTargetType, QueryParameter>> = {
    operaion: "or";
    operand: (T | _And<T> | _Not<T>)[];
};
export type BooleanOperation<
    T extends BooleanQueryOperand<ConditionTargetType, QueryParameter>,
> = T | _Not<T> | _And<T> | _Or<T>;

// A and (B and C) = A and B and C
// A and (B or C) = (A and B) or (A and C)
// A and (not B)
// A or (B and C)
// A or (B or C) = A or B or C
// A or (not B)
// not (A and B) = (not A) or (not B)
// not (A or B) = (not A) and (not B)
// not (not A) = A

// あなたがコントロールしていない基本でない土地
// (not A) and (not B) and C
// 対戦相手がコントロールする、クリーチャーと基本でない土地
// A and (B or ((not C) and D))
// = (A and B) or (A and (not C) and D)

export function getQueryParameterOfCondition(
    arg: Condition<ConditionTargetType, QueryParameter>,
): QueryParameter {
    return getQueryParameterOfBooleanOperation(arg.condition);
}

/** BooleanOperationのパラメータ */
export function getQueryParameterOfBooleanOperation(
    arg: BooleanOperation<
        BooleanQueryOperand<ConditionTargetType, QueryParameter>
    >,
): QueryParameter {
    if (isBooleanQueryOperand(arg)) {
        return getQueryParameterOfBooleanQueryOperand(arg);
    } else if (isNot(arg)) {
        return getQueryParameterOfNot(arg);
    } else if (isAnd(arg)) {
        return getQueryParameterOfAnd(arg);
    } else if (isOr(arg)) {
        return getQueryParameterOfOr(arg);
    } else {
        throw new Error(arg);
    }
}
function getQueryParameterOfNot(
    arg: _Not<BooleanQueryOperand<ConditionTargetType, QueryParameter>>,
): QueryParameter {
    return getQueryParameterOfBooleanQueryOperand(arg.operand);
}
function getQueryParameterOfAnd(
    arg: _And<BooleanQueryOperand<ConditionTargetType, QueryParameter>>,
): QueryParameter {
    return IntersectionOfQueryParameters(
        arg.map((e) =>
            isBooleanQueryOperand(e)
                ? getQueryParameterOfBooleanQueryOperand(e)
                : getQueryParameterOfNot(e),
        ),
    );
}
function getQueryParameterOfOr(
    arg: _Or<BooleanQueryOperand<ConditionTargetType, QueryParameter>>,
): QueryParameter {
    return IntersectionOfQueryParameters(
        arg.operand.map((e) =>
            isBooleanQueryOperand(e)
                ? getQueryParameterOfBooleanQueryOperand(e)
                : isAnd(e)
                ? getQueryParameterOfAnd(e)
                : getQueryParameterOfNot(e),
        ),
    );
}

export function getQueryParameterOfBooleanQueryOperand(
    arg: BooleanQueryOperand<ConditionTargetType, QueryParameter>,
): QueryParameter {
    if (isGameObjectConditionOperand(arg)) {
        return getQueryParameterOfGameObjectConditionOperand(arg);
    } else if (isCardConditionOperand(arg)) {
        return getQueryParameterOfCardConditionOperand(arg);
    } else if (isPlayerConditionOperand(arg)) {
        return getQueryParameterOfPlayerConditionOperand(arg);
    } else if (isCardNameConditionOperand(arg)) {
        return getQueryParameterOfCardNameConditionOperand(arg);
    } else if (isCardTypeConditionOperand(arg)) {
        return getQueryParameterOfCardTypeConditionOperand(arg);
    } else if (isSubtypeConditionOperand(arg)) {
        return getQueryParameterOfSubtypeConditionOperand(arg);
    } else if (isSupertypeConditionOperand(arg)) {
        return getQueryParameterOfSupertypeConditionOperand(arg);
    } else if (isColorConditionOperand(arg)) {
        return getQueryParameterOfColorConditionOperand(arg);
    } else if (isZoneConditionOperand(arg)) {
        return getQueryParameterOfZoneConditionOperand(arg);
    } else if (isAbilityConditionOperand(arg)) {
        return getQueryParameterOfAbilityConditionOperand(arg);
    } else if (isRuleTextConditionOperand(arg)) {
        return getQueryParameterOfRuleTextConditionOperand(arg);
    } else if (isNumericalValueConditionOperand(arg)) {
        return getQueryParameterOfNumericalValueConditionOperand(arg);
    } else if (isManaCostConditionOperand(arg)) {
        return getQueryParameterOfManaCostConditionOperand(arg);
    } else if (isCharacteristicsConditionOperand(arg)) {
        return getQueryParameterOfCharacteristicsConditionOperand(arg);
    } else if (isCopiableValueConditionOperand(arg)) {
        return getQueryParameterOfCopiableValueConditionOperand(arg);
    } else if (isStatusConditionOperand(arg)) {
        return getQueryParameterOfStatusConditionOperand(arg);
    } else {
        throw new Error(arg);
    }
}

// MARK: Scalar
/** スカラーの条件 */
export type ScalarCondition<T extends ScalarType, U extends QueryParameter> = {
    scalarType: T; // FIXME: ScalarTypeId of T
    condition: BooleanOperation<ScalarConditionOperand<T, U>>;
};

/** 条件のオペランド */
export type ScalarConditionOperand<
    T extends ScalarType,
    U extends QueryParameter,
> = T extends Characteristics
    ? CharacteristicsConditionOperand<U>
    : T extends CopiableValue
    ? CopiableValueConditionOperand<U>
    : T extends ManaCost
    ? ManaCostConditionOperand<U>
    : T extends NumericalValue
    ? NumericalValueConditionOperand<U>
    : T extends Status
    ? StatusConditionOperand<U>
    : never;

// =================================================================
// MARK: SetElement
// =================================================================

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
    ? RuleTextConditionOperand<U>
    : never;

// =================================================================
// MARK: 型ガード
// =================================================================
export function isCondition(
    arg: unknown,
): arg is Condition<ConditionTargetType, QueryParameter> {
    return false;
}
export function isBooleanQueryOperand(
    arg: unknown,
): arg is BooleanQueryOperand<ConditionTargetType, QueryParameter> {
    return false;
}
function isNot(
    arg: unknown,
): arg is _Not<BooleanQueryOperand<ConditionTargetType, QueryParameter>> {
    return false;
}
function isAnd(
    arg: unknown,
): arg is _And<BooleanQueryOperand<ConditionTargetType, QueryParameter>> {
    return false;
}
function isOr(
    arg: unknown,
): arg is _Or<BooleanQueryOperand<ConditionTargetType, QueryParameter>> {
    return false;
}
export function isBooleanOperation(
    arg: unknown,
): arg is BooleanOperation<
    BooleanQueryOperand<ConditionTargetType, QueryParameter>
> {
    return false;
}
export function isScalarCondition(
    arg: unknown,
): arg is ScalarCondition<ScalarType, QueryParameter> {
    return false;
}
export function isScalarConditionOperand(
    arg: unknown,
): arg is ScalarConditionOperand<ScalarType, QueryParameter> {
    return false;
}
export function isSetElementCondition(
    arg: unknown,
): arg is SetElementCondition<SetElementType, QueryParameter> {
    return false;
}

export function isSetElementConditionOperand(
    arg: unknown,
): arg is SetElementConditionOperand<SetElementType, QueryParameter> {
    return false;
}
