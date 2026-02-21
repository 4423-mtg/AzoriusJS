import type { CardType } from "../Characteristics/CardType.js";
import type {
    CardName,
    Characteristics,
    CopiableValue,
    ManaCost,
    NumericalValue,
    RuleText,
} from "../Characteristics/Characteristic.js";
import type { Color } from "../Characteristics/Color.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { Ability } from "../GameObject/Ability.js";
import type { Card, Status } from "../GameObject/Card/Card.js";
import { isGameObject, type GameObject } from "../GameObject/GameObject.js";
import { isPlayer, type Player } from "../GameObject/Player.js";
import type { Zone } from "../GameState/Zone.js";
import type { CharacteristicsConditionOperand } from "./ScalarQuery/CharacteristicsQuery.js";
import type { CopiableValueConditionOperand } from "./ScalarQuery/CopiableValueQuery.js";
import type { ManaCostConditionOperand } from "./ScalarQuery/ManaCostQuery.js";
import type { NumericalValueConditionOperand } from "./ScalarQuery/NumericalValueQuery.js";
import type { StatusConditionOperand } from "./ScalarQuery/StatusQuery.js";
import type { AbilityConditionOperand } from "./SetQuery/AbilityQuery.js";
import type { CardNameConditionOperand } from "./SetQuery/CardNameQuery.js";
import type { CardConditionOperand } from "./SetQuery/CardQuery.js";
import type { CardTypeConditionOperand } from "./SetQuery/CardTypeQuery.js";
import type { ColorConditionOperand } from "./SetQuery/ColorQuery.js";
import type { GameObjectConditionOperand } from "./SetQuery/GameObjectQuery.js";
import type { PlayerConditionOperand } from "./SetQuery/PlayerQuery.js";
import type { TextConditionOperand } from "./SetQuery/RuleTextQuery.js";
import type { SubtypeConditionOperand } from "./SetQuery/SubtypeQuery.js";
import type { SupertypeConditionOperand } from "./SetQuery/SupertypeQuery.js";
import type { ZoneConditionOperand } from "./SetQuery/ZoneQuery.js";

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

// ====================================================================
// MARK: パラメータ
// ====================================================================

/** クエリのパラメータ */
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
/** クエリのパラメータが取る型 */
export type TypeOfQueryParameter = QueryParameter[string]["type"];

// - なんらかのオブジェクト
// - 発生源
// - 選択した値
//   - 関連した能力
//     - 関連先の能力をどうやって指定するか？
//       - 後から付与された能力も対象になりうる（コピーなど）
//       - つまり、 Ability.id を指定する

/** QueryParameter */
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

/**  */
function isTypeOfQueryParameter(arg: unknown): arg is TypeOfQueryParameter {
    return (
        arg === "gameObject" ||
        arg === "player" ||
        arg === "number" ||
        arg === "string"
    );
}

// ====================================================================
// MARK: パラメータの演算
// ====================================================================

/** クエリパラメータのうちの、指定した型であるパラメータ */
export type QueryParameterNameOfSpecificType<
    T extends QueryParameter,
    U extends TypeOfQueryParameter,
> = keyof {
    [K in keyof T as T[K] extends { type: U } ? K : never]: T[K];
};

type QueryParameterNameOfSpecificType2<
    T extends QueryParameter,
    U extends TypeOfQueryParameter,
> = keyof T;

const x = {
    p1: { type: "gameObject" },
    p2: { type: "player" },
    p3: { type: "gameObject" },
} satisfies QueryParameter;
type x2 = QueryParameterNameOfSpecificType<typeof x, "gameObject">;
const test1: x2 = "p1";
const test2: x2 = "p2";
const test3: x2 = "p3";
type y2 = QueryParameterNameOfSpecificType2<typeof x, "gameObject">;

/** クエリパラメータの総和 */
export function IntersectionOfQueryParameters(
    params: QueryParameter[],
): QueryParameter {
    const merged = Object.assign({}, ...params);
    return merged;
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

// 履歴 TODO:

/**  */
function isQueryParameterNameOfSpecificType<
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

// ====================================================================
// MARK: BooleanOperation
// ====================================================================
// TODO: SetElementCondition を通常のConditionと区別する必要はあるのだろうか？
// 受け取って処理する側を書くときに必要になるかもしれない。
type _conditionTargetTypeDefinition = {
    // SetElementType
    gameObject: GameObject;
    card: Card;
    player: Player;
    cardName: CardName;
    cardType: CardType;
    subtype: Subtype;
    supertype: Supertype;
    color: Color;
    zone: Zone;
    ability: Ability;
    ruleText: RuleText;
    // Scalar
    numericalValue: NumericalValue;
    manaCost: ManaCost;
    characteristics: Characteristics;
    copiableValue: CopiableValue;
    status: Status;
};
export type ConditionTargetTypeId = keyof _conditionTargetTypeDefinition;
export type ConditionTargetType<
    T extends ConditionTargetTypeId = ConditionTargetTypeId,
> = _conditionTargetTypeDefinition[T];

/** 条件 */
export type Condition<
    T extends ConditionTargetType,
    U extends QueryParameter,
> = { targetType: T; condition: BooleanOperation<BooleanQueryOperand<T, U>> };

/** 条件のオペランド */
export type BooleanQueryOperand<
    T extends ConditionTargetType,
    U extends QueryParameter,
> = T extends GameObject
    ? GameObjectConditionOperand<U>
    : T extends Card
    ? CardConditionOperand<U>
    : T extends Player
    ? PlayerConditionOperand<U>
    : T extends CardName
    ? CardNameConditionOperand<U>
    : T extends CardType
    ? CardTypeConditionOperand<U>
    : T extends Subtype
    ? SubtypeConditionOperand<U>
    : T extends Supertype
    ? SupertypeConditionOperand<U>
    : T extends Color
    ? ColorConditionOperand<U>
    : T extends Zone
    ? ZoneConditionOperand<U>
    : T extends Ability
    ? AbilityConditionOperand<U>
    : T extends RuleText
    ? TextConditionOperand<U>
    : T extends NumericalValue
    ? NumericalValueConditionOperand<U>
    : T extends ManaCost
    ? ManaCostConditionOperand<U>
    : T extends Characteristics
    ? CharacteristicsConditionOperand<U>
    : T extends CopiableValue
    ? CopiableValueConditionOperand<U>
    : T extends Status
    ? StatusConditionOperand<U>
    : never;

/** 条件演算 */
type _Not<T extends BooleanQueryOperand<ConditionTargetType, QueryParameter>> =
    { operation: "not"; operand: T };
type _And<T extends BooleanQueryOperand<ConditionTargetType, QueryParameter>> =
    (T | _Not<T>)[];
type _Or<T extends BooleanQueryOperand<ConditionTargetType, QueryParameter>> = {
    operaion: "or";
    operand: (T | _And<T> | _Not<T>)[];
};
export type BooleanOperation<
    T extends BooleanQueryOperand<ConditionTargetType, QueryParameter>,
> = T | _Not<T> | _And<T> | _Or<T>;

// A and (B and C) = A and B and C
// A and (B or C) = (A and B) or (A and C)
// A and (not B)
// A or (B and C)
// A or (B or C) = A or B or C
// A or (not B)
// not (A and B) = (not A) or (not B)
// not (A or B) = (not A) and (not B)
// not (not A) = A

// あなたがコントロールしていない基本でない土地
// (not A) and (not B) and C
// 対戦相手がコントロールする、クリーチャーと基本でない土地
// A and (B or ((not C) and D))
// = (A and B) or (A and (not C) and D)

export function getQueryParameterOfBooleanOperation<T>(
    query: BooleanOperation<>,
): QueryParameter {
    return {}; // TODO:
}

/**  */
export function isBooleanOperation<T>(
    arg: unknown,
): arg is BooleanOperation<T> {
    // TODO:
    return false;
}

// ==================================================================
// MARK: 型ガード
// ====================================================================
/** Record */
function isRecord(arg: unknown): arg is Record<string, unknown> {
    return typeof arg === "object" && arg !== null;
}
