import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetOperation } from "../SetQuery.js";

// =================================================================
export type RuleTextCondition<T extends QueryParameter> = BooleanOperation<
    RuleTextConditionOperand<T>
>;
export type RuleTextConditionOperand<T extends QueryParameter> = {};

export function isRuleTextCondition(
    arg: unknown,
): arg is RuleTextCondition<QueryParameter> {
    // TODO:
    return false;
}
export function isRuleTextConditionOperand(
    arg: unknown,
): arg is RuleTextConditionOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
export type RuleTextQuery<T extends QueryParameter> = SetOperation<
    RuleTextQueryOperand<T>
>;
export type RuleTextQueryOperand<T extends QueryParameter> =
    RuleTextCondition<T>;

export function isRuleTextQuery(
    arg: unknown,
): arg is RuleTextQuery<QueryParameter> {
    // TODO:
    return false;
}
export function isRuleTextQueryOperand(
    arg: unknown,
): arg is RuleTextQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
export function getQueryParameterOfRuleTextConditionOperand(
    operand: RuleTextConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfRuleTextQueryOperand(
    operand: RuleTextQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
