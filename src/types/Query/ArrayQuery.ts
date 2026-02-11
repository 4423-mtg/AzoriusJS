import type { CardType } from "../Characteristics/CardType.js";
import type { CardName } from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Player } from "../GameObject/Player.js";
import type { PlayerInfo } from "../GameState/Match.js";
import type { Zone, ZoneId, ZoneType } from "../GameState/Zone.js";
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
    BooleanOperation,
    QueryParameter,
    QueryParameterNameOfSpecificType,
    SetOperation,
} from "./Query.js";

// =================================================================
// MARK: GameObject
export type GameObjectCondition<T extends QueryParameter> = {
    zone: ZoneQuery<T>;
};
export type GameObjectQuery<T extends QueryParameter> = SetOperation<
    | GameObjectCondition<T>
    | {
          argument: QueryParameterNameOfSpecificType<T, "gameObject" | "card">;
      }
>;
// =================================================================
// MARK: Card
// FIXME: 継続的効果は一般に GameObject 全般に効果を及ぼすが、
// 特性を変更する効果は Card にのみ影響するので、 CardQuery を指定したい場合が有る
export type CardCondition<T extends QueryParameter> = {
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
export type CardQuery<T extends QueryParameter> = SetOperation<
    | (GameObjectCondition<T> & CardCondition<T>)
    | {
          argument: QueryParameterNameOfSpecificType<T, "card">;
      }
>;

// =========================================================
// MARK: Player
export type PlayerCondition<T extends QueryParameter> = BooleanOperation<
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
type PlayerReference<T extends QueryParameter> =
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
export type PlayerQuery<T extends QueryParameter> = SetOperation<
    | PlayerReference<T>
    | { argument: QueryParameterNameOfSpecificType<T, "player"> }
>;

// =================================================================
// MARK: Name
export type CardNameCondition<T extends QueryParameter> = BooleanOperation<{
    type: "oneOf" | "allOf";
    name: CardNameQuery<T>;
}>;
export type CardNameQuery<T extends QueryParameter> = SetOperation<
    | CardName
    | CardName[]
    | {
          card: CardQuery<T>;
      }
    | { argument: QueryParameterNameOfSpecificType<T, "name"> }
>;

// =================================================================
// MARK: 4種(タイプ)
export type CardTypeCondition<T extends QueryParameter> = BooleanOperation<
    | CardTypeQuery<T>
    | {
          type: "oneOf";
          cardType: CardTypeQuery<T>;
      }
>;
export type CardTypeQuery<T extends QueryParameter> = SetOperation<
    | CardType
    | CardType[]
    | { card: CardQuery<T> }
    | { argument: QueryParameterNameOfSpecificType<T, "cardType"> }
>;

// =================================================================
// サブタイプ
export type SubtypeCondition<T extends QueryParameter> = BooleanOperation<
    SubtypeQuery<T> | { type: "oneOf"; subtype: SubtypeQuery<T> }
>;
export type SubtypeQuery<T extends QueryParameter> = SetOperation<
    | Subtype
    | Subtype[]
    | { card: CardQuery<T> }
    | { argument: QueryParameterNameOfSpecificType<T, "subtype"> }
>;

// =================================================================
// 特殊タイプ
export type SupertypeCondition<T extends QueryParameter> = BooleanOperation<
    SupertypeQuery<T> | { type: "oneOf"; supertype: SupertypeQuery<T> }
>;
export type SupertypeQuery<T extends QueryParameter> = SetOperation<
    Supertype | Supertype[] | { card: CardQuery<T> }
    // | { argument: QueryParameterNameOfSpecificType<T, "supertype"> }
>;

// =========================================================
// MARK: 5種(色)
export type ColorCondition<T extends QueryParameter> = BooleanOperation<
    | ColorQuery<T>
    | {
          type: "oneOf";
          color: ColorQuery<T>;
      }
>;
export type ColorQuery<T extends QueryParameter> = SetOperation<
    | Color
    | Color[]
    | { card: CardQuery<T> }
    | { argument: QueryParameterNameOfSpecificType<T, "color"> }
>;

// =================================================================
// MARK: Zone
export type ZoneCondition<T extends QueryParameter> = BooleanOperation<
    | {
          type: ZoneType;
          owner?: PlayerQuery<T>;
      }
    | {
          type?: ZoneType;
          owner: PlayerQuery<T>;
      }
>;
export type ZoneQuery<T extends QueryParameter> = SetOperation<
    Zone | ZoneCondition<T>
>;

// =========================================================
// MARK: 6種(能力) TODO:
export type AbilityQuery<T extends QueryParameter = {}> =
    | Ability[]
    | {
          lose?: Ability[]; // TODO: 能力の同一性の検査
          add?: Ability[];
      };
// =========================================================
// MARK: 3種(文章) TODO:
export type TextQuery<T extends QueryParameter> = {};

// =========================================================
// MARK: 型ガード
export function isGameObjectCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is GameObjectCondition<T> {
    // TODO:
    return false;
}
export function isGameObjectQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is GameObjectQuery<T> {
    // TODO:
    return false;
}

export function isCardCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CardCondition<T> {
    // TODO:
    return false;
}
export function isCardQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CardQuery<T> {
    // TODO:
    return false;
}

export function isPlayerCondition<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is PlayerCondition<T> {
    // TODO:
    return false;
}
export function isPlayerQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is PlayerQuery<T> {
    // TODO:
    return false;
}
