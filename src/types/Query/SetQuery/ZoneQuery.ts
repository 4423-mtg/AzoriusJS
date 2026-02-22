import type { Player } from "../../GameObject/Player.js";
import type { Zone, ZoneType } from "../../GameState/Zone.js";
import type { SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetOperation } from "../SetQuery.js";
import type { CardQuery } from "./CardQuery.js";

export type ZoneQuery<T extends QueryParameter> = SetOperation<
    ZoneQueryOperand<T>
>;

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
    | { card: CardQuery<T> } // カードが置かれている領域
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
