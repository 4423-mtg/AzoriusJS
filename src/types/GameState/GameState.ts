import type { Zone, ZoneType } from "./Zone.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type { Player } from "../GameObject/Player.js";
import type { Phase, Step, Turn } from "../Turn.js";
import type { Characteristics } from "../Characteristics/Characteristic.js";
import type { Card } from "../GameObject/Card/Card.js";
import type { Instruction } from "../Instruction/Instruction.js";
import type { StackedAbility } from "../GameObject/StackedAbility.js";
import type { Spell } from "../GameObject/Card/Spell.js";
import {
    isCharacteristicsAlteringEffect,
    isContinuousEffect,
} from "../GameObject/GeneratedEffect/ContinuousEffect.js";
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
    const effects = state.objects.filter((o) =>
        isCharacteristicsAlteringEffect(o)
    );
    // 第1種
    const effects1 = effects.map((e) => ({ effect: e, layer: e.layers["1a"] }));

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
