import type { CardType } from "../../Characteristics/CardType.js";
import type { CardName } from "../../Characteristics/Characteristic.js";
import type { Color } from "../../Characteristics/Color.js";
import type { Subtype } from "../../Characteristics/Subtype.js";
import type { Supertype } from "../../Characteristics/Supertype.js";
import type { Ability } from "../../GameObject/Ability.js";
import type { Card } from "../../GameObject/Card/Card.js";
import type { GameObject } from "../../GameObject/GameObject.js";
import type { Player } from "../../GameObject/Player.js";
import type { PlayerInfo } from "../../GameState/Match.js";
import type { Zone, ZoneType } from "../../GameState/Zone.js";
import type { NumberCondition } from "../NumberQuery.js";
import type {
    CharacteristicsCondition,
    CounterQuery,
    FaceQuery,
    MarkerQuery,
    StatusQuery,
    StickerQuery,
} from "../ObjectQuery.js";
import type { QueryParameter } from "../Query.js";
import {
    getQueryParameterOfSetQuery,
    isSetElementCondition,
    type SetElementCondition,
    type SetQuery,
} from "../SetQuery.js";

// =================================================================
// MARK: GameObject
// =================================================================
export type GameObjectConditionOperand<T extends QueryParameter> = {
    zone: SetQuery<Zone, T>;
};

export type GameObjectQueryOperand<T extends QueryParameter> =
    | SetElementCondition<GameObject, T>
    | {
          argument: string;
      };

export function getQueryParameterOfGameObjectConditionOperand(
    operand: GameObjectConditionOperand<QueryParameter>,
): QueryParameter {
    return getQueryParameterOfSetQuery(operand.zone);
}

export function getQueryParameterOfGameObjectQueryOperand(
    operand: GameObjectQueryOperand<QueryParameter>,
): QueryParameter {
    if (isSetElementCondition(operand)) {
        // FIXME:
        return getQueryParameterOfZoneQueryOperand(operand.zone);
    } else {
        return {
            [operand.argument]: { type: "gameObject" },
        };
    }
}
// GameObjectQuery -> SetOperation -> GameObjectCondition | {argument: string}
export function isGameObjectConditionOperand(
    arg: unknown,
): arg is GameObjectConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isGameObjectQueryOperand(
    arg: unknown,
): arg is GameObjectQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
// MARK: Card
// =================================================================
// FIXME: 継続的効果は一般に GameObject 全般に効果を及ぼすが、
// 特性を変更する効果は Card にのみ影響するので、 CardQuery を指定したい場合が有る
export type CardConditionOperand<T extends QueryParameter> = {
    face?: FaceQuery<T>;
    owner?: SetQuery<Player, T>;
    controller?: SetQuery<Player, T>;
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

export type CardQueryOperand<T extends QueryParameter> =
    | (SetElementCondition<GameObject, T> & SetElementCondition<Card, T>)
    | {
          argument: string;
      };
export function getQueryParameterOfCardConditionOperand(
    operand: CardConditionOperand<QueryParameter>,
): QueryParameter {
    return {};
}

export function getQueryParameterOfCardQueryOperand(
    operand: CardQueryOperand<QueryParameter>,
): QueryParameter {
    return {};
}
export function isCardConditionOperand(
    arg: unknown,
): arg is CardConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isCardQueryOperand(
    arg: unknown,
): arg is CardQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =========================================================
// MARK: Player
// =================================================================
export type PlayerConditionOperand<T extends QueryParameter> =
    | { type: "oneOf"; players: SetQuery<Player, T> }
    | {
          type: "owner" | "controller";
          object: SetQuery<GameObject, T>;
      }
    | {
          type: "opponent" | "teamMate" | "next" | "previous";
          player: SetQuery<Player, T>;
      }
    | { type: "isMonarch" | "startingPlayer" };

export type PlayerQueryOperand<T extends QueryParameter> =
    | Player
    | Player[]
    | { info: PlayerInfo } // TODO: プレイヤーID？
    | SetElementCondition<Player, T>
    | { argument: string };

export function getQueryParameterOfPlayerConditionOperand(
    operand: PlayerConditionOperand<QueryParameter>,
): QueryParameter {
    return {};
}

export function getQueryParameterOfPlayerQueryOperand(
    operand: PlayerQueryOperand<QueryParameter>,
): QueryParameter {
    return {};
}
export function isPlayerConditionOperand(
    arg: unknown,
): arg is PlayerConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isPlayerQueryOperand(
    arg: unknown,
): arg is PlayerQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
// MARK: Name
export type CardNameConditionOperand<T extends QueryParameter> = {
    type: "oneOf" | "allOf";
    name: SetQuery<CardName, T>;
};
export type CardNameQueryOperand<T extends QueryParameter> =
    | CardName
    | CardName[]
    | {
          card: SetQuery<Card, T>;
      }
    | { argument: string };

export function getQueryParameterOfCardNameQueryOperand(
    operand: CardNameQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfCardNameConditionOperand(
    operand: CardNameConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isCardNameConditionOperand(
    arg: unknown,
): arg is CardNameConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isCardNameQueryOperand(
    arg: unknown,
): arg is CardNameQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
// MARK: 4種(タイプ)
export type CardTypeConditionOperand<T extends QueryParameter> =
    | SetQuery<CardType, T>
    | {
          type: "oneOf";
          cardType: SetQuery<CardType, T>;
      };
export type CardTypeQueryOperand<T extends QueryParameter> =
    | CardType
    | CardType[]
    | { card: SetQuery<Card, T> }
    | { argument: string };

export function getQueryParameterOfCardTypeQueryOperand(
    query: CardTypeQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfCardTypeConditionOperand(
    query: CardTypeConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isCardTypeConditionOperand(
    arg: unknown,
): arg is CardTypeConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isCardTypeQueryOperand(
    arg: unknown,
): arg is CardTypeQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
// サブタイプ
export type SubtypeConditionOperand<T extends QueryParameter> =
    | SetQuery<Subtype, T>
    | { type: "oneOf"; subtype: SetQuery<Subtype, T> };

export type SubtypeQueryOperand<T extends QueryParameter> =
    | Subtype
    | Subtype[]
    | { card: SetQuery<Card, T> }
    | { argument: string };

export function getQueryParameterOfSubtypeQueryOperand(
    operand: SubtypeQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfSubtypeConditionOperand(
    operand: SubtypeConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isSubtypeConditionOperand(
    arg: unknown,
): arg is SubtypeConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isSubtypeQueryOperand(
    arg: unknown,
): arg is SubtypeQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
// 特殊タイプ
export type SupertypeConditionOperand<T extends QueryParameter> =
    | SetQuery<Supertype, T>
    | { type: "oneOf"; supertype: SetQuery<Supertype, T> };

export type SupertypeQueryOperand<T extends QueryParameter> =
    | Supertype
    | Supertype[]
    | { card: SetQuery<Card, T> };
// | { argument: string }

export function getQueryParameterOfSupertypeQueryOperand(
    operand: SupertypeQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfSupertypeConditionOperand(
    operand: SupertypeConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isSupertypeConditionOperand(
    arg: unknown,
): arg is SupertypeConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isSupertypeQueryOperand(
    arg: unknown,
): arg is SupertypeQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =========================================================
// MARK: 5種(色)
export type ColorConditionOperand<T extends QueryParameter> =
    | SetQuery<Color, T>
    | {
          type: "oneOf";
          color: SetQuery<Color, T>;
      };

export type ColorQueryOperand<T extends QueryParameter> =
    | Color
    | Color[]
    | { card: SetQuery<Card, T> }
    | { argument: string };

export function getQueryParameterOfColorQueryOperand(
    operand: ColorQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfColorConditionOperand(
    operand: ColorConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isColorConditionOperand(
    arg: unknown,
): arg is ColorConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isColorQueryOperand(
    arg: unknown,
): arg is ColorQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =================================================================
// MARK: Zone
export type ZoneConditionOperand<T extends QueryParameter> =
    | {
          type: ZoneType;
          owner?: SetQuery<Player, T>;
      }
    | {
          type?: ZoneType;
          owner: SetQuery<Player, T>;
      };

export type ZoneQueryOperand<T extends QueryParameter> =
    | Zone
    | SetElementCondition<Zone, T>;

export function getQueryParameterOfZoneConditionOperand(
    operand: ZoneConditionOperand<QueryParameter>,
): QueryParameter {
    return {};
}

export function getQueryParameterOfZoneQueryOperand(
    operand: ZoneQueryOperand<QueryParameter>,
): QueryParameter {
    return {};
}
export function isZoneConditionOperand(
    arg: unknown,
): arg is ZoneConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isZoneQueryOperand(
    arg: unknown,
): arg is ZoneQueryOperand<QueryParameter> {
    // TODO:
    return false;
}

// =========================================================
// MARK: 6種(能力) TODO:
export type AbilityConditionOperand<T extends QueryParameter> = undefined;
export type AbilityQueryOperand<T extends QueryParameter> =
    | Ability[]
    | {
          lose?: Ability[]; // TODO: 能力の同一性の検査
          add?: Ability[];
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

// =========================================================
// MARK: 3種(文章) TODO:
export type TextConditionOperand<T extends QueryParameter> = undefined;

export type TextQueryOperand<T extends QueryParameter> = undefined;

export function getQueryParameterOfTextConditionOperand(
    operand: TextConditionOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function getQueryParameterOfTextQueryOperand(
    operand: TextQueryOperand<QueryParameter>,
): QueryParameter {
    return {}; // TODO:
}
export function isTextConditionOperand(
    arg: unknown,
): arg is TextConditionOperand<QueryParameter> {
    // TODO:
    return false;
}
export function isTextQueryOperand(
    arg: unknown,
): arg is TextQueryOperand<QueryParameter> {
    // TODO:
    return false;
}
