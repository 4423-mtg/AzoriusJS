import type { Zone, ZoneType } from "../../GameState/Zone.js";
import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetOperation } from "../SetQuery.js";
import type { CardQuery } from "./CardQuery.js";
import type { PlayerCondition } from "./PlayerQuery.js";

// =================================================================
// ZoneTypeかownerのどちらかは必須にする
/** 領域の条件 */
export type ZoneCondition<T extends QueryParameter> = BooleanOperation<
    ZoneConditionOperand<T>
>;
export type ZoneConditionOperand<T extends QueryParameter> = {
    type?: ZoneType | ZoneType[];
    owner?: PlayerCondition<T>;
};

export function isZoneCondition(
    arg: unknown,
): arg is ZoneCondition<QueryParameter> {
    // TODO:
    return false;
}
export function isZoneConditionOperand(
    arg: unknown,
): arg is ZoneConditionOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
/** 領域のクエリ */
export type ZoneQuery<T extends QueryParameter> = SetOperation<
    ZoneQueryOperand<T>
>;
export type ZoneQueryOperand<T extends QueryParameter> =
    | Zone
    | Zone[]
    | { card: CardQuery<T> } // カードが置かれている領域
    | ZoneCondition<T>;
// カードが直前に置かれていた領域とか必要になるかも

export function isZoneQuery(arg: unknown): arg is ZoneQuery<QueryParameter> {
    // TODO:
    return false;
}
export function isZoneQueryOperand(
    arg: unknown,
): arg is ZoneQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
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
