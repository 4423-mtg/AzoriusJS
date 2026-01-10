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
/** ゲームの各瞬間を表す。`GameState`と、直前の状態からどのような操作をしたかを表す`Instruction`の組。 */
export type HistoryEntry = {
    state: GameState;
    instructions: Instruction[];
};

/** Gameを1つ進める。 */
export function goToNext(game: Game): void {
    const current = game.history.at(-1);
    if (current === undefined) {
        throw Error();
    } else {
        // 次のInstructionを得る
        const nextInstructions = _getNextInstructions(game);

        // Instructionを適用しつつ、historyに入れる
        game.history.push({
            state: applyInstruction(current.state, nextInstructions),
            instructions: nextInstructions,
        });
    }
}

/** ゲームの次の状態を得るのに必要な、次に行うべき`Instruction`を得る。
 * 最後に行われた instruction が完了状態なら、stateから取得する。
 * そうでないなら、instructionから続きを取得する。
 */
function _getNextInstructions(game: Game): Instruction[] {
    const current = game.history.at(-1);
    if (current === undefined) {
        throw new Error();
    } else {
        const _first = current.instructions[0];
        if (_first === undefined) {
            throw new Error("");
        } else {
            // 最後に行われた instruction が完了状態なら、stateから取得する。
            // そうでないなら、instructionから続きを取得する。
            return _first.completed
                ? getNextInstructionsFromState(current.state)
                : getNextInstructionChain(current.instructions);
        }
    }
}
