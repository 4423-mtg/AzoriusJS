import type { Ability } from "../../GameObject/Ability.js";
import type { QueryParameter } from "../Query.js";

export type AbilityConditionOperand<T extends QueryParameter> = undefined;
export type AbilityQueryOperand<T extends QueryParameter> =
    | Ability[]
    | {
          lose?: Ability[]; // TODO: 能力の同一性の検査
          add?: Ability[];
      };

export function getQueryParameterOfAbilityConditionOperand(
    operand: AbilityConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfAbilityQueryOperand(
    operand: AbilityQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isAbilityConditionOperand(
    arg: unknown,
): arg is AbilityConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isAbilityQueryOperand(
    arg: unknown,
): arg is AbilityQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
