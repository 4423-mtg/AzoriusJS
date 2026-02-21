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
import type { Card, Status } from "../GameObject/Card/Card.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type { Player } from "../GameObject/Player.js";
import type { Zone } from "../GameState/Zone.js";
import type { QueryParameter } from "./QueryParameter.js";
import type { ScalarType, ScalarTypeId } from "./ScalarQuery.js";
import type { CharacteristicsConditionOperand } from "./ScalarQuery/CharacteristicsQuery.js";
import type { CopiableValueConditionOperand } from "./ScalarQuery/CopiableValueQuery.js";
import type { ManaCostConditionOperand } from "./ScalarQuery/ManaCostQuery.js";
import type { NumericalValueConditionOperand } from "./ScalarQuery/NumericalValueQuery.js";
import type { StatusConditionOperand } from "./ScalarQuery/StatusQuery.js";
import type { SetElementType, SetElementTypeId } from "./SetQuery.js";
import type { AbilityConditionOperand } from "./SetQuery/AbilityQuery.js";
import type { CardNameConditionOperand } from "./SetQuery/CardNameQuery.js";
import type { CardConditionOperand } from "./SetQuery/CardQuery.js";
import type { CardTypeConditionOperand } from "./SetQuery/CardTypeQuery.js";
import type { ColorConditionOperand } from "./SetQuery/ColorQuery.js";
import type { GameObjectConditionOperand } from "./SetQuery/GameObjectQuery.js";
import type { PlayerConditionOperand } from "./SetQuery/PlayerQuery.js";
import type { TextConditionOperand } from "./SetQuery/RuleTextQuery.js";
import type { SubtypeConditionOperand } from "./SetQuery/SubtypeQuery.js";
import type { SupertypeConditionOperand } from "./SetQuery/SupertypeQuery.js";
import type { ZoneConditionOperand } from "./SetQuery/ZoneQuery.js";

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
    : T extends NumericalValue
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

/** BooleanOperationのパラメータ */
export function getQueryParameterOfBooleanOperation(
    query: BooleanOperation<
        BooleanQueryOperand<ConditionTargetType, QueryParameter>
    >,
): QueryParameter {
    return {}; // TODO:
}

/** 型ガード */
export function isBooleanOperation(
    arg: unknown,
): arg is BooleanOperation<
    BooleanQueryOperand<ConditionTargetType, QueryParameter>
> {
    // TODO:
    return false;
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
