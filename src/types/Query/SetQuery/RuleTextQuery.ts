import type { RuleText } from "../../Characteristics/Characteristic.js";
import type { SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

export type RuleTextConditionOperand<T extends QueryParameter> = undefined;

export type RuleTextQueryOperand<T extends QueryParameter> =
    SetElementCondition<RuleText, T>;

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
export function isRuleTextConditionOperand(
    arg: unknown,
): arg is RuleTextConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isRuleTextQueryOperand(
    arg: unknown,
): arg is RuleTextQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
