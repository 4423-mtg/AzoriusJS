import type { CardType } from "../Characteristics/CardType.js";
import type {
    CardName,
    Characteristics,
    CopiableValue,
} from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { ManaSymbol } from "../Characteristics/Symbol.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Card } from "../GameObject/Card/Card.js";
import type { CounterOnObject } from "../GameObject/Counter.js";
import { isGameObject, type GameObject } from "../GameObject/GameObject.js";
import type { Marker } from "../GameObject/Marker.js";
import { isPlayer, type Player } from "../GameObject/Player.js";
import type { Sticker } from "../GameObject/Sticker.js";
import type { PlayerInfo } from "../GameState/Match.js";
import type { ZoneId, ZoneType } from "../GameState/Zone.js";

// 種類別（レイヤー）に関してはこれでOK。
// 手続き変更効果・処理禁止効果・置換効果・追加ターン効果についてはどう？

// 特性変化は常時再計算するため、関数である必要がある。
// 関数はシリアライズできない（＝効果をファイルに保存できない）
// => レイヤーではなく効果をシリアライズ保存対象にする。（レイヤーは静的なものにする）
//    対象や解決時の選択などは効果に保存する
//    - レイヤーは効果にどう記述する？
//      => とりあえずソースコードに書いてもいい。そのうちタグ化すれば保存もできる
// => クラスにする必要はある？しなくてもいいが、型ガードはできない
//   - 効果の定義を書くときに型ガードがないとチェックができない
//     => タグ化しよう

// Queryで参照値として使う
// MARK: QueryParameter
export type QueryParameter = Record<
    string,
    | { type: "gameObject"; value?: GameObject }
    | { type: "card"; value?: Card }
    | { type: "player"; value?: Player }
    | { type: "number"; value?: number }
    | { type: "string"; value?: string }
    | { type: "cardType"; value?: CardType }
    | { type: "subtype"; value?: Subtype }
    | { type: "color"; value?: Color }
    | { type: "name"; value?: CardName }
    // | { type: "zone"; value?: Zone }
>;
export type TypeOfQueryParameter = QueryParameter[string]["type"];

// - なんらかのオブジェクト
// - 発生源
// - 選択した値
//   - 関連した能力
//     - 関連先の能力をどうやって指定するか？
//       - 後から付与された能力も対象になりうる（コピーなど）
//       - つまり、 Ability.id を指定する

export type QueryParameterNameOfSpecificType<
    T extends QueryParameter,
    U extends TypeOfQueryParameter,
> = keyof {
    [K in keyof T as T[K] extends { type: U } ? K : never]: T[K];
};

// 配列を返すもの
// - GameObject: 集合演算
// - Ability: 集合演算？
// - Color: 集合演算
// - CardType: 集合演算
// - Name
// 1つだけ返すもの
// - number: 足し算
// - Player: 対戦相手、チームメイト、その人以外、その人の次の人
// オブジェクトを返すもの
// - CopiableValue
// - Characteristics:

// =========================================================
// MARK: 1種(コピー)
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
    // 参照
    | { object: GameObjectQuery<T> }
    // 修整
    | {
          original: CopiableValueQuery<T>;
          overwrite?: Partial<CopiableValueQuery<T>>;
          add?: Partial<CopiableValueQuery<T>>;
      };

// FIXME:
type CharacteristicsCondition<T extends QueryParameter> = BooleanOperation<{
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
type CharacteristicsQuery<T extends QueryParameter> =
    | Characteristics
    | { card: CardQuery<T> }; // FIXME: oneOf? merge?

// =========================================================
// MARK: 2種(コントローラー)
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
export type PlayerQuery<T extends QueryParameter> = SetOperation<
    | PlayerReference<T>
    | { argument: QueryParameterNameOfSpecificType<T, "player"> }
>;

// =========================================================
// MARK: 3種(文章) TODO:
export type TextQuery<T extends QueryParameter> = {};

// =========================================================
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

// =========================================================
// MARK: 6種(能力) TODO:
export type AbilityQuery<T extends QueryParameter = {}> =
    | Ability[]
    | {
          lose?: Ability[]; // TODO: 能力の同一性の検査
          add?: Ability[];
      };

// =========================================================
// MARK: 7種(PT)
export type NumberCondition<T extends QueryParameter> = BooleanOperation<
    | NumberQuery<T>
    | {
          type: "greater" | "less" | "greaterEqual" | "lessEqual";
          number: NumberQuery<T>;
      }
>;

export type NumberReference<T extends QueryParameter> =
    // TODO: GameObject (Spellなど) 対象の数など
    | number
    | {
          valueType:
              | "manaValue" // マナシンボルの数とかも要るのだろうか
              | "numberOfColors"
              | "numberOfCardTypes"
              | "numberOfSubypes"
              | "numberOfSupertypes"
              | "numberOfAbilities"
              | "power"
              | "toughness"
              | "loyalty"
              | "defense"
              | "handModifier"
              | "lifeModifier";
          card: CardQuery<T>;
      }
    | {
          valueType: "devotion";
          card: CardQuery<T>;
          colors: ColorQuery<T>;
      }
    // オブジェクトの個数
    | { valueType: "numberOfObject"; objects: GameObjectQuery<T> }
    // カウンターの数
    | {
          valueType: "numberOfCounter";
          objects: CardQuery<T>;
          kindOfCounter?: CounterCondition<T>;
      }
    // 履歴 このターンに〇〇した数など TODO:
    | { valueType: "stormCount" };
export type NumberQuery<T extends QueryParameter> =
    | NumberReference<T>
    // 引数
    | { argument: QueryParameterNameOfSpecificType<T, "number"> }
    // 何かの合計値
    | {
          valueType: "total";
          values: NumberQuery<T>[];
      }
    | {
          valueType: "difference";
          value1: NumberQuery<T>;
          value2: NumberQuery<T>;
      };

// =========================================================
// MARK: Zone
type ZoneQuery<T extends QueryParameter> = SetOperation<
    | {
          zoneId?: ZoneId;
      }
    | { type?: ZoneType; owner?: PlayerQuery<T> }
>;

type ZoneCondition<T extends QueryParameter> = BooleanOperation<ZoneQuery<T>>;

// MARK: Counter
type CounterCondition<T extends QueryParameter> = CounterOnObject[];
type CounterQuery<T extends QueryParameter> = BooleanOperation<
    CounterCondition<T>
>;

// MARK: Marker
type MarkerQuery<T extends QueryParameter> = BooleanOperation<Marker[]>;
type StickerQuery<T extends QueryParameter> = BooleanOperation<Sticker[]>;

//
// =================================================================
// MARK: GameObjectQuery
export type GameObjectCondition<T extends QueryParameter> = {
    zone?: ZoneCondition<T>;
};
export type GameObjectQuery<T extends QueryParameter> = SetOperation<
    | GameObjectCondition<T>
    | {
          argument: QueryParameterNameOfSpecificType<T, "gameObject" | "card">;
      }
>;
// 履歴 TODO:

// =================================================================
// MARK: CardQuery
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
    manaValue?: NumberCondition<T>;
};
export type CardQuery<T extends QueryParameter> = SetOperation<
    | (GameObjectCondition<T> & CardCondition<T>)
    | {
          argument: QueryParameterNameOfSpecificType<T, "card">;
      }
>;

// =================================================================
// MARK: FaceQuery
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
// MARK: StatusQuery
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
// MARK: NameQuery
export type CardNameCondition<T extends QueryParameter> = BooleanOperation<{
    type?: "oneOf" | "allOf"; // undefinedの場合は "allOf" とする
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
// MARK: ManaCostQuery
export type ManaCostCondition<T extends QueryParameter> = ManaCostQuery<T>;
type ManaCostQuery<T extends QueryParameter> =
    | ManaSymbol[]
    | { card: CardQuery<T> };
//

// =================================================================
// MARK: 演算型
export type SetOperation<T> =
    | T
    | {
          operation: "union" | "intersection";
          operand: SetOperation<T>[];
      }
    | {
          operation: "difference";
          leftOperand: SetOperation<T>;
          rightOperand: SetOperation<T>;
      };
export type BooleanOperation<T> =
    | T
    | {
          operation: "not";
          operand: BooleanOperation<T>;
      }
    | {
          operation: "and" | "or";
          operand: BooleanOperation<T>[];
      };

// ==================================================================
// MARK: 型ガード
export function isQueryParameter(arg: unknown): arg is QueryParameter {
    if (!isRecord(arg)) {
        return false;
    }

    for (const key in arg) {
        const e = arg[key];
        if (!isRecord(e)) {
            return false;
        }
        switch (e["type"]) {
            case "gameObject":
                if (!isGameObject(e["value"]) && e["value"] !== undefined) {
                    return false;
                }
                break;
            case "player":
                if (!isPlayer(e["value"]) && e["value"] !== undefined) {
                    return false;
                }
                break;
            case "number":
                if (
                    !(typeof e["value"] !== "number") &&
                    e["value"] !== undefined
                ) {
                    return false;
                }
                break;
            case "string":
                if (
                    !(typeof e["value"] !== "string") &&
                    e["value"] !== undefined
                ) {
                    return false;
                }
                break;
            default:
                return false;
        }
    }
    return true;
}

function isRecord(arg: unknown): arg is Record<string, unknown> {
    return typeof arg === "object" && arg !== null;
}
function isTypeOfQueryParameter(arg: unknown): arg is TypeOfQueryParameter {
    return (
        arg === "gameObject" ||
        arg === "player" ||
        arg === "number" ||
        arg === "string"
    );
}
function isSpecificTypeParameterName<
    T extends QueryParameter,
    U extends TypeOfQueryParameter,
>(
    parameters: T,
    type: U,
    arg: unknown,
): arg is QueryParameterNameOfSpecificType<T, U> {
    if (typeof arg === "string" && parameters[arg] !== undefined) {
        return parameters[arg]["type"] === type;
    } else {
        return false;
    }
}
export function isCopiableValueQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isPlayerQuery<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is PlayerQuery<T> {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isTextQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isCardTypeQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CardTypeQuery<T> {
    // TODO:
    return false;
}
export function isSubtypeQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is SubtypeQuery<T> {
    // TODO:
    return false;
}
export function isSupertypeQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is SupertypeQuery<T> {
    // TODO:
    return false;
}
export function isColorQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isAbilityQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isNumberQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
): arg is NumberQuery<T> {
    return typeof arg === "object" && arg !== null; // TODO:
}
export function isGameObjectQuery<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is GameObjectQuery<T> {
    if (!isRecord(arg)) {
        return false;
    }
    const argumentName = arg["argumentName"];
    if (
        argumentName !== undefined &&
        isSpecificTypeParameterName(parameters, "gameObject", argumentName)
    ) {
        return true;
    }
    // TODO: 続き
    return false;
}
