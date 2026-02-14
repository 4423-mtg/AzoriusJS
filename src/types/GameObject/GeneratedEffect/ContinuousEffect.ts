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
import {
    createTimestamp,
    isTimestamp,
    type Timestamp,
} from "../../GameState/Timestamp.js";
import { isStackedAbility, type StackedAbility } from "../StackedAbility.js";
import { isAbility, type Ability } from "../Ability.js";
import { isSpell, type Spell } from "../Card/Spell.js";
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
import type { QueryParameter } from "../../Query/Query.js";
import type {
    CardQuery,
    GameObjectQuery,
    PlayerQuery,
} from "../../Query/ArrayQuery.js";

// ====================================================================================================
/** 継続的効果。単一の常在型能力からの継続的効果か、または、単一の呪文や能力の解決によって生成された継続的効果 */
export type ContinuousEffect = GameObject & ContinuousEffectProperty;
export type ContinuousEffectProperty = {
    generatedBy: Spell | StackedAbility | Ability | undefined | string; // FIXME: stringは後で消す。StackedAbilityは正しい？
    timestamp: Timestamp;
};
type ContinuousEffectParameter = ContinuousEffectProperty;

/** ContinuousEffect を作成する */
export function createContinuousEffect(
    parameter: ContinuousEffectParameter,
): ContinuousEffect {
    return {
        ...createGameObject(),
        ...parameter,
    } satisfies ContinuousEffect;
}

// ========================================================================
// MARK: 特性を変更する効果
/** 特性を変更する継続的効果 */
export type CharacteristicsAlteringEffect<
    T extends QueryParameter = QueryParameter,
> = ContinuousEffect & CharacteristicsAlteringEffectProperty<T>;
// プロパティ
export type CharacteristicsAlteringEffectProperty<
    T extends QueryParameter = QueryParameter,
> = {
    affected: GameObjectQuery<T> | CardQuery<T> | PlayerQuery<T>;
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

/** 特性を変更する継続的効果を作成する */
export function createCharacteristicsAlteringEffect<
    T extends QueryParameter = QueryParameter,
>(
    parameters: ContinuousEffectParameter &
        CharacteristicsAlteringEffectParameter<T>,
): CharacteristicsAlteringEffect<T> {
    const effect = createContinuousEffect(parameters);
    return {
        ...effect,
        generatedBy: parameters.generatedBy,
        affected: parameters.affected,
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
export type CharacteristicsAlteringEffectParameter<
    T extends QueryParameter = QueryParameter,
> = Required<Pick<CharacteristicsAlteringEffectProperty<T>, "affected">> &
    Partial<Omit<CharacteristicsAlteringEffectProperty<T>, "affected">>;

// /** 指定した種類別のレイヤーを取得する */
// export function getLayer<T extends LayerCategory>(
//     effect: CharacteristicsAlteringEffect,
//     category: T,
// ): Layer<typeof category> | undefined {
//     switch (category) {
//         case "1a":
//             return effect.layer1a satisfies Layer<typeof category> | undefined;
//         case "1b":
//             return effect.layer1b;
//         case "2":
//             return effect.layer2;
//         case "3":
//             return effect.layer3;
//         case "4":
//             return effect.layer4;
//         case "5":
//             return effect.layer5;
//         case "6":
//             return effect.layer6;
//         case "7a":
//             return effect.layer7a;
//         case "7b":
//             return effect.layer7b;
//         case "7c":
//             return effect.layer7c;
//         case "7d":
//             return effect.layer7d;
//         default:
//             return undefined;
//     }
// }

// /** 指定した種類別の効果を持っているかどうか (undefinedも不可) */
// export function hasLayer<
//     T extends LayerCategory,
//     U extends QueryParameter = QueryParameter,
// >(
//     effect: unknown,
//     layerCategory: T,
//     parameter: U,
// ): effect is CharacteristicsAlteringEffect<U> & Required<_layerProperty<T, U>> {
//     return (
//         isCharacteristicsAlteringEffect(effect) &&
//         getLayer(effect, layerCategory) !== undefined
//     );
// }

// type _layerProperty<
//     T extends LayerCategory,
//     U extends QueryParameter = QueryParameter,
// > = {
//     [K in `layer${T}`]: Layer<T, U> | undefined;
// };

// ========================================================================
// MARK: 手続きを変更する効果
/** 手続きを変更する継続的効果 */
export type ModifyProcedureEffect = ContinuousEffect &
    ModifyProcedureEffectProperty;
export type ModifyProcedureEffectProperty = {
    condition: ProcedureCondition;
    instruction: InstructionQuery;
};
type ProcedureCondition = undefined; // TODO:
type InstructionQuery = undefined; // TODO:
type ModifyProcedureEffectParameter = ModifyProcedureEffectProperty;

export function createModifyingProcedureEffect(
    parameters: ContinuousEffectProperty & ModifyProcedureEffectParameter,
): ModifyProcedureEffect {
    const effect = createContinuousEffect(parameters);
    return {
        ...effect,
        ...parameters, // FIXME: continuouseffectの部分を取り除く
    };
}

// ========================================================================
// MARK: 処理を禁止する効果
/** 処理を禁止する継続的効果 */
export type ForbidActionEffect = ContinuousEffect & ForbidActionEffectProperty;
export type ForbidActionEffectProperty = {
    condition: ProcedureCondition; // TODO: procedureとは区別してactionにする必要がある？
};
type ForbidActionEffectParameter = ForbidActionEffectProperty;

export function createForbidActionEffect(
    parameters: ContinuousEffectProperty & ForbidActionEffectParameter,
): ForbidActionEffect {
    const obj = createContinuousEffect(parameters);
    return {
        ...obj,
        ...parameters, // FIXME: continuouseffectの部分を取り除く
    };
}

// ========================================================================================
// ========================================================================================
// ========================================================================================
// MARK: 型ガード
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

export function isCharacteristicsAlteringEffect(
    arg: unknown,
): arg is CharacteristicsAlteringEffect {
    return (
        isContinuousEffect(arg) && isCharacteristicsAlteringEffectProperty(arg)
    );
}
export function isCharacteristicsAlteringEffectProperty(
    arg: unknown,
): arg is CharacteristicsAlteringEffectProperty {
    return (
        typeof arg === "object" &&
        arg !== null &&
        "layer1a" in arg &&
        isLayer(arg.layer1a, "1a") &&
        "layer1b" in arg &&
        isLayer(arg.layer1b, "1b") &&
        "layer2" in arg &&
        isLayer(arg.layer2, "2") &&
        "layer3" in arg &&
        isLayer(arg.layer3, "3") &&
        "layer4" in arg &&
        isLayer(arg.layer4, "4") &&
        "layer5" in arg &&
        isLayer(arg.layer5, "5") &&
        "layer6" in arg &&
        isLayer(arg.layer6, "6") &&
        "layer7a" in arg &&
        isLayer(arg.layer7a, "7a") &&
        "layer7b" in arg &&
        isLayer(arg.layer7b, "7b") &&
        "layer7c" in arg &&
        isLayer(arg.layer7c, "7c") &&
        "layer7d" in arg &&
        isLayer(arg.layer7d, "7d")
    );
}

export function isModifyProcedureEffect(
    arg: unknown,
): arg is ModifyProcedureEffect {
    return false; // TODO:
}
export function isModifyProcedureEffectProperty(
    arg: unknown,
): arg is ModifyProcedureEffectProperty {
    return false; // TODO:
}

export function isForbidActionEffect(arg: unknown): arg is ForbidActionEffect {
    return false; // TODO:
}
export function isForbidActionEffectProperty(
    arg: unknown,
): arg is ForbidActionEffectProperty {
    return false; // TODO:
}
