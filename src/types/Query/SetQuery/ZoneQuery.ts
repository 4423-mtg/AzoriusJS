import type { Card } from "../../GameObject/Card/Card.js";
import type { Player } from "../../GameObject/Player.js";
import type { Zone, ZoneType } from "../../GameState/Zone.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetElementCondition, SetQuery } from "../SetQuery.js";

// ZoneTypeかownerのどちらかは必須にする
/** 領域の条件 */
export type ZoneConditionOperand<T extends QueryParameter> = {
    type?: ZoneType | ZoneType[];
    owner?: SetElementCondition<Player, T>;
};

/** 領域のクエリ */
export type ZoneQueryOperand<T extends QueryParameter> =
    | Zone
    | Zone[]
    | { card: SetQuery<Card, T> } // カードが置かれている領域
    | SetElementCondition<Zone, T>;
// カードが直前に置かれていた領域とか必要になるかも

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
