import type { BooleanOperation } from "../Condition.js";
import type { QueryParameter } from "../QueryParameter.js";
import type {
    CardNameCondition,
    CardNameQuery,
} from "../SetQuery/CardNameQuery.js";
import type {
    CardTypeCondition,
    CardTypeQuery,
} from "../SetQuery/CardTypeQuery.js";
import type { ColorCondition, ColorQuery } from "../SetQuery/ColorQuery.js";
import type { GameObjectQuery } from "../SetQuery/GameObjectQuery.js";
import type {
    RuleTextCondition,
    RuleTextQuery,
} from "../SetQuery/RuleTextQuery.js";
import type {
    SubtypeCondition,
    SubtypeQuery,
} from "../SetQuery/SubtypeQuery.js";
import type {
    SupertypeCondition,
    SupertypeQuery,
} from "../SetQuery/SupertypeQuery.js";
import type { ManaCostCondition, ManaCostQuery } from "./ManaCostQuery.js";
import type {
    NumericalValueCondition,
    NumericalValueQuery,
} from "./NumericalValueQuery.js";

// ===================================================================
/** コピー可能な値の条件 */
export type CopiableValueCondition<T extends QueryParameter> = BooleanOperation<
    CopiableValueConditionOperand<T>
>;

// TODO: 呪文の場合
export type CopiableValueConditionOperand<T extends QueryParameter> = {
    name?: CardNameCondition<T>;
    manaCost?: ManaCostCondition<T>;
    colorIdentity?: ColorCondition<T>;
    cardTypes?: CardTypeCondition<T>;
    subtypes?: SubtypeCondition<T>;
    supertypes?: SupertypeCondition<T>;
    text?: RuleTextCondition<T>;
    power?: NumericalValueCondition<T>;
    toughness?: NumericalValueCondition<T>;
    loyalty?: NumericalValueCondition<T>;
};

export function isCopiableValueCondition(
    arg: unknown,
): arg is CopiableValueCondition<QueryParameter> {
    return false;
}
export function isCopiableValueConditionOperand(
    arg: unknown,
): arg is CopiableValueConditionOperand<QueryParameter> {
    return false;
}

// ===================================================================
/** コピー可能な値のクエリ */
export type CopiableValueQuery<T extends QueryParameter> =
    CopiableValueQueryOperand<T>; // FIXME: マージはここで演算として入れる

export type _q<T extends QueryParameter> = {
    // FIXME: どうせここでCopiableValueのプロパティを名指ししているので、
    // overwriteについても名指しでいいか？
    // プロパティの値の型を見てジェネリクスする手もある
    name: CardNameQuery<T>;
    manaCost: ManaCostQuery<T>;
    colorIdentity: ColorQuery<T>;
    cardTypes: CardTypeQuery<T>;
    subtypes: SubtypeQuery<T>;
    supertypes: SupertypeQuery<T>;
    text: RuleTextQuery<T>;
    power: NumericalValueQuery<T>;
    toughness: NumericalValueQuery<T>;
    loyalty: NumericalValueQuery<T>;
};

// TODO: 呪文の場合
export type CopiableValueQueryOperand<T extends QueryParameter> =
    | _q<T>
    // 参照
    | { object: GameObjectQuery<T> } // 1つだけ欲しい場合は？
    // 部分的な修整
    | {
          original: CopiableValueQuery<T>;
          overwrite?: Partial<_q<T>>; // FIXME: Partialが困る
          add?: Partial<_q<T>>;
          exclude?: Partial<_q<T>>;
      };

export function isCopiableValueQuery(
    arg: unknown,
): arg is CopiableValueQuery<QueryParameter> {
    return false;
}
export function isCopiableValueQueryOperand(
    arg: unknown,
): arg is CopiableValueQueryOperand<QueryParameter> {
    return false;
}

// ===================================================================
export function getQueryParameterOfCopiableValueConditionOperand(
    query: CopiableValueConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfCopiableValueQueryOperand(
    query: CopiableValueQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
