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
    layerCategories,
    type Layer,
    type LayerCategory,
} from "../../Characteristics/Layer.js";
import type { Instruction } from "../../Instruction/Instruction.js";
import { isTimestamp, type Timestamp } from "../../GameState/Timestamp.js";
import type { StackedAbility } from "../StackedAbility.js";
import { isAbility, type Ability } from "../Ability.js";
import type { Spell } from "../Card/Spell.js";

/** 継続的効果。単一の常在型能力からの継続的効果か、または、単一の呪文や能力の解決によって生成された継続的効果 */
export type ContinuousEffect = GameObject & ContinuousEffectProperty;

export function isContinuousEffect(obj: unknown): obj is ContinuousEffect {
    return isGameObject(obj) && isContinuousEffectProperty(obj);
}
export function createContinuousEffect(): ContinuousEffect {
    //
}

// プロパティ
export type ContinuousEffectProperty = {
    source: Spell | StackedAbility | Ability | undefined | string; // FIXME: 一時的にstringを追加
    timestamp: Timestamp | undefined;
};
function isContinuousEffectProperty(arg: unknown) {
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

// ========================================================================
/** 値や特性を変更する継続的効果 */
export type CharacteristicsAlteringEffect = ContinuousEffect &
    CharacteristicsAlteringEffectProperty;
// プロパティ
export type CharacteristicsAlteringEffectProperty = {
    /** 特性変更 */
    layers: Partial<_Layers>; // FIXME: layersが要らなくて直接のプロパティにしたほうがいいかも
};

type _Layers = { [K in LayerCategory]: Layer<K> };

/** 指定した種類別の効果を持っているかどうか */
export function hasLayer<T extends LayerCategory>(
    effect: CharacteristicsAlteringEffect,
    layerCategory: T
): effect is CharacteristicsAlteringEffect & {
    layers: Record<T, Layer<T>>;
} {
    return effect.layers[layerCategory] !== undefined;
}

export function isCharacteristicsAlteringEffect(
    arg: unknown
): arg is CharacteristicsAlteringEffect {
    return isContinuousEffect(arg) && "layers" in arg && isLayers(arg.layers);
}
function isLayers(
    arg: unknown
): arg is Partial<{ [K in LayerCategory]: Layer<K> }> {
    if (typeof arg === "object" && arg !== null) {
        for (const k in arg) {
            const v = (arg as typeof arg & Record<typeof k, unknown>)[k]; // FIXME: no as
            if (!layerCategories.some((c) => c === k)) {
                return false;
            } else if (
                !isLayer(v, k as (typeof layerCategories)[number]) // FIXME: no as
            ) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

// 作成時の引数
export type CharacteristicsAlteringEffectParameter =
    Partial<CharacteristicsAlteringEffectProperty>;

/** 値や特性を変更する継続的効果を作成する */
export function createCharacteristicsAltering(
    parameters: GameObjectParameters &
        Partial<ContinuousEffectProperty> &
        CharacteristicsAlteringEffectParameter
): CharacteristicsAlteringEffect {
    const obj = createGameObject(parameters);
    return {
        ...obj,
        source: parameters?.source,
        timestamp: parameters?.timestamp,
        layers: parameters?.layers ?? {},
    };
}

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
        ModifyProcedureEffectParameter
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
        ForbidActionEffectParameters
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
