import {
    createGameObject,
    type GameObject,
    type GameObjectParameter,
} from "../GameObject.js";
import type { Player } from "../Player.js";
import { Timestamp, type GameState } from "../../GameState/GameState.js";
import type { LayerInstance } from "../../Characteristics/Layer/LayerInstance.js";
import type { MultiSpec } from "../../Reference.js";
import type { Instruction } from "../../Instruction.js";

/** 継続的効果 */
export type ContinuousEffect = GameObject & ContinuousEffectProperty;
// プロパティ
export type ContinuousEffectProperty = {
    source: GameObject | undefined | string; // FIXME: 一時的にstringを追加
    timestamp: Timestamp | undefined;
};
// 作成時の引数
export type ContinuousEffectParameter = Partial<ContinuousEffectProperty>;

// ========================================================================
/** 値や特性を変更する継続的効果 */
export type ModifyCharacteristicsEffect = ContinuousEffect &
    ModifyCharacteristicsEffectProperty;
// プロパティ
export type ModifyCharacteristicsEffectProperty = {
    /** 影響を及ぼすオブジェクト */
    affectedObjects: MultiSpec<GameObject>;
    /** 特性変更 */
    layers: LayerInstance[];
};
// 作成時の引数
export type ModifyCharacteristicsEffectParameter =
    Partial<ModifyCharacteristicsEffectProperty>;

/** 値や特性を変更する継続的効果を作成する */
export function createModifyCharacteristics(
    parameters: GameObjectParameter &
        ContinuousEffectParameter &
        ModifyCharacteristicsEffectParameter
): ModifyCharacteristicsEffect {
    const obj = createGameObject(parameters);
    return {
        ...obj,
        source: parameters?.source,
        timestamp: parameters?.timestamp,
        affectedObjects: parameters?.affectedObjects ?? [],
        layers: parameters?.layers ?? [],
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
    parameters?: GameObjectParameter &
        ContinuousEffectParameter &
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
    parameters?: GameObjectParameter &
        ContinuousEffectParameter &
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
