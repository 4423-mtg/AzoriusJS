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
// MARK: BooleanQueryOperand
// ========================================================================
/** 条件のオペランド */
export type BooleanQueryOperand<T extends QueryParameter> =
    // SetElement
    | AbilityConditionOperand<T>
    | CardNameConditionOperand<T>
    | CardConditionOperand<T>
    | CardTypeConditionOperand<T>
    | ColorConditionOperand<T>
    | FaceConditionOperand<T>
    | PlayerConditionOperand<T>
    | RuleTextConditionOperand<T>
    | SubtypeConditionOperand<T>
    | SupertypeConditionOperand<T>
    | ZoneConditionOperand<T>
    | GameObjectConditionOperand<T>
    // Scalar
    | NumericalValueConditionOperand<T>
    | ManaCostConditionOperand<T>
    | CharacteristicsConditionOperand<T>
    | CopiableValueConditionOperand<T>
    | StatusConditionOperand<T>;

export function isBooleanQueryOperand(
    arg: unknown,
): arg is BooleanQueryOperand<QueryParameter> {
    return false;
}

// ========================================================================
// MARK: BooleanOperation
// ========================================================================
/** 条件演算 */
type _Not<T extends BooleanQueryOperand<QueryParameter>> = {
    operation: "not";
    operand: T;
};
type _And<T extends BooleanQueryOperand<QueryParameter>> = (T | _Not<T>)[];
type _Or<T extends BooleanQueryOperand<QueryParameter>> = {
    operaion: "or";
    operand: (T | _And<T> | _Not<T>)[];
};
export type BooleanOperation<T extends BooleanQueryOperand<QueryParameter>> =
    | T
    | _Not<T>
    | _And<T>
    | _Or<T>;
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

function isNot(arg: unknown): arg is _Not<BooleanQueryOperand<QueryParameter>> {
    return false;
}
function isAnd(arg: unknown): arg is _And<BooleanQueryOperand<QueryParameter>> {
    return false;
}
function isOr(arg: unknown): arg is _Or<BooleanQueryOperand<QueryParameter>> {
    return false;
}
export function isBooleanOperation(
    arg: unknown,
): arg is BooleanOperation<BooleanQueryOperand<QueryParameter>> {
    return false;
}

// =================================================================
// MARK: getQueryParameter
// =================================================================
/** BooleanOperationのパラメータ */
export function getQueryParameterOfBooleanOperation(
    arg: BooleanOperation<BooleanQueryOperand<QueryParameter>>,
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
    arg: _Not<BooleanQueryOperand<QueryParameter>>,
): QueryParameter {
    return getQueryParameterOfBooleanQueryOperand(arg.operand);
}
function getQueryParameterOfAnd(
    arg: _And<BooleanQueryOperand<QueryParameter>>,
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
    arg: _Or<BooleanQueryOperand<QueryParameter>>,
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
    arg: BooleanQueryOperand<QueryParameter>,
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
