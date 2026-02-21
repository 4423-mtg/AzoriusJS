import type { NumericalValue } from "../../Characteristics/Characteristic.js";
import type { Color } from "../../Characteristics/Color.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { GameObject } from "../../GameObject/GameObject.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { ScalarQuery } from "../ScalarQuery.js";
import type { SetQuery } from "../SetQuery.js";
import type { CounterCondition } from "./CounterOnObjectQuery.js";

/** 数に対して適用する条件 */
export type NumericalValueConditionOperand<T extends QueryParameter> =
    | ScalarQuery<NumericalValue, T>
    | {
          type: "greater" | "less" | "greaterEqual" | "lessEqual";
          number: ScalarQuery<NumericalValue, T>;
      };

/**  */
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
          card: SetQuery<Card, T>;
      }
    | {
          valueType: "devotion";
          card: SetQuery<Card, T>;
          colors: SetQuery<Color, T>;
      }
    // オブジェクトの個数
    | { valueType: "numberOfObject"; objects: SetQuery<GameObject, T> }
    // カウンターの数
    | {
          valueType: "numberOfCounter";
          objects: SetQuery<Card, T>;
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
          values: ScalarQuery<NumericalValue, T>[];
      }
    | {
          valueType: "difference";
          value1: ScalarQuery<NumericalValue, T>;
          value2: ScalarQuery<NumericalValue, T>;
      };

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
