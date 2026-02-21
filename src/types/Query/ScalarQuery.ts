import type {
    Characteristics,
    CopiableValue,
    ManaCost,
    NumericalValue,
} from "../Characteristics/Characteristic.js";
import type { Status } from "../GameObject/Card/Card.js";
import type { BooleanOperation, QueryParameter } from "./Query.js";
import type {
    CharacteristicsConditionOperand,
    CharacteristicsQueryOperand,
} from "./ScalarQuery/CharacteristicsQuery.js";
import type {
    CopiableValueConditionOperand,
    CopiableValueQueryOperand,
} from "./ScalarQuery/CopiableValueQuery.js";
import type {
    ManaCostConditionOperand,
    ManaCostQueryOperand,
} from "./ScalarQuery/ManaCostQuery.js";
import type {
    NumericalValueConditionOperand,
    NumericalValueQueryOperand,
} from "./ScalarQuery/NumericalValueQuery.js";
import type {
    StatusConditionOperand,
    StatusQueryOperand,
} from "./ScalarQuery/StatusQuery.js";

// =================================================================
// MARK: ScalarType
// =================================================================
type _scalarTypeDefinition = {
    characteristics: Characteristics;
    copiableValue: CopiableValue;
    manaCost: ManaCost;
    numericalValue: NumericalValue;
    status: Status;
};

export type ScalarTypeId = keyof _scalarTypeDefinition;

export type ScalarType<T extends ScalarTypeId = ScalarTypeId> =
    | _scalarTypeDefinition[T];

// ========================================================================
// MARK: Condition
// ========================================================================
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

// ========================================================================
// MARK: Query
// ========================================================================
/** スカラーのクエリ */
export type ScalarQuery<T extends ScalarType, U extends QueryParameter> = {
    scalarType: T;
    query: ScalarQueryOperand<T, U>;
};

/** クエリのオペランド */
export type ScalarQueryOperand<
    T extends ScalarType,
    U extends QueryParameter,
> = T extends Characteristics
    ? CharacteristicsQueryOperand<U>
    : T extends CopiableValue
    ? CopiableValueQueryOperand<U>
    : T extends ManaCost
    ? ManaCostQueryOperand<U>
    : T extends NumericalValue
    ? NumericalValueQueryOperand<U>
    : T extends Status
    ? StatusQueryOperand<U>
    : never;
