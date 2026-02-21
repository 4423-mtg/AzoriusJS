import type {
    Characteristics,
    CopiableValue,
    ManaCost,
    NumericalValue,
} from "../Characteristics/Characteristic.js";
import { isStatus, type Status } from "../GameObject/Card/Card.js";
import type { QueryParameter } from "./QueryParameter.js";
import type { CharacteristicsQueryOperand } from "./ScalarQuery/CharacteristicsQuery.js";
import type { CopiableValueQueryOperand } from "./ScalarQuery/CopiableValueQuery.js";
import type { ManaCostQueryOperand } from "./ScalarQuery/ManaCostQuery.js";
import type { NumericalValueQueryOperand } from "./ScalarQuery/NumericalValueQuery.js";
import type { StatusQueryOperand } from "./ScalarQuery/StatusQuery.js";

// =================================================================
// MARK: ScalarType
// =================================================================
export type ScalarTypeId = (typeof _scalarTypeId)[number];
const _scalarTypeId = [
    "characteristics",
    "copiableValue",
    "manaCost",
    "numericalValue",
    "status",
] as const;

export type ScalarType<T extends ScalarTypeId = ScalarTypeId> = {
    characteristics: Characteristics;
    copiableValue: CopiableValue;
    manaCost: ManaCost;
    numericalValue: NumericalValue;
    status: Status;
}[T];

export function isScalarTypeId(arg: unknown): arg is ScalarTypeId {
    return typeof arg === "string" && _scalarTypeId.some((e) => e === arg);
}
export function isScalarType(arg: unknown): arg is ScalarType {
    return (
        isCharacteristics(arg) ||
        isCopiableValue(arg) ||
        isManaCost(arg) ||
        isNumericalValue(arg) ||
        isStatus(arg)
    );
}

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
