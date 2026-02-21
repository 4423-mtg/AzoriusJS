import type {
    Characteristics,
    CopiableValue,
    ManaCost,
    NumericalValue,
} from "../Characteristics/Characteristic.js";
import type { Status } from "../GameObject/Card/Card.js";
import type { QueryParameter } from "./QueryParameter.js";
import type { CharacteristicsQueryOperand } from "./ScalarQuery/CharacteristicsQuery.js";
import type { CopiableValueQueryOperand } from "./ScalarQuery/CopiableValueQuery.js";
import type { ManaCostQueryOperand } from "./ScalarQuery/ManaCostQuery.js";
import type { NumericalValueQueryOperand } from "./ScalarQuery/NumericalValueQuery.js";
import type { StatusQueryOperand } from "./ScalarQuery/StatusQuery.js";

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
// MARK: ScalarQuery
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
