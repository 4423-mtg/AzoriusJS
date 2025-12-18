import {
    Battlefield,
    Command,
    Exile,
    Graveyard,
    Hand,
    Library,
    Stack,
    type Zone,
    type ZoneType,
} from "./Zone.js";
import type { GameObject } from "../GameObject/GameObject.js";
import { Player } from "../GameObject/Player.js";
import type { Phase, Step, Turn } from "../Turn/Turn.js";
import type { Characteristics } from "../Characteristics/Characteristic.js";

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
    /** このターンにクリンナップ・ステップをもう一度行うかどうか。 */
    cleanupAgainFlag: boolean;
    /** アクティブプレイヤーのインデックス。 */
    currentActivePlayerIndex: number | undefined;
    /** 優先権を持っているプレイヤーのインデックス。 */
    currentPriorityPlayerIndex: number | undefined;
    /** 最後に通常のターンを行ったプレイヤーのインデックス。 */
    currentTurnOrderPlayer: number | undefined;

    //
};

export function deepCopyGamestate(state: GameState): GameState {
    return { ...state }; // FIXME: shallow copy
}
export function getAllObjectsWithCharacteristics(state: GameState): {
    object: GameObject;
    characteristics: Characteristics;
}[] {
    // TODO:
    // 特性定義能力を適用
    // 1a種すべてをすべての順序で適用してみて依存をチェック
    // 依存があってループしているならタイムスタンプ順で適用、ループしていないなら依存順で適用、依存がないならタイムスタンプ順で適用
    // - 適用順は１つ適用する事に再計算する
    // 第1b種
    // 第2種
    // 第3種
    // 第4種
    // 能力無効チェック (その能力からの継続的効果をすでに適用しているならそのまま適用し、していないならもうその能力からの効果は適用しない)
    // 第5種
    // 第6種
    // 能力無効チェック (その能力からの継続的効果をすでに適用しているならそのまま適用し、していないならもうその能力からの効果は適用しない)
    // 第7a種
    // 第7b種
    // 第7c種
    // 第7d種
    // TODO: 領域や唱え方、代替の特性などに影響される
    // 1. 特性定義能力を適用
    // 2. LayerInstanceの参照をすべて解決してすべての順序で適用してみて、依存をチェック
    // 3. 依存があってループしているならタイムスタンプ順で適用、ループしていないなら依存順で適用、依存がないならタイムスタンプ順で適用
    // - 適用順は１つ適用する事に再計算する
}
export function getObjectByCharacteristics(
    state: GameState,
    query?: (characteristics: Characteristics) => boolean
): {
    object: GameObject;
    characteristics: Characteristics;
}[] {
    return getAllObjectsWithCharacteristics(state).filter(
        ({ object, characteristics }) =>
            query === undefined ? true : query(characteristics)
    );
}
export function getActivePlayer(state: GameState): Player | undefined {
    if (state.currentActivePlayerIndex === undefined) {
        return undefined;
    } else {
        const plidx = state.turnOrder[state.currentActivePlayerIndex];
        return plidx === undefined ? undefined : state.players[plidx];
    }
}
export function getPriorityPlayer(state: GameState) {
    if (state.currentPriorityPlayerIndex === undefined) {
        return undefined;
    } else {
        const plidx = state.turnOrder[state.currentPriorityPlayerIndex];
        return plidx === undefined ? undefined : state.players[plidx];
    }
}
export function getTurnOrderPlayer(state: GameState) {
    if (state.currentTurnOrderPlayer === undefined) {
        return undefined;
    } else {
        const plidx = state.turnOrder[state.currentTurnOrderPlayer];
        return plidx === undefined ? undefined : state.players[plidx];
    }
}
export function getAllPlayersByTurnOrder(state: GameState) {}
export function getZone(
    state: GameState,
    option?: { owner?: Player; zonetype?: string }
) {}

// =============================================================================
// MARK: Timestamp
// =============================================================================
export type Timestamp = {
    id: TimestampId;
};

let _timestampid: number = -1;

export function createTimestamp() {
    return { id: ++_timestampid };
}

/** `timestamp1` が `timestamp2` よりも前なら負の値、同じなら `0` 、後なら正の値。 */
export function compareTimestamp(
    timestamp1: Timestamp,
    timestamp2: Timestamp
): number {
    return compareTimestampId(timestamp1.id, timestamp2.id);
}

export type TimestampId = number;
export function compareTimestampId(id1: TimestampId, id2: TimestampId): number {
    return id1 - id2;
}
