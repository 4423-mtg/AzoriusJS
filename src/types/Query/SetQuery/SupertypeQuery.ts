import type { Supertype } from "../../Characteristics/Supertype.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetQuery } from "../SetQuery.js";

export type SupertypeConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf" | "equal";
    supertype: SetQuery<Supertype, T>;
};

export type SupertypeQueryOperand<T extends QueryParameter> =
    | Supertype
    | Supertype[]
    | { card: SetQuery<Card, T> }
    | SetElementCondition<Supertype, T>
    | { argument: string };

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
