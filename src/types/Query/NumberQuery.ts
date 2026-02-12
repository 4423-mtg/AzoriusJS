import type { NumericalValue } from "../Characteristics/Characteristic.js";
import type { ManaSymbol } from "../Characteristics/Symbol.js";
import type { CardQuery, ColorQuery, GameObjectQuery } from "./ArrayQuery.js";
import type { CounterCondition } from "./ObjectQuery.js";
import type {
    BooleanOperation,
    QueryParameter,
    QueryParameterNameOfSpecificType,
} from "./Query.js";

// =================================================================
// MARK: Number
export type NumberCondition<T extends QueryParameter> = BooleanOperation<
    | NumberQuery<T>
    | {
          type: "greater" | "less" | "greaterEqual" | "lessEqual";
          number: NumberQuery<T>;
      }
>;

export type NumberReference<T extends QueryParameter> =
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
export type NumberQuery<T extends QueryParameter> =
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

// =================================================================
// MARK: ManaCostQuery
export type ManaCostCondition<T extends QueryParameter> = ManaCostQuery<T>;
export type ManaCostQuery<T extends QueryParameter> =
    | ManaSymbol[]
    | { card: CardQuery<T> };
//

export function isNumberCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is NumberCondition<T> {
    // TODO:
    return false;
}
export function isNumberReference<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is NumberReference<T> {
    // TODO:
    return false;
}
export function isNumberQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is NumberQuery<T> {
    // TODO:
    return false;
}

export function isManaCostCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is ManaCostCondition<T> {
    // TODO:
    return false;
}
export function isManaCostQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is ManaCostQuery<T> {
    // TODO:
    return false;
}
