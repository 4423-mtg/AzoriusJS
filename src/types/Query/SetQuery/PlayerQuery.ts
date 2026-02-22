import type { Player } from "../../GameObject/Player.js";
import type { PlayerInfo } from "../../GameState/Match.js";
import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetOperation } from "../SetQuery.js";
import type { GameObjectQuery } from "./GameObjectQuery.js";

// =================================================================
export type PlayerCondition<T extends QueryParameter> = BooleanOperation<
    PlayerConditionOperand<T>
>;
export type PlayerConditionOperand<T extends QueryParameter> =
    // オーナー、コントローラー
    | {
          type: "owner" | "controller";
          object: GameObjectQuery<T>;
      }
    // 対戦相手、チームメイト、ターン順で次、ターン順で前
    | {
          type: "opponent" | "teamMate" | "next" | "previous";
          player: PlayerQuery<T>;
      }
    | { type: "isMonarch" | "startingPlayer" } // 統治者、開始プレイヤー
    | { info: PlayerInfo } // TODO: プレイヤーID？
    | { type: "oneOf" | "allOf" | "equal"; players: PlayerQuery<T> };

export function isPlayerCondition(
    arg: unknown,
): arg is PlayerCondition<QueryParameter> {
    // TODO:
    return false;
}
export function isPlayerConditionOperand(
    arg: unknown,
): arg is PlayerConditionOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
export type PlayerQuery<T extends QueryParameter> = SetOperation<
    PlayerQueryOperand<T>
>;

export type PlayerQueryOperand<T extends QueryParameter> =
    | Player
    | Player[]
    | PlayerCondition<T>
    | { argument: string };

export function isPlayerQuery(
    arg: unknown,
): arg is PlayerQuery<QueryParameter> {
    // TODO:
    return false;
}
export function isPlayerQueryOperand(
    arg: unknown,
): arg is PlayerQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
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
