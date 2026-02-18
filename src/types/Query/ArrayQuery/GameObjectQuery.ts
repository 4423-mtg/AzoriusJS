import type { GameObject } from "../../GameObject/GameObject.js";
import type { Zone } from "../../GameState/Zone.js";
import type { QueryParameter } from "../Query.js";
import {
    getQueryParameterOfSetQuery,
    isSetElementCondition,
    type SetElementCondition,
    type SetQuery,
} from "../SetQuery.js";

// =================================================================
// MARK: GameObject
// =================================================================
export type GameObjectConditionOperand<T extends QueryParameter> = {
    zone: SetQuery<Zone, T>;
};

export type GameObjectQueryOperand<T extends QueryParameter> =
    | SetElementCondition<GameObject, T>
    | {
          argument: string;
      };

export function getQueryParameterOfGameObjectConditionOperand(
    operand: GameObjectConditionOperand<QueryParameter>,
): QueryParameter {
    return getQueryParameterOfSetQuery(operand.zone);
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
