import type { GameObject } from "../../GameObject/GameObject.js";
import type { Player } from "../../GameObject/Player.js";
import type { PlayerInfo } from "../../GameState/Match.js";
import type { QueryParameter } from "../Query.js";
import type { SetElementCondition, SetQuery } from "../SetQuery.js";
// =========================================================
// MARK: Player
// =================================================================
export type PlayerConditionOperand<T extends QueryParameter> =
    // オーナー、コントローラー
    | {
          type: "owner" | "controller";
          object: SetQuery<GameObject, T>;
      }
    // 対戦相手、チームメイト、ターン順で次、ターン順で前
    | {
          type: "opponent" | "teamMate" | "next" | "previous";
          player: SetQuery<Player, T>;
      }
    | { type: "isMonarch" | "startingPlayer" } // 統治者、開始プレイヤー
    | { info: PlayerInfo } // TODO: プレイヤーID？
    | { type: "oneOf" | "allOf" | "equal"; players: SetQuery<Player, T> };

export type PlayerQueryOperand<T extends QueryParameter> =
    | Player
    | Player[]
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
