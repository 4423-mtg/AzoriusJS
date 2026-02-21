import type {
    Characteristics,
    NumericalValue,
} from "../../Characteristics/Characteristic.js";
import type { Card, Face, Status } from "../../GameObject/Card/Card.js";
import type { GameObject } from "../../GameObject/GameObject.js";
import type { Player } from "../../GameObject/Player.js";
import type { Condition, SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { CounterQuery } from "../ScalarQuery/CounterOnObjectQuery.js";
import type { MarkerQuery } from "../ScalarQuery/MarkerQuery.js";
import type { StickerQuery } from "../ScalarQuery/StickerQuery.js";

// FIXME: 継続的効果は一般に GameObject 全般に効果を及ぼすが、
// 特性を変更する効果は Card にのみ影響するので、 CardQuery を指定したい場合が有る
export type CardConditionOperand<T extends QueryParameter> = {
    face?: SetElementCondition<Face, T>;
    owner?: SetElementCondition<Player, T>;
    controller?: SetElementCondition<Player, T>;
    characteristics?: Condition<Characteristics, T>;
    status?: Condition<Status, T>;
    isToken?: boolean; // FIXME: booleanQuery
    isDoubleFaced?: boolean; // ?
    currentFace?: number; // FIXME: "front" | "back"
    counters?: CounterQuery<T>;
    markers?: MarkerQuery<T>;
    stickers?: StickerQuery<T>;
    manaValue?: Condition<NumericalValue, T>; // ここでいいのか？
}; // {} を除外しなくていいのか？

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
