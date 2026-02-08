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
export type MarkerQuery<T extends QueryParameter> = BooleanOperation<Marker[]>;
//
//

// =================================================================
// MARK: Sticker
export type StickerQuery<T extends QueryParameter> = BooleanOperation<
    Sticker[]
>;
