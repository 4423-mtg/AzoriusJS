import { isSetElementCondition, type BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import { type SetOperation } from "../SetQuery.js";
import {
    getQueryParameterOfZoneQueryOperand,
    type ZoneCondition,
} from "./ZoneQuery.js";

// =================================================================
export type GameObjectCondition<T extends QueryParameter> = BooleanOperation<
    GameObjectConditionOperand<T>
>;
export type GameObjectConditionOperand<T extends QueryParameter> = {
    zone: ZoneCondition<T>;
};

// =================================================================
export type GameObjectQuery<T extends QueryParameter> = SetOperation<
    GameObjectQueryOperand<T>
>;
export type GameObjectQueryOperand<T extends QueryParameter> =
    | GameObjectCondition<T>
    | {
          argument: string;
      };

// =================================================================
export function getQueryParameterOfGameObjectConditionOperand(
    operand: GameObjectConditionOperand<QueryParameter>,
): QueryParameter {
    return getQueryParameterOfSetElementCondition(operand.zone);
}

export function getQueryParameterOfGameObjectQueryOperand(
    operand: GameObjectQueryOperand<QueryParameter>,
): QueryParameter {
    if (isSetElementCondition(operand)) {
        // FIXME:
        return getQueryParameterOfZoneQueryOperand(operand.zone);
    } else {
        return {
            [operand.argument]: { type: "gameObject" },
        };
    }
}
// GameObjectQuery -> SetOperation -> GameObjectCondition | {argument: string}
export function isGameObjectConditionOperand(
    arg: unknown,
): arg is GameObjectConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isGameObjectQueryOperand(
    arg: unknown,
): arg is GameObjectQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
