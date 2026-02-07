import {
    createGameObject,
    isGameObject,
    type GameObject,
    type GameObjectParameters,
} from "../GameObject.js";
import type { Player } from "../Player.js";
import type { GameState } from "../../GameState/GameState.js";
import {
    isLayer,
    type Layer,
    type LayerCategory,
} from "../../Characteristics/Layer/Layer.js";
import type { Instruction } from "../../Instruction/Instruction.js";
import { isTimestamp, type Timestamp } from "../../GameState/Timestamp.js";
import type { StackedAbility } from "../StackedAbility.js";
import { isAbility, type Ability } from "../Ability.js";
import type { Spell } from "../Card/Spell.js";
import type { Layer1a, Layer1b } from "../../Characteristics/Layer/Layer1.js";
import type { Layer2 } from "../../Characteristics/Layer/Layer2.js";
import type { Layer3 } from "../../Characteristics/Layer/Layer3.js";
import type { Layer4 } from "../../Characteristics/Layer/Layer4.js";
import type { Layer5 } from "../../Characteristics/Layer/Layer5.js";
import type { Layer6 } from "../../Characteristics/Layer/Layer6.js";
import type {
    Layer7a,
    Layer7b,
    Layer7c,
    Layer7d,
} from "../../Characteristics/Layer/Layer7.js";
import type {
    GameObjectQuery,
    PlayerQuery,
    QueryParameter,
} from "../../Query/Query.js";

// FIXME: 型ガードは1箇所にまとめる

// ====================================================================================================
/** 継続的効果。単一の常在型能力からの継続的効果か、または、単一の呪文や能力の解決によって生成された継続的効果 */
export type ContinuousEffect = GameObject & ContinuousEffectProperty;
export type ContinuousEffectProperty = {
    source: Spell | StackedAbility | Ability | undefined | string; // FIXME: 一時的にstringを追加
    timestamp: Timestamp;
};

/** 型ガード */
export function isContinuousEffect(obj: unknown): obj is ContinuousEffect {
    return isGameObject(obj) && isContinuousEffectProperty(obj);
}
function isContinuousEffectProperty(
    arg: unknown,
): arg is ContinuousEffectProperty {
    if (typeof arg === "object" && arg !== null) {
        const source =
            "source" in arg &&
            (arg.source === undefined ||
                typeof arg.source === "string" || // FIXME: 一時的にstringを追加
                isSpell(arg.source) ||
                isStackedAbility(arg.source) ||
                isAbility(arg.source));
        const timestamp =
            "timestamp" in arg &&
            (arg.timestamp === undefined || isTimestamp(arg.timestamp));
        return source && timestamp;
    } else {
        return false;
    }
}

/** ContinuousEffect を作成する */
export function createContinuousEffect(): ContinuousEffect {
    // TODO: 実装
    //
}

// ========================================================================
/** 値や特性を変更する継続的効果 */
export type CharacteristicsAlteringEffect<T extends QueryParameter> =
    ContinuousEffect & CharacteristicsAlteringEffectProperty<T>;
// プロパティ
export type CharacteristicsAlteringEffectProperty<
    T extends QueryParameter = {},
> = {
    affected: GameObjectQuery<T> | PlayerQuery<T>;
    layer1a: Layer1a<T> | undefined;
    layer1b: Layer1b<T> | undefined;
    layer2: Layer2<T> | undefined;
    layer3: Layer3<T> | undefined;
    layer4: Layer4<T> | undefined;
    layer5: Layer5<T> | undefined;
    layer6: Layer6<T> | undefined;
    layer7a: Layer7a<T> | undefined;
    layer7b: Layer7b<T> | undefined;
    layer7c: Layer7c<T> | undefined;
    layer7d: Layer7d<T> | undefined;
};

/** 型ガード */
export function isCharacteristicsAlteringEffect<T extends QueryParameter>(
    arg: unknown,
    parameter: T,
): arg is CharacteristicsAlteringEffect<T> {
    return (
        isContinuousEffect(arg) &&
        isCharacteristicsAlteringEffectProperty(arg, parameter)
    );
}
export function isCharacteristicsAlteringEffectProperty<
    T extends QueryParameter,
>(arg: unknown, parameter: T): arg is CharacteristicsAlteringEffectProperty {
    return (
        typeof arg === "object" &&
        arg !== null &&
        "layer1a" in arg &&
        isLayer(arg.layer1a, "1a", parameter) &&
        "layer1b" in arg &&
        isLayer(arg.layer1b, "1b", parameter) &&
        "layer2" in arg &&
        isLayer(arg.layer2, "2", parameter) &&
        "layer3" in arg &&
        isLayer(arg.layer3, "3", parameter) &&
        "layer4" in arg &&
        isLayer(arg.layer4, "4", parameter) &&
        "layer5" in arg &&
        isLayer(arg.layer5, "5", parameter) &&
        "layer6" in arg &&
        isLayer(arg.layer6, "6", parameter) &&
        "layer7a" in arg &&
        isLayer(arg.layer7a, "7a", parameter) &&
        "layer7b" in arg &&
        isLayer(arg.layer7b, "7b", parameter) &&
        "layer7c" in arg &&
        isLayer(arg.layer7c, "7c", parameter) &&
        "layer7d" in arg &&
        isLayer(arg.layer7d, "7d", parameter)
    );
}

/** 値や特性を変更する継続的効果を作成する */
export function createCharacteristicsAlteringEffect<T extends QueryParameter>(
    parameters: GameObjectParameters &
        ContinuousEffectProperty &
        CharacteristicsAlteringEffectParameter<T>,
): CharacteristicsAlteringEffect<T> {
    const obj = createGameObject(parameters);
    return {
        ...obj,
        source: parameters?.source,
        affected: parameters.affected,
        timestamp: parameters?.timestamp,
        layer1a: parameters.layer1a,
        layer1b: parameters.layer1b,
        layer2: parameters.layer2,
        layer3: parameters.layer3,
        layer4: parameters.layer4,
        layer5: parameters.layer5,
        layer6: parameters.layer6,
        layer7a: parameters.layer7a,
        layer7b: parameters.layer7b,
        layer7c: parameters.layer7c,
        layer7d: parameters.layer7d,
    };
}
// 作成時の引数
export type CharacteristicsAlteringEffectParameter<T extends QueryParameter> =
    Required<Pick<CharacteristicsAlteringEffectProperty<T>, "affected">> &
        Partial<Omit<CharacteristicsAlteringEffectProperty<T>, "affected">>;

/** 指定した種類別のレイヤーを取得する */
export function getLayer<T extends LayerCategory, U extends QueryParameter>(
    effect: CharacteristicsAlteringEffect<U>,
    category: T, // 型を絞り込むためジェネリクスを使う
): Layer<T, U> | undefined {
    return effect[`layer${category}`] as Layer<typeof category, U> | undefined; // FIXME: as
}

/** 指定した種類別の効果を持っているかどうか (undefinedも不可) */
export function hasLayer<T extends LayerCategory, U extends QueryParameter>(
    effect: unknown,
    layerCategory: T,
    parameter: U,
): effect is CharacteristicsAlteringEffect<U> & Required<_layerProperty<T, U>> {
    return (
        isCharacteristicsAlteringEffect(effect, parameter) &&
        getLayer(effect, layerCategory) !== undefined
    );
}

type _layerProperty<T extends LayerCategory, U extends QueryParameter> = {
    [K in `layer${T}`]: Layer<T, U> | undefined;
};

// ========================================================================
/** 手続きを変更する継続的効果 */
export type ModifyProcedureEffect = ContinuousEffect &
    ModifyProcedureEffectParameter;
export type ModifyProcedureEffectParameter = {
    /** 変更対象の手続きに該当するかどうかをチェックする関数 */
    check: InstructionChecker | undefined;
    /** 変更後の処理 */
    replace: Instruction | ((...arg: unknown[]) => Instruction) | undefined; // FIXME: 2025-12-14
};

export function createModifyingProcedureEffect(
    parameters?: GameObjectParameters &
        Partial<ContinuousEffectProperty> &
        ModifyProcedureEffectParameter,
): ModifyProcedureEffect {
    const obj = createGameObject(parameters);
    return {
        ...obj,
        source: parameters?.source,
        timestamp: parameters?.timestamp,
        check: parameters?.check,
        replace: parameters?.replace,
    };
}

// ========================================================================
/** 処理を禁止する継続的効果 */
export type ForbidActionEffect = ContinuousEffect &
    ForbidActionEffectParameters;
export type ForbidActionEffectParameters = {
    check: InstructionChecker | undefined;
};

export function createForbidActionEffect(
    parameters?: GameObjectParameters &
        Partial<ContinuousEffectProperty> &
        ForbidActionEffectParameters,
): ForbidActionEffect {
    const obj = createGameObject(parameters);
    return {
        ...obj,
        source: parameters?.source,
        timestamp: parameters?.timestamp,
        check: parameters?.check,
    };
}

// =================================================================
/** Instructionの実行が特定の条件を満たすかどうかを判定する関数を表す型 */ // FIXME: 2025-12-14
type InstructionChecker = (args: {
    instruction: Instruction;
    state: GameState;
    history: any; // FIXME:
    performer: GameObject | Player;
}) => boolean;

/** Instructionを別の1つ以上のInstructionに置き換える関数を表す型 */
type InstructionReplacer = (instruction: Instruction) => Instruction[];
