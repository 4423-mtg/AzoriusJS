import type { GameObject } from "../../GameObject/GameObject.js";
import type { Zone } from "../../GameState/Zone.js";
import {
    isSetElementCondition,
    type BooleanOperation,
    type SetElementCondition,
} from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import { type SetOperation } from "../SetQuery.js";
import { getQueryParameterOfZoneQueryOperand } from "./ZoneQuery.js";

// =================================================================
export type GameObjectCondition<T extends QueryParameter> = BooleanOperation<
    GameObjectConditionOperand<T>
>;
export type GameObjectConditionOperand<T extends QueryParameter> = {
    zone: SetElementCondition<Zone, T>;
};

// =================================================================
export type GameObjectQuery<T extends QueryParameter> = SetOperation<
    GameObjectQueryOperand<T>
>;
export type GameObjectQueryOperand<T extends QueryParameter> =
    | SetElementCondition<GameObject, T>
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
