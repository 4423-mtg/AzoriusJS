import type {
    CardName,
    Characteristics,
    CopiableValue,
    RuleText,
} from "../Characteristics/Characteristic.js";
import type { CounterOnObject } from "../GameObject/Counter.js";
import type { Marker } from "../GameObject/Marker.js";
import type { Sticker } from "../GameObject/Sticker.js";
import type { SetElementCondition, SetQuery } from "./SetQuery.js";
import type {
    ManaCostQuery,
    NumberCondition,
    NumberQuery,
} from "./NumberQuery.js";
import type { BooleanOperation, QueryParameter } from "./Query.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type { Color } from "../Characteristics/Color.js";
import type { CardType } from "../Characteristics/CardType.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Card } from "../GameObject/Card/Card.js";

// =================================================================
// MARK: CopiableValue
// =================================================================

// TODO: 呪文の場合
export type CopiableValueCondition<T extends QueryParameter> =
    BooleanOperation<{
        name?: SetElementCondition<CardName, T>; // TODO: nameが複数あるケースが有る
        manaCost?: NumberCondition<T>;
        colorIdentity?: SetElementCondition<Color, T>; // TODO: 複数ある
        cardTypes?: SetElementCondition<CardType, T>; // TODO: 複数ある
        subtypes?: SetElementCondition<Subtype, T>; // TODO: 複数ある
        supertypes?: SetElementCondition<Supertype, T>; // TODO: 複数ある
        text?: SetElementCondition<RuleText, T>;
        power?: NumberCondition<T>;
        toughness?: NumberCondition<T>;
        loyalty?: NumberCondition<T>;
    }>;
export type CopiableValueQuery<T extends QueryParameter> =
    // 固定値
    | CopiableValue
    | {
          name: SetQuery<CardName, T>;
          manaCost: ManaCostQuery<T>; // FIXME:
          colorIdentity: SetQuery<Color, T>;
          cardTypes: SetQuery<CardType, T>;
          subtypes: SetQuery<Subtype, T>;
          supertypes: SetQuery<Supertype, T>;
          text: SetQuery<RuleText, T>; // FIXME:
          power: NumberQuery<T>;
          toughness: NumberQuery<T>;
          loyalty: NumberQuery<T>;
      }
    // 参照
    | { object: SetQuery<GameObject, T> } // FIXME: 1つだけ欲しい場合は？
    // 修整
    | {
          original: CopiableValueQuery<T>;
          overwrite?: Partial<CopiableValueQuery<T>>;
          add?: Partial<CopiableValueQuery<T>>;
      };
export function getQueryParameterOfCopiableQuery(
    query: CopiableValueQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: Characteristics
// FIXME:
export type CharacteristicsCondition<
    T extends QueryParameter = QueryParameter,
> = BooleanOperation<{
    name?: SetElementCondition<CardName, T>;
    manaCost?: NumberCondition<T>;
    color?: SetElementCondition<Color, T>;
    cardType?: SetElementCondition<CardType, T>;
    subtype?: SetElementCondition<Subtype, T>;
    supertype?: SetElementCondition<Supertype, T>;
    text?: SetElementCondition<RuleText, T>; // FIXME:
    ability?: SetElementCondition<Ability, T>; // FIXME:
    power?: NumberCondition<T>;
    toughness?: NumberCondition<T>;
    loyalty?: NumberCondition<T>;
    defense?: NumberCondition<T>;
    handModifier?: NumberCondition<T>;
    lifeModifier?: NumberCondition<T>;
}>;
export type CharacteristicsQuery<T extends QueryParameter = QueryParameter> =
    | Characteristics
    | { card: SetQuery<Card, T> }; // FIXME: oneOf? merge?

export function getQueryParameterOfCharacteristicsQuery(
    query: CharacteristicsQuery,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: Face
export type FaceCondition<T extends QueryParameter> = BooleanOperation<{}>;
export type FaceQuery<T extends QueryParameter> = BooleanOperation<{
    front?: {
        printed?: CharacteristicsCondition<T>;
        charcteristics?: CharacteristicsCondition<T>;
    };
    back?: {
        printed?: CharacteristicsCondition<T>;
        charcteristics?: CharacteristicsCondition<T>;
    };
}>;

export function getQueryParameterOfFaceQuery(
    query: FaceQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: Status
export type StatusCondition<T extends QueryParameter> = {
    tapped?: boolean;
    flipped?: boolean;
    isFaceDown?: boolean;
    isPhasedOut?: boolean;
};
export type StatusQuery<T extends QueryParameter> = BooleanOperation<
    StatusCondition<T>
>;
export function getQueryParameterOfStatusQuery(
    query: StatusQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: Counter
export type CounterCondition<T extends QueryParameter> = CounterOnObject[];
export type CounterQuery<T extends QueryParameter> = BooleanOperation<
    CounterCondition<T>
>;
export function getQueryParameterOfCounterQuery(
    query: CounterQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: Marker
export type MarkerCondition<T extends QueryParameter> = BooleanOperation<{}>;
export type MarkerQuery<T extends QueryParameter> = BooleanOperation<Marker[]>;
export function getQueryParameterOfMarkerQuery(
    query: MarkerQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
//
//

// =================================================================
// MARK: Sticker
export type StickerCondition<T extends QueryParameter> = BooleanOperation<{}>;
export type StickerQuery<T extends QueryParameter> = BooleanOperation<
    Sticker[]
>;
export function getQueryParameterOfStickerQuery(
    query: StickerQuery<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}

// =================================================================
// MARK: 型ガード
export function isCopiableValueCondition(
    arg: unknown,
): arg is CopiableValueCondition {
    // TODO:
    return false;
}

export function isCopiableValueQuery(arg: unknown): arg is CopiableValueQuery {
    // TODO:
    return false;
}

export function isCharacteristicsCondition(
    arg: unknown,
): arg is CharacteristicsCondition {
    // TODO:
    return false;
}
export function isCharacteristicsQuery(
    arg: unknown,
): arg is CharacteristicsQuery {
    // TODO:
    return false;
}

export function isFaceCondition(arg: unknown): arg is FaceCondition {
    // TODO:
    return false;
}
export function isFaceQuery(arg: unknown): arg is FaceQuery {
    // TODO:
    return false;
}

export function isStatusCondition(arg: unknown): arg is StatusCondition {
    // TODO:
    return false;
}
export function isStatusQuery(arg: unknown): arg is StatusQuery {
    // TODO:
    return false;
}

export function isCounterCondition(arg: unknown): arg is CounterCondition {
    // TODO:
    return false;
}
export function isCounterQuery(arg: unknown): arg is CounterQuery {
    // TODO:
    return false;
}

export function isMarkerCondition(arg: unknown): arg is MarkerCondition {
    // TODO:
    return false;
}
export function isMarkerQuery(arg: unknown): arg is MarkerQuery {
    // TODO:
    return false;
}

export function isStickerCondition(arg: unknown): arg is StickerCondition {
    // TODO:
    return false;
}
export function isStickerQuery(arg: unknown): arg is StickerQuery {
    // TODO:
    return false;
}
