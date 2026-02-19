import type { Card, Status } from "../../GameObject/Card/Card.js";
import type { GameObject } from "../../GameObject/GameObject.js";
import type { Player } from "../../GameObject/Player.js";
import type {
    CounterQuery,
    FaceQuery,
    MarkerQuery,
    StickerQuery,
} from "../ObjectQuery.js";
import type { QueryParameter } from "../Query.js";
import type { ScalarQuery } from "../ScalarQuery.js";
import type { SetElementCondition, SetQuery } from "../SetQuery.js";

// FIXME: 継続的効果は一般に GameObject 全般に効果を及ぼすが、
// 特性を変更する効果は Card にのみ影響するので、 CardQuery を指定したい場合が有る
export type CardConditionOperand<T extends QueryParameter> = {
    face?: FaceQuery<T>;
    owner?: SetQuery<Player, T>;
    controller?: SetQuery<Player, T>;
    characteristics?: CharacteristicsCondition<T>;
    status?: ScalarQuery<Status, T>;
    isToken?: boolean; // FIXME: booleanQuery
    isDoubleFaced?: boolean; // ?
    currentFace?: number; // FIXME: "front" | "back"
    counters?: CounterQuery<T>;
    markers?: MarkerQuery<T>;
    stickers?: StickerQuery<T>;
    manaValue?: NumberCondition<T>; // ここでいいのか？
};

export type CardQueryOperand<T extends QueryParameter> =
    | (SetElementCondition<GameObject, T> & SetElementCondition<Card, T>)
    | {
          argument: string;
      };
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
