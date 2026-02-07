import type { CardType } from "../Characteristics/CardType.js";
import type {
    Characteristics,
    CopiableValue,
} from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { ManaSymbol } from "../Characteristics/Symbol.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Status } from "../GameObject/Card/Card.js";
import type { CounterOnObject } from "../GameObject/Counter.js";
import {
    isGameObject,
    type GameObject,
    type GameObjectId,
} from "../GameObject/GameObject.js";
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
export type QueryParameter = Record<
    string,
    | { type: "gameObject"; value?: GameObject }
    | { type: "player"; value?: Player }
    | { type: "number"; value?: number }
    | { type: "string"; value?: string }
>;
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

export type TypeOfQueryParameter =
    | "gameObject"
    | "player"
    | "number"
    | "string";
// - なんらかのオブジェクト
// - 発生源
// - 選択した値
//   - 関連した能力
//     - 関連先の能力をどうやって指定するか？
//       - 後から付与された能力も対象になりうる（コピーなど）
//       - つまり、 Ability.id を指定する
function isTypeOfQueryParameter(arg: unknown): arg is TypeOfQueryParameter {
    return (
        arg === "gameObject" ||
        arg === "player" ||
        arg === "number" ||
        arg === "string"
    );
}

export type SpecificTypeParameterName<
    T extends QueryParameter,
    U extends TypeOfQueryParameter,
> = keyof {
    [K in keyof T as T[K] extends { type: U } ? K : never]: T[K];
};
function isSpecificTypeParameterName<
    T extends QueryParameter,
    U extends TypeOfQueryParameter,
>(
    parameters: T,
    type: U,
    arg: unknown,
): arg is SpecificTypeParameterName<T, U> {
    if (typeof arg === "string" && parameters[arg] !== undefined) {
        return parameters[arg]["type"] === type;
    } else {
        return false;
    }
}

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
export type CopiableValueQuery<T extends QueryParameter = {}> =
    // 固定値
    | CopiableValue
    // 参照 FIXME:
    | {
          name: NameQuery<T>;
          manaCost: ManaCostQuery<T>;
          colorIdentity: ColorQuery<T>;
          cardTypes: CardTypeQuery<T>;
          subtypes: SubtypeQuery<T>;
          supertypes: SupertypeQuery<T>;
          text: TextQuery<T>;
          power: NumberQuery<T>;
          toughness: NumberQuery<T>;
          loyalty: NumberQuery<T>;
      }
    // 他のオブジェクト
    | {
          original: GameObjectQuery<T>;
          overwrite?: Partial<CopiableValueQuery<T>>;
          add?: Partial<CopiableValueQuery<T>>;
      };
// TODO: argument
export function isCopiableValueQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}
type CharacteristicsQuery<T extends QueryParameter> = {
    name?: NameQuery<T>;
    manaCost?: ManaCostQuery<T>;
    color?: ColorQuery<T>;
    cardType?: CardTypeQuery<T>;
    subtype?: SubtypeQuery<T>;
    supertype?: SupertypeQuery<T>;
    text?: TextQuery<T>;
    ability?: AbilityQuery<T>;
    power?: NumberQuery<T>;
    toughness?: NumberQuery<T>;
    loyalty?: NumberQuery<T>;
    defense?: NumberQuery<T>;
    handModifier?: NumberQuery<T>;
    lifeModifier?: NumberQuery<T>;
};

// =========================================================
// MARK: 2種(コントローラー)
export type PlayerQuery<T extends QueryParameter = {}> =
    // 固定
    | Player
    | {
          info: PlayerInfo;
      }
    // オブジェクトの参照
    | {
          type: "owner" | "controller";
          object: GameObjectQuery<T>;
      }
    // プレイヤーの参照
    | {
          type: "opponent" | "teammate";
          player: PlayerQuery<T>;
      }
    | { argument: SpecificTypeParameterName<T, "player"> };

export function isPlayerQuery<T extends QueryParameter>(
    parameters: T,
    arg: unknown,
): arg is PlayerQuery<T> {
    return typeof arg === "object" && arg !== null; // TODO:
}

type PlayerBooleanOperation<T extends QueryParameter> =
    | PlayerQuery<T>
    | { operation: "not"; operand: PlayerQuery<T> }
    | { operation: "or"; operand: PlayerQuery<T>[] };

// =========================================================
// MARK: 3種(文章)
export type TextQuery<T extends QueryParameter> = {};
// TODO:
export function isTextQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// MARK: 4種(タイプ)
export type CardTypeQuery<T extends QueryParameter = {}> =
    | CardType
    | CardType[]
    | {
          object: GameObjectQuery<T>;
          append?: CardTypeQuery<T>;
          omit?: CardTypeQuery<T>;
      };
export function isCardTypeQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CardTypeQuery<T> {
    // TODO:
    return false;
}
export type SubtypeQuery<T extends QueryParameter = {}> =
    | Subtype
    | Subtype[]
    | {
          object: GameObjectQuery<T>;
          append?: SubtypeQuery<T>;
          omit?: SubtypeQuery<T>;
      };
export function isSubtypeQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is SubtypeQuery<T> {
    // TODO:
    return false;
}
export type SupertypeQuery<T extends QueryParameter = {}> =
    | Supertype
    | Supertype[]
    | {
          object: GameObjectQuery<T>;
          append?: SupertypeQuery<T>;
          omit?: SupertypeQuery<T>;
      };
export function isSupertypeQuery<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is SupertypeQuery<T> {
    // TODO:
    return false;
}

// =========================================================
// MARK: 5種(色)
export type ColorQuery<T extends QueryParameter = {}> = Color | Color[]; // TODO:
export function isColorQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// MARK: 6種(能力)
export type AbilityQuery<T extends QueryParameter = {}> =
    | Ability[]
    | {
          lose?: Ability[]; // TODO: 能力の同一性の検査
          add?: Ability[];
      };
export function isAbilityQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
) {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// MARK: 7種(PT)
export type NumberQuery<T extends QueryParameter = {}> =
    | number
    // オブジェクトの数値
    | {
          type: "characteristics";
          kind: "manaValue" | "power" | "toughness"; // ほかにタイプの数、色の数など
          object: GameObject | GameObjectId | GameObjectQuery<T>;
      }
    | {
          type: "devotion";
          object: GameObject | GameObjectId | GameObjectQuery<T>;
          colors: (Color | ColorQuery<T>)[];
      }
    // オブジェクトの個数
    | { type: "number"; objects: GameObjectQuery<T> }
    // カードタイプの数
    | { type: "numberOfCardTypes"; objects: GameObjectQuery<T> }
    // 何かの合計値
    | {
          type: "total"; // 減算や乗算はあるのだろうか
          values: NumberQuery<T>[];
      }
    // 履歴 このターンに〇〇した数など TODO:
    | { type: "stormCount" }
    // 引数
    | { argument: SpecificTypeParameterName<T, "number"> };

export function isNumberQuery<T extends QueryParameter>(
    parameter: T,
    arg: unknown,
): arg is NumberQuery<T> {
    return typeof arg === "object" && arg !== null; // TODO:
}

// =========================================================
// これがなくてもGameObjectの集合演算で表現はできるが、現実的でない
type ZoneBooleanOperation<T extends QueryParameter> =
    | ZoneId
    | Partial<{ type: ZoneType; owner: PlayerQuery<T> }>
    | { operation: "not"; operand: ZoneBooleanOperation<T> }
    | { operation: "and" | "or"; operand: ZoneBooleanOperation<T>[] };
type CounterBooleanOperation<T extends QueryParameter> =
    | CounterOnObject[]
    | { operation: "not"; operand: CounterBooleanOperation<T> }
    | { operation: "and" | "or"; operand: CounterBooleanOperation<T>[] };
type MarkerBooleanOperation<T extends QueryParameter> =
    | Marker[]
    | { operation: "not"; operand: MarkerBooleanOperation<T> }
    | { operation: "and" | "or"; operand: MarkerBooleanOperation<T>[] };
type StickerBooleanOperation<T extends QueryParameter> =
    | Sticker[]
    | { operation: "not"; operand: StickerBooleanOperation<T> }
    | { operation: "and" | "or"; operand: StickerBooleanOperation<T>[] };
type CharacteristicsBooleanOperation<T extends QueryParameter> =
    | CharacteristicsQuery<T>
    | { operation: "not"; operand: CharacteristicsBooleanOperation<T> }
    | {
          operation: "and" | "or";
          operand: CharacteristicsBooleanOperation<T>[];
      };

// MARK: オブジェクト
export type GameObjectQuery<T extends QueryParameter = {}> =
    | { argument: SpecificTypeParameterName<T, "gameObject"> }
    | {
          zone?: ZoneBooleanOperation<T>;
          counter?: CounterBooleanOperation<T>;
          marker?: MarkerBooleanOperation<T>;
          sticker?: StickerBooleanOperation<T>;
          characteristics?: CharacteristicsBooleanOperation<T>;
          //   owner?: PlayerBooleanOperation<T>; // TODO: CardQuery
          controller?: PlayerBooleanOperation<T>;
          //   isToken?: boolean;
          //   status?: Status;
          manaValue?: {
              type:
                  | "greater"
                  | "lesser"
                  | "equal"
                  | "greaterEqual"
                  | "lesserEqual"; // FIXME:
              value: NumberQuery<T>;
          };
      }
    | {
          action: "union" | "intersection";
          query: GameObjectQuery<T>[];
      }
    | {
          action: "difference";
          left: GameObjectQuery<T>;
          right: GameObjectQuery<T>;
      };
// 履歴 TODO:

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

type NameQuery<T extends QueryParameter> = string; // FIXME:
type ManaCostQuery<T extends QueryParameter> = ManaSymbol[]; // FIXME:
