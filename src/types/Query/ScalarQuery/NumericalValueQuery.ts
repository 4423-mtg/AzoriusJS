import type { NumericalValue } from "../../Characteristics/Characteristic.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { CardQuery } from "../SetQuery/CardQuery.js";
import type { ColorQuery } from "../SetQuery/ColorQuery.js";
import type { GameObjectQuery } from "../SetQuery/GameObjectQuery.js";
import type { CounterCondition } from "./CounterOnObjectQuery.js";
import type { BooleanOperation } from "../Condition.js";

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
export type NumericalValueQuery<T extends QueryParameter> =
    NumericalValueQueryOperand<T>;

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
          objects: CardQuery<T>;
          kindOfCounter?: CounterCondition<T>;
      }
    // 履歴 このターンに〇〇した数など TODO:
    | { valueType: "stormCount" };
export type NumericalValueQueryOperand<T extends QueryParameter> =
    | NumericalValueReference<T>
    // 引数
    | { argument: string }
    // 何かの合計値
    | {
          valueType: "total";
          values: NumericalValueQuery<T>[];
      }
    | {
          valueType: "difference";
          value1: NumericalValueQuery<T>;
          value2: NumericalValueQuery<T>;
      };

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
