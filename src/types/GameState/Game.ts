import type { MatchInfo } from "./Match.js";
import {
    applyInstruction,
    getNextInstructionsFromState,
    type GameState,
} from "./GameState.js";
import {
    getNextInstructionChain,
    type Instruction,
} from "../Instruction/Instruction.js";

// MARK: Game
/** ゲーム全体。ゲームのすべての断面を持つ。 */
export type Game = {
    matchInfo: MatchInfo;
    history: HistoryEntry[];
};
export type HistoryEntry = {
    state: GameState;
    instructions: Instruction[];
};

/** Gameを1つ進める。 */
export function goToNext(game: Game): void {
    const current = game.history.at(-1);
    if (current !== undefined) {
        const nextInstructions = _getNextInstructions(game);
        game.history.push({
            state: applyInstruction(current.state, nextInstructions),
            instructions: nextInstructions,
        });
    } else {
        throw Error();
    }
}

/** 次に行うべき処理を得る。 */
function _getNextInstructions(game: Game): Instruction[] {
    const current = game.history.at(-1);
    if (current !== undefined) {
        const _first = current.instructions[0];
        if (_first !== undefined) {
            // 最後に行われた instruction が完了状態なら、stateから取得する。
            // そうでないなら、instructionから続きを取得する。
            return _first.completed
                ? getNextInstructionsFromState(current.state)
                : getNextInstructionChain(current.instructions);
        } else {
            throw new Error("");
        }
    } else {
        throw new Error();
    }
}
