import type {
    Characteristics,
    CopiableValue,
    ManaCost,
    NumericalValue,
} from "../Characteristics/Characteristic.js";
import type { Status } from "../GameObject/Card/Card.js";
import type { QueryParameter } from "./Query.js";
import type { CharacteristicsQueryOperand } from "./ScalarQuery/CharacteristicsQuery.js";
import type { CopiableValueQueryOperand } from "./ScalarQuery/CopiableValueQuery.js";
import type { ManaCostQueryOperand } from "./ScalarQuery/ManaCostQuery.js";
import type { NumberQueryOperand } from "./ScalarQuery/NumberQuery.js";
import type { StatusQueryOperand } from "./ScalarQuery/StatusQuery.js";

export type ScalarType =
    | Characteristics
    | CopiableValue
    | ManaCost
    | NumericalValue
    | Status;

export type ScalarCondition = undefined;

// NumberQuery, CharacteristicsQuery, CopiableValueQuery
export type ScalarQuery<T extends ScalarType, U extends QueryParameter> = {
    scalarType: T;
    query: ScalarQueryOperand<T, U>;
};

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
    ? NumberQueryOperand<U>
    : T extends Status
    ? StatusQueryOperand<U>
    : never;
