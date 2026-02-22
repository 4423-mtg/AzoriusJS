import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { CharacteristicsCondition } from "../ScalarQuery/CharacteristicsQuery.js";
import type { CounterQuery } from "../ScalarQuery/CounterOnObjectQuery.js";
import type { MarkerQuery } from "../ScalarQuery/MarkerQuery.js";
import type { NumericalValueCondition } from "../ScalarQuery/NumericalValueQuery.js";
import type { StatusCondition } from "../ScalarQuery/StatusQuery.js";
import type { StickerQuery } from "../ScalarQuery/StickerQuery.js";
import type { SetOperation } from "../SetQuery.js";
import type { FaceCondition } from "./FaceQuery.js";
import type { GameObjectCondition } from "./GameObjectQuery.js";
import type { PlayerCondition } from "./PlayerQuery.js";

// =================================================================
export type CardCondition<T extends QueryParameter> = BooleanOperation<
    CardConditionOperand<T>
>;

// FIXME: 継続的効果は一般に GameObject 全般に効果を及ぼすが、
// 特性を変更する効果は Card にのみ影響するので、 CardQuery を指定したい場合が有る
export type CardConditionOperand<T extends QueryParameter> = {
    face?: FaceCondition<T>;
    owner?: PlayerCondition<T>;
    controller?: PlayerCondition<T>;
    characteristics?: CharacteristicsCondition<T>;
    status?: StatusCondition<T>;
    isToken?: boolean; // FIXME: booleanQuery
    isDoubleFaced?: boolean; // ?
    currentFace?: number; // FIXME: "front" | "back"
    counters?: CounterQuery<T>;
    markers?: MarkerQuery<T>;
    stickers?: StickerQuery<T>;
    manaValue?: NumericalValueCondition<T>; // ここでいいのか？
}; // {} を除外しなくていいのか？

// =================================================================
export type CardQuery<T extends QueryParameter> = SetOperation<
    CardQueryOperand<T>
>;
export type CardQueryOperand<T extends QueryParameter> =
    | (GameObjectCondition<T> & CardCondition<T>)
    | {
          argument: string;
      };

// =================================================================
export function getQueryParameterOfCardConditionOperand(
    operand: CardConditionOperand<QueryParameter>,
): QueryParameter {
    return {};
}

export function getQueryParameterOfCardQueryOperand(
    operand: CardQueryOperand<QueryParameter>,
): QueryParameter {
    return {};
}
export function isCardConditionOperand(
    arg: unknown,
): arg is CardConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isCardQueryOperand(
    arg: unknown,
): arg is CardQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
