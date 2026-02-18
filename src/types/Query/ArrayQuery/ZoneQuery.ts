import type { Player } from "../../GameObject/Player.js";
import type { Zone, ZoneType } from "../../GameState/Zone.js";
import type { QueryParameter } from "../Query.js";
import type { SetElementCondition, SetQuery } from "../SetQuery.js";

export type ZoneConditionOperand<T extends QueryParameter> =
    | {
          type: ZoneType;
          owner?: SetQuery<Player, T>;
      }
    | {
          type?: ZoneType;
          owner: SetQuery<Player, T>;
      };

export type ZoneQueryOperand<T extends QueryParameter> =
    | Zone
    | SetElementCondition<Zone, T>;

export function getQueryParameterOfZoneConditionOperand(
    operand: ZoneConditionOperand<QueryParameter>,
): QueryParameter {
    return {};
}

export function getQueryParameterOfZoneQueryOperand(
    operand: ZoneQueryOperand<QueryParameter>,
): QueryParameter {
    return {};
}
export function isZoneConditionOperand(
    arg: unknown,
): arg is ZoneConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isZoneQueryOperand(
    arg: unknown,
): arg is ZoneQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
