import type { ManaCost } from "../../Characteristics/Characteristic.js";
import type { ManaSymbol } from "../../Characteristics/Symbol.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { ScalarQuery } from "../ScalarQuery.js";
import type { CardQuery } from "../SetQuery/CardQuery.js";

/** マナコストの条件 */
export type ManaCostConditionOperand<T extends QueryParameter> = ScalarQuery<
    ManaCost,
    T
>;

/** マナコストのクエリ */
export type ManaCostQueryOperand<T extends QueryParameter> =
    | ManaSymbol[]
    | { card: CardQuery<T> };
//

export function getQueryParameterOfManaCostConditionOperand(
    query: ManaCostConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfManaCostQueryOperand(
    query: ManaCostQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

export function isManaCostConditionOperand(
    arg: unknown,
): arg is ManaCostConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isManaCostQueryOperand(
    arg: unknown,
): arg is ManaCostQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
