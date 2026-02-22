import type { Supertype } from "../../Characteristics/Supertype.js";
import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetOperation } from "../SetQuery.js";
import type { CardQuery } from "./CardQuery.js";

// =================================================================
export type SupertypeCondition<T extends QueryParameter> = BooleanOperation<
    SupertypeConditionOperand<T>
>;
export type SupertypeConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf" | "equal";
    supertype: SupertypeQuery<T>;
};

// =================================================================
export type SupertypeQuery<T extends QueryParameter> = SetOperation<
    SupertypeQueryOperand<T>
>;
export type SupertypeQueryOperand<T extends QueryParameter> =
    | Supertype
    | Supertype[]
    | { card: CardQuery<T> }
    | SupertypeCondition<T>
    | { argument: string };

// =================================================================
export function getQueryParameterOfSupertypeQueryOperand(
    operand: SupertypeQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfSupertypeConditionOperand(
    operand: SupertypeConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isSupertypeConditionOperand(
    arg: unknown,
): arg is SupertypeConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isSupertypeQueryOperand(
    arg: unknown,
): arg is SupertypeQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
