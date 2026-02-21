import type { RuleText } from "../../Characteristics/Characteristic.js";
import type { SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";

export type TextConditionOperand<T extends QueryParameter> = undefined;

export type TextQueryOperand<T extends QueryParameter> = SetElementCondition<
    RuleText,
    T
>;

export function getQueryParameterOfTextConditionOperand(
    operand: TextConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfTextQueryOperand(
    operand: TextQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isTextConditionOperand(
    arg: unknown,
): arg is TextConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isTextQueryOperand(
    arg: unknown,
): arg is TextQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
