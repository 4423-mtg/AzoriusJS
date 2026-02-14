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
export type ObjectQuery<T extends QueryParameter = QueryParameter> =
    | CopiableValueQuery<T>
    | CharacteristicsQuery<T>
    | FaceQuery<T>
    | StatusQuery<T>
    | CounterQuery<T>
    | MarkerQuery<T>
    | StickerQuery<T>;

// =================================================================
// MARK: CopiableValue
// TODO: 呪文の場合
export type CopiableValueCondition<T extends QueryParameter = QueryParameter> =
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
export type CopiableValueQuery<T extends QueryParameter = QueryParameter> =
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
export type CharacteristicsCondition<
    T extends QueryParameter = QueryParameter,
> = BooleanOperation<{
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
export type CharacteristicsQuery<T extends QueryParameter = QueryParameter> =
    | Characteristics
    | { card: CardQuery<T> }; // FIXME: oneOf? merge?

// =================================================================
// MARK: Face
export type FaceCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<{}>;
export type FaceQuery<T extends QueryParameter = QueryParameter> =
    BooleanOperation<{
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
export type StatusCondition<T extends QueryParameter = QueryParameter> = {
    tapped?: boolean;
    flipped?: boolean;
    isFaceDown?: boolean;
    isPhasedOut?: boolean;
};
export type StatusQuery<T extends QueryParameter = QueryParameter> =
    BooleanOperation<StatusCondition<T>>;

// =================================================================
// MARK: Counter
export type CounterCondition<T extends QueryParameter = QueryParameter> =
    CounterOnObject[];
export type CounterQuery<T extends QueryParameter = QueryParameter> =
    BooleanOperation<CounterCondition<T>>;

// =================================================================
// MARK: Marker
export type MarkerCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<{}>;
export type MarkerQuery<T extends QueryParameter = QueryParameter> =
    BooleanOperation<Marker[]>;
//
//

// =================================================================
// MARK: Sticker
export type StickerCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<{}>;
export type StickerQuery<T extends QueryParameter = QueryParameter> =
    BooleanOperation<Sticker[]>;

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
