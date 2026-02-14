import type { CardType } from "../Characteristics/CardType.js";
import type { CardName } from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Player } from "../GameObject/Player.js";
import type { PlayerInfo } from "../GameState/Match.js";
import type { Zone, ZoneType } from "../GameState/Zone.js";
import type { NumberCondition } from "./NumberQuery.js";
import type {
    CharacteristicsCondition,
    CounterQuery,
    FaceQuery,
    MarkerQuery,
    StatusQuery,
    StickerQuery,
} from "./ObjectQuery.js";
import type {
    _Difference,
    _Intersection,
    BooleanOperation,
    QueryParameter,
    QueryParameterNameOfSpecificType,
    SetOperation,
} from "./Query.js";

// =================================================================
export type ArrayQuery<T extends QueryParameter = QueryParameter> =
    | GameObjectQuery<T>
    | CardQuery<T>
    | PlayerQuery<T>
    | CardNameQuery<T>
    | CardTypeQuery<T>
    | SubtypeQuery<T>
    | SupertypeQuery<T>
    | ColorQuery<T>
    | ZoneQuery<T>
    | AbilityQuery<T>
    | TextQuery<T>;

// =================================================================
// MARK: GameObject
export type GameObjectCondition<T extends QueryParameter = QueryParameter> = {
    zone: ZoneQuery<T>;
};
export type GameObjectQuery<T extends QueryParameter = QueryParameter> =
    SetOperation<
        | GameObjectCondition<T>
        | {
              argument: QueryParameterNameOfSpecificType<
                  T,
                  "gameObject" | "card"
              >;
          }
    >;
// GameObjectQuery -> SetOperation -> GameObjectCondition | {argument: string}

// =================================================================
// MARK: Card
// FIXME: 継続的効果は一般に GameObject 全般に効果を及ぼすが、
// 特性を変更する効果は Card にのみ影響するので、 CardQuery を指定したい場合が有る
export type CardCondition<T extends QueryParameter = QueryParameter> = {
    face?: FaceQuery<T>;
    owner?: PlayerQuery<T>;
    controller?: PlayerQuery<T>;
    characteristics?: CharacteristicsCondition<T>;
    status?: StatusQuery<T>;
    isToken?: boolean; // FIXME: booleanQuery
    isDoubleFaced?: boolean; // ?
    currentFace?: number; // FIXME: "front" | "back"
    counters?: CounterQuery<T>;
    markers?: MarkerQuery<T>;
    stickers?: StickerQuery<T>;
    manaValue?: NumberCondition<T>; // ここでいいのか？
};
export type CardQuery<T extends QueryParameter = QueryParameter> = SetOperation<
    | (GameObjectCondition<T> & CardCondition<T>)
    | {
          argument: QueryParameterNameOfSpecificType<T, "card">;
      }
>;

// =========================================================
// MARK: Player
export type PlayerCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<
        | Player
        | { type: "oneOf"; player: PlayerQuery<T> }
        | {
              type: "owner" | "controller";
              object: GameObjectQuery<T>;
          }
        | {
              type: "opponent" | "teamMate";
              player: PlayerQuery<T>;
          }
        | { type: "isMonarch" | "startingPlayer" }
    >;
type PlayerReference<T extends QueryParameter = QueryParameter> =
    | Player
    | Player[]
    | { info: PlayerInfo }
    | {
          type: "owner" | "controller";
          object: GameObjectQuery<T>;
      }
    | {
          type: "opponent" | "teammate";
          player: PlayerQuery<T>;
      };
export type PlayerQuery<T extends QueryParameter = QueryParameter> =
    SetOperation<
        | PlayerReference<T>
        | { argument: QueryParameterNameOfSpecificType<T, "player"> }
    >;

// =================================================================
// MARK: Name
export type CardNameCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<{
        type: "oneOf" | "allOf";
        name: CardNameQuery<T>;
    }>;
export type CardNameQuery<T extends QueryParameter = QueryParameter> =
    SetOperation<
        | CardName
        | CardName[]
        | {
              card: CardQuery<T>;
          }
        | { argument: QueryParameterNameOfSpecificType<T, "name"> }
    >;

// =================================================================
// MARK: 4種(タイプ)
export type CardTypeCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<
        | CardTypeQuery<T>
        | {
              type: "oneOf";
              cardType: CardTypeQuery<T>;
          }
    >;
export type CardTypeQuery<T extends QueryParameter = QueryParameter> =
    SetOperation<
        | CardType
        | CardType[]
        | { card: CardQuery<T> }
        | { argument: QueryParameterNameOfSpecificType<T, "cardType"> }
    >;

// =================================================================
// サブタイプ
export type SubtypeCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<
        SubtypeQuery<T> | { type: "oneOf"; subtype: SubtypeQuery<T> }
    >;
export type SubtypeQuery<T extends QueryParameter = QueryParameter> =
    SetOperation<
        | Subtype
        | Subtype[]
        | { card: CardQuery<T> }
        | { argument: QueryParameterNameOfSpecificType<T, "subtype"> }
    >;

// =================================================================
// 特殊タイプ
export type SupertypeCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<
        SupertypeQuery<T> | { type: "oneOf"; supertype: SupertypeQuery<T> }
    >;
export type SupertypeQuery<T extends QueryParameter = QueryParameter> =
    SetOperation<
        Supertype | Supertype[] | { card: CardQuery<T> }
        // | { argument: QueryParameterNameOfSpecificType<T, "supertype"> }
    >;

// =========================================================
// MARK: 5種(色)
export type ColorCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<
        | ColorQuery<T>
        | {
              type: "oneOf";
              color: ColorQuery<T>;
          }
    >;
export type ColorQuery<T extends QueryParameter = QueryParameter> =
    SetOperation<
        | Color
        | Color[]
        | { card: CardQuery<T> }
        | { argument: QueryParameterNameOfSpecificType<T, "color"> }
    >;

// =================================================================
// MARK: Zone
export type ZoneCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<
        | {
              type: ZoneType;
              owner?: PlayerQuery<T>;
          }
        | {
              type?: ZoneType;
              owner: PlayerQuery<T>;
          }
    >;
export type ZoneQuery<T extends QueryParameter = QueryParameter> = SetOperation<
    Zone | ZoneCondition<T>
>;

// =========================================================
// MARK: 6種(能力) TODO:
export type AbilityCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<{}>;
export type AbilityQuery<T extends QueryParameter = QueryParameter> =
    | Ability[]
    | {
          lose?: Ability[]; // TODO: 能力の同一性の検査
          add?: Ability[];
      };
// =========================================================
// MARK: 3種(文章) TODO:
export type TextCondition<T extends QueryParameter = QueryParameter> =
    BooleanOperation<{}>;
export type TextQuery<T extends QueryParameter = QueryParameter> = {};

// =========================================================
// MARK: 型ガード
export function isGameObjectCondition(
    arg: unknown,
): arg is GameObjectCondition {
    // TODO:
    return false;
}
export function isGameObjectQuery(arg: unknown): arg is GameObjectQuery {
    // TODO:
    return false;
}

export function isCardCondition(arg: unknown): arg is CardCondition {
    // TODO:
    return false;
}
export function isCardQuery(arg: unknown): arg is CardQuery {
    // TODO:
    return false;
}

export function isPlayerCondition(arg: unknown): arg is PlayerCondition {
    // TODO:
    return false;
}
export function isPlayerReference(arg: unknown): arg is PlayerReference {
    // TODO:
    return false;
}
export function isPlayerQuery(arg: unknown): arg is PlayerQuery {
    // TODO:
    return false;
}

export function isCardNameCondition(arg: unknown): arg is CardNameCondition {
    // TODO:
    return false;
}
export function isCardNameQuery(arg: unknown): arg is CardNameQuery {
    // TODO:
    return false;
}

export function isCardTypeCondition(arg: unknown): arg is CardTypeCondition {
    // TODO:
    return false;
}
export function isCardTypeQuery(arg: unknown): arg is CardTypeQuery {
    // TODO:
    return false;
}

export function isSubtypeCondition(arg: unknown): arg is SubtypeCondition {
    // TODO:
    return false;
}
export function isSubtypeQuery(arg: unknown): arg is SubtypeQuery {
    // TODO:
    return false;
}

export function isSupertypeCondition(arg: unknown): arg is SupertypeCondition {
    // TODO:
    return false;
}
export function isSupertypeQuery(arg: unknown): arg is SupertypeQuery {
    // TODO:
    return false;
}

export function isColorCondition(arg: unknown): arg is ColorCondition {
    // TODO:
    return false;
}
export function isColorQuery(arg: unknown): arg is ColorQuery {
    // TODO:
    return false;
}

export function isZoneCondition(arg: unknown): arg is ZoneCondition {
    // TODO:
    return false;
}
export function isZoneQuery(arg: unknown): arg is ZoneQuery {
    // TODO:
    return false;
}

export function isAbilityCondition(arg: unknown): arg is AbilityCondition {
    // TODO:
    return false;
}
export function isAbilityQuery(arg: unknown): arg is AbilityQuery {
    // TODO:
    return false;
}

export function isTextCondition(arg: unknown): arg is TextCondition {
    // TODO:
    return false;
}
export function isTextQuery(arg: unknown): arg is TextQuery {
    // TODO:
    return false;
}
