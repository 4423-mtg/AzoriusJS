import type { Zone, ZoneType } from "./Zone.js";
import type { GameObject, GameObjectId } from "../GameObject/GameObject.js";
import type { Player } from "../GameObject/Player.js";
import type { Phase, Step, Turn } from "../Turn.js";
import type { Characteristics } from "../Characteristics/Characteristic.js";
import type { Card } from "../GameObject/Card/Card.js";
import type { Instruction } from "../Instruction/Instruction.js";
import type { StackedAbility } from "../GameObject/StackedAbility.js";
import type { Spell } from "../GameObject/Card/Spell.js";
import {
    hasLayer,
    isCharacteristicsAlteringEffect,
    isContinuousEffect,
    type CharacteristicsAlteringEffect,
} from "../GameObject/GeneratedEffect/ContinuousEffect.js";
import type { Timestamp } from "./Timestamp.js";
import {
    isAbility,
    isCharacteristicDefiningAbility,
} from "../GameObject/Ability.js";
import {
    isAnyLayer,
    isLayer1a,
    layerCategories,
    type AnyLayer,
    type Layer,
    type Layer1a,
    type Layer1b,
    type Layer2,
    type Layer3,
    type Layer4,
    type Layer5,
    type Layer6,
    type Layer7a,
    type Layer7b,
    type Layer7c,
    type Layer7d,
    type LayerCategory,
} from "../Characteristics/Layer.js";

export type GameState = {
    timestamp: Timestamp;
    objects: GameObject[];
    players: Player[];
    turnOrder: number[];
    zones: Zone[];
    currentTurn: Turn | undefined;
    currentPhase: Phase | undefined;
    currentStep: Step | undefined;
    numberOfPassedPlayers: number;
    /** 優先権を持っているプレイヤーのターンインデックス */
    currentPriorityPlayerIndex: number | undefined;
    /** 最後に優先権パスでない行動をしたプレイヤーのターンインデックス */
    latestActionPlayerIndex: number | undefined;
    /** このターンにクリンナップ・ステップをもう一度行うかどうか。 */
    cleanupAgainFlag: boolean;
    // TODO: 「最後に通常のターンを行ったプレイヤー」は要るのかどうか...
};

// MARK: 状態取得 ==================================================================
/** アクティブプレイヤーを取得する */
export function getActivePlayer(state: GameState): Player | undefined {
    return state.currentTurn?.activePlayer;
}
/** 優先権を持っているプレイヤーを取得する */
export function getPriorityPlayer(state: GameState): Player | undefined {
    if (state.currentPriorityPlayerIndex === undefined) {
        return undefined;
    } else {
        const playerIdx = state.turnOrder[state.currentPriorityPlayerIndex];
        return playerIdx === undefined ? undefined : state.players[playerIdx];
    }
}
/** 最後に優先権パスでない行動をしたプレイヤーを取得する */
export function getLatestActionPlayer(state: GameState): Player | undefined {
    if (state.latestActionPlayerIndex === undefined) {
        return undefined;
    } else {
        const playerIdx = state.turnOrder[state.latestActionPlayerIndex];
        return playerIdx === undefined ? undefined : state.players[playerIdx];
    }
}

/** プレイヤーをターン順で取得する */
export function getPlayersByTurnOrder(state: GameState): Player[] {
    return state.turnOrder.map((n) => {
        if (n < state.players.length) {
            return state.players[n] as Player; // FIXME: no as
        } else {
            throw Error();
        }
    });
}
/** 指定した領域を取得する */
export function getZones(
    state: GameState,
    option: { type: ZoneType; owner?: Player }
): Zone[] {
    return state.zones.filter(
        (z) => z.owner === option.owner && z.type === option.type
    );
}

// ==================================================================
/** 指定された特性であるオブジェクトをすべて取得する。 */
export function getObjectsWithCharacteristics(
    state: GameState,
    predicate?: (characteristics: Characteristics) => boolean
): {
    object: Card | Player;
    characteristics: Characteristics;
}[] {
    return getAllObjectsAndCharacteristics(state).filter(
        ({ object, characteristics }) => predicate?.(characteristics) ?? true
    );
}

/** すべてのオブジェクトと、それが現在取っている特性を取得する。 */
export function getAllObjectsAndCharacteristics(state: GameState): {
    object: Card | Player;
    characteristics: Characteristics;
}[] {
    // すべての特性変更効果
    const effects = state.objects.filter((o) =>
        isCharacteristicsAlteringEffect(o)
    );
    // 適用開始済み効果のリスト
    const appliedEffects: GameObjectId[] = [];
    // 適用済みレイヤー
    const appliedLayers: AnyLayer[] = [];

    // サブルーチン
    function subroutine(
        _effects: CharacteristicsAlteringEffect[],
        _layerCategory: LayerCategory
    ) {
        // リストアップする
        const _temp: {
            effect: CharacteristicsAlteringEffect;
            layer: Layer<typeof _layerCategory>;
        }[] = [];
        _effects.forEach((e) => {
            if (e.layers[_layerCategory] !== undefined) {
                // FIXME: 5種以下では能力無効チェックが入る (発生源の能力が失われている場合、
                // その能力からの継続的効果をすでに適用しているならそのまま適用し、していないならもうその能力からの効果は適用しない)
                _temp.push({ effect: e, layer: e.layers[_layerCategory] });
            }
        });
        // 順序を決定する＆適用リストに追加
        _sortLayers<typeof _layerCategory>(state, _temp).forEach(
            ({ effect, layer }) => {
                // 効果
                if (!appliedEffects.includes(effect.objectId)) {
                    appliedEffects.push(effect.objectId);
                }
                // レイヤー
                appliedLayers.push(layer);
            }
        );
    }

    // 各種類別について
    for (const cat of layerCategories) {
        // 特性定義能力
        subroutine(
            effects.filter((e) => isCharacteristicDefiningAbility(e.source)),
            cat
        );
        // 非特性定義能力
        subroutine(
            effects.filter((e) => !isCharacteristicDefiningAbility(e.source)),
            cat
        );
    }

    // レイヤーを順番に適用する
    const x = appliedLayers; // TODO: queryを解決しながら適用していく
}

/** レイヤーの適用順を決定する。 */
function _sortLayers<T extends LayerCategory>(
    state: GameState,
    args: { effect: CharacteristicsAlteringEffect; layer: Layer<T> }[]
): { effect: CharacteristicsAlteringEffect; layer: Layer<T> }[] {
    // - すべての継続的効果をすべての順序で適用してみて、依存をチェックする
    // - 依存があってループしているならタイムスタンプ順で適用、ループしていないなら依存順で適用する。依存がないものはタイムスタンプ順で適用する
    //   - 適用順は1つ適用するごとに再計算する

    return []; // TODO:
    // 複数のオブジェクトが同時に領域に入る場合、コントローラーがそれらの相対的なタイムスタンプ順を自由に決定する
}

export function getAllObjectsInZone(
    state: GameState,
    zone: Zone
): GameObject[] {
    return state.objects.filter((obj) => obj.zone === zone);
}

// ==================================================================
/** 次に行うべき処理を取得する。 */
export function getNextInstructionsFromState(state: GameState): Instruction[] {
    // TODO: ゲーム開始時
    if (
        // まだ誰も優先権を持っていないなら、ターン起因処理を行う
        state.currentPriorityPlayerIndex === undefined
    ) {
        // ターン起因処理 & アクティブプレイヤーが優先権を得る
        return [] as Instruction[];
    } else if (
        // 全員が優先権を放棄している
        state.currentPriorityPlayerIndex === state.latestActionPlayerIndex
    ) {
        const tempZones = getZones(state, { type: "Stack" });
        if (tempZones.length !== 1) {
            throw Error("Not Implemented");
        } else {
            const stack = tempZones[0] as Exclude<
                (typeof tempZones)[0],
                undefined
            >;
            const stackedObjects = getAllObjectsInZone(state, stack);
            if (stackedObjects.length === 0) {
                // スタックに何もなければ次へ進む。
                //   - 未使用のマナが消滅する。
                //   - 次のターン・フェイズ・ステップに移る。
                //     - TODO: クリンナップ2回目
                return [] as Instruction[];
            } else {
                // スタックに何かあれば解決する。
                const topObject = stackedObjects.at(-1) as
                    | Spell
                    | StackedAbility;
                return [{ type: "resolve", stackedObject: topObject }];
            }
        }
    } else {
        // 全員が優先権を放棄していないなら、優先権を持っている人は
        // 優先権行動をするか、優先権を放棄する
        return [] as Instruction[];
    }
}

// フェイズ開始
// ターン起因処理
// アクティブプレイヤーが優先権を得る
// 優先権行動
// 次のプレイヤーの優先権行動
// ...
// (全員パス)
// スタックにあれば解決、なければ次のフェイズへ

/** 処理を1つだけ実行して、結果のGameStateを返す。 */
// TODO: 置換効果等を考慮する
export function applyInstruction(
    state: GameState,
    instructions: Instruction[]
): GameState {
    const inst = instructions.at(-1);
    if (inst !== undefined) {
        const newState = deepCopyGamestate(state);
        switch (inst.type) {
            case "draw":
                // ドロー処理
                const x = inst;
                newState;
                break;
            case "simultaneous":
                break;
            default:
                inst;
                break;
        }
        return newState;
    } else {
        throw new Error();
    }
}

export function deepCopyGamestate(state: GameState): GameState {
    return { ...state }; // FIXME: shallow copy
}
