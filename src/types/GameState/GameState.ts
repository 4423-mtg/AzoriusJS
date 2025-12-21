import { type Zone, type ZoneType } from "./Zone.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type { Player } from "../GameObject/Player.js";
import type { Phase, Step, Turn } from "../Turn.js";
import type { Characteristics } from "../Characteristics/Characteristic.js";
import type { Card } from "../GameObject/Card/Card.js";
import type {
    Instruction,
    SimultaneousInstructions,
} from "../Instruction/Instruction.js";

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
    latestActionPlayer: number | undefined;
    /** このターンにクリンナップ・ステップをもう一度行うかどうか。 */
    cleanupAgainFlag: boolean;
    // TODO: 「最後に通常のターンを行ったプレイヤー」は要るのかどうか...
};
// FIXME: 配列のキーの型を明示的に定義したほうがいい？（ターン順のため）

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
    if (state.latestActionPlayer === undefined) {
        return undefined;
    } else {
        const playerIdx = state.turnOrder[state.latestActionPlayer];
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

// ==================================================================
/** 次に行うべき処理を取得する。 */
export function getNextInstructions(
    state: GameState
): Instruction[] | SimultaneousInstructions {
    // stateに応じて変わる。
    // - 全員が優先権を放棄している
    if (state.currentPriorityPlayerIndex === undefined) {
    }
    //   - スタックにあれば解決する。
    //   - スタックになければ次へ進む。
    //     - 未使用のマナが消滅する。
    //     - 次のターン・フェイズ・ステップに移る。
    // - 全員が優先権を放棄していない
    //   - 次の人が優先権行動をするか、優先権を放棄する
    //
    // TODO:
    // - ターン起因処理 (まだ誰も優先権を持っていないなら。その後アクティブプレイヤーが優先権を得る)
    // - クリンナップ2回目
    // - ゲーム開始時の処理
}

// フェイズ開始
// ターン起因処理
// アクティブプレイヤーが優先権を得る
// 優先権行動
// 次のプレイヤーの優先権行動
// ...
// (全員パス)
// スタックにあれば解決、なければ次のフェイズへ

/** 処理を1つ適用し、新しい GameState を生成して返す。 */
export function getNextState(
    state: GameState,
    instruction: Instruction
): GameState {
    // 置換効果などを考慮する。
}

// 不要になった？
export function deepCopyGamestate(state: GameState): GameState {
    return { ...state }; // FIXME: shallow copy
}

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
