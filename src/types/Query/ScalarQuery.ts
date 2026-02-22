import {
    isCharacteristics,
    isCopiableValue,
    isManaCost,
    isNumericalValue,
    type Characteristics,
    type CopiableValue,
    type ManaCost,
    type NumericalValue,
} from "../Characteristics/Characteristic.js";
import { isStatus, type Status } from "../GameObject/Card/Card.js";
import type { QueryParameter } from "./QueryParameter.js";
import {
    getQueryParameterOfCharacteristicsQueryOperand,
    isCharacteristicsQueryOperand,
    type CharacteristicsQueryOperand,
} from "./ScalarQuery/CharacteristicsQuery.js";
import {
    getQueryParameterOfCopiableValueQueryOperand,
    isCopiableValueQueryOperand,
    type CopiableValueQueryOperand,
} from "./ScalarQuery/CopiableValueQuery.js";
import {
    getQueryParameterOfManaCostQueryOperand,
    isManaCostQueryOperand,
    type ManaCostQueryOperand,
} from "./ScalarQuery/ManaCostQuery.js";
import {
    getQueryParameterOfNumericalValueQueryOperand,
    isNumericalValueQueryOperand,
    type NumericalValueQueryOperand,
} from "./ScalarQuery/NumericalValueQuery.js";
import {
    getQueryParameterOfStatusQueryOperand,
    isStatusQueryOperand,
    type StatusQueryOperand,
} from "./ScalarQuery/StatusQuery.js";

// =================================================================
// MARK: ScalarType
// =================================================================
const _scalarTypeId = [
    "characteristics",
    "copiableValue",
    "manaCost",
    "numericalValue",
    "status",
] satisfies (keyof _ScalarTypeDef)[];

type _ScalarTypeDef = {
    characteristics: Characteristics;
    copiableValue: CopiableValue;
    manaCost: ManaCost;
    numericalValue: NumericalValue;
    status: Status;
};

export type ScalarTypeId<T = ScalarType> = keyof {
    [K in keyof _ScalarTypeDef as _ScalarTypeDef[K] extends T
        ? K
        : never]: _ScalarTypeDef[K];
};

export type ScalarType<T extends ScalarTypeId = keyof _ScalarTypeDef> =
    _ScalarTypeDef[T];

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
// export type ScalarQuery<T extends ScalarType, U extends QueryParameter> = {
//     scalarType: ScalarTypeId<T>;
//     query: ScalarQueryOperand<T, U>;
// };

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

/** 型ガード */
// export function isScalarQuery<T extends ScalarTypeId>(
//     arg: unknown,
//     typeId: T | undefined,
// ): arg is ScalarQuery<ScalarType<T>, QueryParameter> {
//     if (isNonNullObject(arg)) {
//         return (
//             "scalarType" in arg &&
//             (typeId === undefined || arg.scalarType === typeId) &&
//             "query" in arg &&
//             isScalarQueryOperand(arg.query, typeId)
//         );
//     } else {
//         return false;
//     }
// }
/** 型ガード */
export function isScalarQueryOperand<T extends ScalarTypeId>(
    arg: unknown,
    typeId: T | undefined,
): arg is ScalarQueryOperand<ScalarType<T>, QueryParameter> {
    if (typeId === undefined) {
        return (
            isCharacteristicsQueryOperand(arg) ||
            isCopiableValueQueryOperand(arg) ||
            isManaCostQueryOperand(arg) ||
            isNumericalValueQueryOperand(arg) ||
            isStatusQueryOperand(arg)
        );
    } else if (typeId === "characteristics") {
        return isCharacteristicsQueryOperand(arg);
    } else if (typeId === "copiableValue") {
        return isCopiableValueQueryOperand(arg);
    } else if (typeId === "manaCost") {
        return isManaCostQueryOperand(arg);
    } else if (typeId === "numericalValue") {
        return isNumericalValueQueryOperand(arg);
    } else if (typeId === "status") {
        return isStatusQueryOperand(arg);
    } else {
        throw new Error(typeId);
    }
}

/** クエリのパラメータ */
// export function getQueryParameterOfScalarQuery(
//     arg: ScalarQuery<ScalarType, QueryParameter>,
// ): QueryParameter {
//     return getQueryParameterOfScalarQueryOperand(arg.query);
// }
/** クエリのパラメータ */
export function getQueryParameterOfScalarQueryOperand(
    arg: ScalarQueryOperand<ScalarType, QueryParameter>,
): QueryParameter {
    if (isCharacteristicsQueryOperand(arg)) {
        return getQueryParameterOfCharacteristicsQueryOperand(arg);
    } else if (isCopiableValueQueryOperand(arg)) {
        return getQueryParameterOfCopiableValueQueryOperand(arg);
    } else if (isManaCostQueryOperand(arg)) {
        return getQueryParameterOfManaCostQueryOperand(arg);
    } else if (isNumericalValueQueryOperand(arg)) {
        return getQueryParameterOfNumericalValueQueryOperand(arg);
    } else if (isStatusQueryOperand(arg)) {
        return getQueryParameterOfStatusQueryOperand(arg);
    } else {
        throw new Error(arg);
    }
}
