import type {
    Characteristics,
    CopiableValue,
} from "../Characteristics/Characteristic.js";
import type { CounterOnObject } from "../GameObject/Counter.js";
import type { Marker } from "../GameObject/Marker.js";
import type { Sticker } from "../GameObject/Sticker.js";
import type {
    AbilityQuery,
    CardNameCondition,
    CardNameQuery,
    CardQuery,
    CardTypeCondition,
    CardTypeQuery,
    ColorCondition,
    ColorQuery,
    GameObjectQuery,
    SubtypeCondition,
    SubtypeQuery,
    SupertypeCondition,
    SupertypeQuery,
    TextQuery,
} from "./ArrayQuery.js";
import type {
    ManaCostCondition,
    ManaCostQuery,
    NumberCondition,
    NumberQuery,
} from "./NumberQuery.js";
import type { BooleanOperation, QueryParameter } from "./Query.js";

// =================================================================
// MARK: CopiableValue
// TODO: 呪文の場合
export type CopiableValueCondition<T extends QueryParameter> =
    BooleanOperation<{
        name?: CardNameCondition<T>;
        manaCost?: ManaCostCondition<T>;
        colorIdentity?: ColorCondition<T>;
        cardTypes?: CardTypeCondition<T>;
        subtypes?: SubtypeCondition<T>;
        supertypes?: SupertypeCondition<T>;
        text?: TextQuery<T>; // FIXME:
        power?: NumberCondition<T>;
        toughness?: NumberCondition<T>;
        loyalty?: NumberCondition<T>;
    }>;
export type CopiableValueQuery<T extends QueryParameter> =
    // 固定値
    | CopiableValue
    | {
          name: CardNameQuery<T>;
          manaCost: ManaCostQuery<T>;
          colorIdentity: ColorQuery<T>;
          cardTypes: CardTypeQuery<T>;
          subtypes: SubtypeQuery<T>;
          supertypes: SupertypeQuery<T>;
          text: TextQuery<T>; // FIXME:
          power: NumberQuery<T>;
          toughness: NumberQuery<T>;
          loyalty: NumberQuery<T>;
      }
    // 参照
    | { object: GameObjectQuery<T> }
    // 修整
    | {
          original: CopiableValueQuery<T>;
          overwrite?: Partial<CopiableValueQuery<T>>;
          add?: Partial<CopiableValueQuery<T>>;
      };

// =================================================================
// MARK: Characteristics
// FIXME:
export type CharacteristicsCondition<T extends QueryParameter> =
    BooleanOperation<{
        name?: CardNameCondition<T>;
        manaCost?: ManaCostCondition<T>;
        color?: ColorCondition<T>;
        cardType?: CardTypeCondition<T>;
        subtype?: SubtypeCondition<T>;
        supertype?: SupertypeCondition<T>;
        text?: TextQuery<T>; // FIXME:
        ability?: AbilityQuery<T>; // FIXME:
        power?: NumberCondition<T>;
        toughness?: NumberCondition<T>;
        loyalty?: NumberCondition<T>;
        defense?: NumberCondition<T>;
        handModifier?: NumberCondition<T>;
        lifeModifier?: NumberCondition<T>;
    }>;
export type CharacteristicsQuery<T extends QueryParameter> =
    | Characteristics
    | { card: CardQuery<T> }; // FIXME: oneOf? merge?

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

// =================================================================
// MARK: Counter
export type CounterCondition<T extends QueryParameter> = CounterOnObject[];
export type CounterQuery<T extends QueryParameter> = BooleanOperation<
    CounterCondition<T>
>;

// =================================================================
// MARK: Marker
export type MarkerCondition<T extends QueryParameter> = BooleanOperation<{}>;
export type MarkerQuery<T extends QueryParameter> = BooleanOperation<Marker[]>;
//
//

// =================================================================
// MARK: Sticker
export type StickerCondition<T extends QueryParameter> = BooleanOperation<{}>;
export type StickerQuery<T extends QueryParameter> = BooleanOperation<
    Sticker[]
>;

// =================================================================
// MARK: 型ガード
export function isCopiableValueCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CopiableValueCondition<T> {
    // TODO:
    return false;
}

export function isCopiableValueQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CopiableValueQuery<T> {
    // TODO:
    return false;
}

export function isCharacteristicsCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CharacteristicsCondition<T> {
    // TODO:
    return false;
}
export function isCharacteristicsQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CharacteristicsQuery<T> {
    // TODO:
    return false;
}

export function isFaceCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is FaceCondition<T> {
    // TODO:
    return false;
}
export function isFaceQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is FaceQuery<T> {
    // TODO:
    return false;
}

export function isStatusCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is StatusCondition<T> {
    // TODO:
    return false;
}
export function isStatusQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is StatusQuery<T> {
    // TODO:
    return false;
}

export function isCounterCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CounterCondition<T> {
    // TODO:
    return false;
}
export function isCounterQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CounterQuery<T> {
    // TODO:
    return false;
}

export function isMarkerCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is MarkerCondition<T> {
    // TODO:
    return false;
}
export function isMarkerQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is MarkerQuery<T> {
    // TODO:
    return false;
}

export function isStickerCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is StickerCondition<T> {
    // TODO:
    return false;
}
export function isStickerQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is StickerQuery<T> {
    // TODO:
    return false;
}
