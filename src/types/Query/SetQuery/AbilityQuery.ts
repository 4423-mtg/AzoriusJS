import type { Ability } from "../../GameObject/Ability.js";
import type { BooleanOperation, SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetOperation } from "../SetQuery.js";
import type { CardQuery } from "./CardQuery.js";

// =================================================================
export type AbilityCondition<T extends QueryParameter> = BooleanOperation<
    AbilityConditionOperand<T>
>;

export type AbilityConditionOperand<T extends QueryParameter> =
    | {
          type: "oneOf" | "allOf" | "equal";
          abilities: AbilityQuery<T>;
      }
    | {
          keyword:
              | "flying"
              | "protection"
              | "hexproof"
              | "trample"
              | "devour"
              | "affinity"
              | "equip";
      }; // TODO:

// =================================================================
export type AbilityQuery<T extends QueryParameter> = SetOperation<
    AbilityQueryOperand<T>
>;
export type AbilityQueryOperand<T extends QueryParameter> =
    | Ability
    | Ability[]
    | { cards: CardQuery<T> } // カードの能力
    | {
          abilities: AbilityQuery<T>;
          condition?: SetElementCondition<Ability, T>; // 指定した条件を満たすもの
      };

// =================================================================
export function getQueryParameterOfAbilityConditionOperand(
    operand: AbilityConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfAbilityQueryOperand(
    operand: AbilityQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isAbilityConditionOperand(
    arg: unknown,
): arg is AbilityConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isAbilityQueryOperand(
    arg: unknown,
): arg is AbilityQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
