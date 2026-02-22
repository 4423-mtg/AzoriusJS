import type { NumericalValue } from "../../Characteristics/Characteristic.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { CardQuery } from "../SetQuery/CardQuery.js";
import type { ColorQuery } from "../SetQuery/ColorQuery.js";
import type { GameObjectQuery } from "../SetQuery/GameObjectQuery.js";
import type { CounterCondition } from "./CounterOnObjectQuery.js";
import type { BooleanOperation } from "../Condition.js";
import type { PlayerQuery } from "../SetQuery/PlayerQuery.js";

// =================================================================
/** 数に対して適用する条件 */
export type NumericalValueCondition<T extends QueryParameter> =
    BooleanOperation<NumericalValueConditionOperand<T>>;

export type NumericalValueConditionOperand<T extends QueryParameter> =
    | NumericalValueQuery<T>
    | {
          type: "greater" | "less" | "greaterEqual" | "lessEqual";
          number: NumericalValueQuery<T>;
      };

/**  */

// =================================================================
/** クエリ */
export type NumericalValueQuery<T extends QueryParameter> =
    NumericalOperation<T>;

export type NumericalValueReference<T extends QueryParameter> =
    // TODO: GameObject (Spellなど) 対象の数など
    | NumericalValue
    | {
          valueType:
              | "manaValue" // マナシンボルの数とかも要るのだろうか
              | "numberOfColors"
              | "numberOfCardTypes"
              | "numberOfSubypes"
              | "numberOfSupertypes"
              | "numberOfAbilities"
              | "power"
              | "toughness"
              | "loyalty"
              | "defense"
              | "handModifier"
              | "lifeModifier";
          card: CardQuery<T>;
      }
    | {
          valueType: "devotion";
          card: CardQuery<T>;
          colors: ColorQuery<T>;
      }
    // オブジェクトの個数
    | { valueType: "numberOfObject"; objects: GameObjectQuery<T> }
    // カウンターの数
    | {
          valueType: "numberOfCounter";
          objects: CardQuery<T> | PlayerQuery<T>;
          kindOfCounter?: CounterCondition<T>;
      }
    // ライフ
    | {
          valueType: "life";
          player: PlayerQuery<T>;
      }
    // 履歴 このターンに〇〇した数など TODO:
    | { valueType: "stormCount" };

export type NumericalValueQueryOperand<T extends QueryParameter> =
    | NumericalValueReference<T>
    // 引数
    | { argument: string };

// =================================================================
export function getQueryParameterOfNumericalValueQueryOperand(
    arg: NumericalValueQueryOperand<QueryParameter>,
): QueryParameter {
    return {};
}

export function getQueryParameterOfNumericalValueConditionOperand(
    query: NumericalValueConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: NumericalOperation
// =================================================================
// 加減の切り上げ切り捨て、切り上げ切り捨ての加減は2段までサポートする
export type NumericalOperation<T extends QueryParameter> =
    | NumericalValueQueryOperand<T>
    | {
          plus: (
              | NumericalValueQueryOperand<T>
              | {
                    operation: "roundDown" | "roundUp";
                    value: NumericalValueQueryOperand<T>;
                }
          )[];
          minus: (
              | NumericalValueQueryOperand<T>
              | {
                    operation: "roundDown" | "roundUp";
                    value: NumericalValueQueryOperand<T>;
                }
          )[];
      }
    | {
          operation: "roundDown" | "roundUp"; // 半分（切り捨て・切り上げ）
          value:
              | NumericalValueQueryOperand<T>
              | {
                    plus: NumericalValueQueryOperand<T>[];
                    minus: NumericalValueQueryOperand<T>[];
                };
      };
// a + (b + c) = a + b + c
// a + (b - c) = a + b - c
// a - (b + c) = a - b - c
// a - (b - c) = a - b + c

// =================================================================
// MARK: 型ガード
export function isNumericalValueConditionOperand(
    arg: unknown,
): arg is NumericalValueConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isNumericalValueReference(
    arg: unknown,
): arg is NumericalValueReference<QueryParameter> {
    // TODO:
    return false;
}
export function isNumericalValueQueryOperand(
    arg: unknown,
): arg is NumericalValueQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
