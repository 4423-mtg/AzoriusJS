import type { NumericalValue } from "../Characteristics/Characteristic.js";
import type { ManaSymbol } from "../Characteristics/Symbol.js";
import type { CardQuery, ColorQuery, GameObjectQuery } from "./SetQuery.js";
import type { CounterCondition } from "./ObjectQuery.js";
import type {
    BooleanOperation,
    QueryParameter,
    QueryParameterNameOfSpecificType,
} from "./Query.js";

// =================================================================
// MARK: Number
export type NumberCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<
        | NumberQuery<T>
        | {
              type: "greater" | "less" | "greaterEqual" | "lessEqual";
              number: NumberQuery<T>;
          }
    >;

export type NumberReference<T extends QueryParameter = QueryParameter> =
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
export type NumberQuery<T extends QueryParameter = QueryParameter> =
    | NumberReference<T>
    // 引数
    | { argument: QueryParameterNameOfSpecificType<T, "number"> }
    // 何かの合計値
    | {
          valueType: "total";
          values: NumberQuery<T>[];
      }
    | {
          valueType: "difference";
          value1: NumberQuery<T>;
          value2: NumberQuery<T>;
      };

export function getQueryParameterOfNumberQuery(
    query: NumberQuery,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: ManaCostQuery
export type ManaCostCondition<T extends QueryParameter = QueryParameter> =
    ManaCostQuery<T>;
export type ManaCostQuery<T extends QueryParameter = QueryParameter> =
    | ManaSymbol[]
    | { card: CardQuery<T> };
//

export function getQueryParameterOfManaCostQuery(
    query: ManaCostQuery,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: 型ガード
export function isNumberCondition(arg: unknown): arg is NumberCondition {
    // TODO:
    return false;
}
export function isNumberReference(arg: unknown): arg is NumberReference {
    // TODO:
    return false;
}
export function isNumberQuery(arg: unknown): arg is NumberQuery {
    // TODO:
    return false;
}

export function isManaCostCondition(arg: unknown): arg is ManaCostCondition {
    // TODO:
    return false;
}
export function isManaCostQuery(arg: unknown): arg is ManaCostQuery {
    // TODO:
    return false;
}
