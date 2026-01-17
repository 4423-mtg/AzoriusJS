import type { Zone, ZoneType } from "./Zone.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type { Player } from "../GameObject/Player.js";
import type { Phase, Step, Turn } from "../Turn.js";
import type { Instruction } from "../Instruction/Instruction.js";
import type { StackedAbility } from "../GameObject/StackedAbility.js";
import type { Spell } from "../GameObject/Card/Spell.js";
import type { Timestamp } from "./Timestamp.js";

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

// ============================================================================
// MARK: 状態取得
// ============================================================================
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
    option: { type: ZoneType; owner?: Player },
): Zone[] {
    return state.zones.filter(
        (z) => z.owner === option.owner && z.type === option.type,
    );
}

export function getAllObjectsInZone(
    state: GameState,
    zone: Zone,
): GameObject[] {
    return state.objects.filter((obj) => obj.zone === zone);
}

// ============================================================================
// MARK: Instruction関連
// ============================================================================
/** ゲームの状態から、次に行うべき処理を取得する。 */ // TODO: 実装
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

/** ディープコピー */
export function deepCopyGamestate(state: GameState): GameState {
    // TODO: 実装
    return { ...state }; // FIXME: shallow copy
}
