import type { GameObject } from "../../GameObject/GameObject.js";
import type { Player } from "../../GameObject/Player.js";
import type { PlayerInfo } from "../../GameState/Match.js";
import type { QueryParameter } from "../Query.js";
import type { SetElementCondition, SetQuery } from "../SetQuery.js";
// =========================================================
// MARK: Player
// =================================================================
export type PlayerConditionOperand<T extends QueryParameter> =
    | { type: "oneOf"; players: SetQuery<Player, T> }
    | {
          type: "owner" | "controller";
          object: SetQuery<GameObject, T>;
      }
    | {
          type: "opponent" | "teamMate" | "next" | "previous";
          player: SetQuery<Player, T>;
      }
    | { type: "isMonarch" | "startingPlayer" };

export type PlayerQueryOperand<T extends QueryParameter> =
    | Player
    | Player[]
    | { info: PlayerInfo } // TODO: プレイヤーID？
    | SetElementCondition<Player, T>
    | { argument: string };

export function getQueryParameterOfPlayerConditionOperand(
    operand: PlayerConditionOperand<QueryParameter>,
): QueryParameter {
    return {};
}

export function getQueryParameterOfPlayerQueryOperand(
    operand: PlayerQueryOperand<QueryParameter>,
): QueryParameter {
    return {};
}
export function isPlayerConditionOperand(
    arg: unknown,
): arg is PlayerConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isPlayerQueryOperand(
    arg: unknown,
): arg is PlayerQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
