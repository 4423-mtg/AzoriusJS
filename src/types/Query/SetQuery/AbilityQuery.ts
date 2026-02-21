import type { Ability } from "../../GameObject/Ability.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { SetElementCondition } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type { SetQuery } from "../SetQuery.js";

export type AbilityConditionOperand<T extends QueryParameter> =
    | {
          type: "oneOf" | "allOf" | "equal";
          abilities: SetQuery<Ability, T>;
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
export type AbilityQueryOperand<T extends QueryParameter> =
    | Ability
    | Ability[]
    | { cards: SetQuery<Card, T> } // カードの能力
    | {
          abilities: SetQuery<Ability, T>;
          condition?: SetElementCondition<Ability, T>; // 指定した条件を満たすもの
      };

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
