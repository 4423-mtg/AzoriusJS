import type { MatchInfo } from "./Match.js";
import {
    getNextInstructions,
    getNextState,
    type GameState,
} from "./GameState.js";
import {
    type Instruction,
    type SimultaneousInstructions,
} from "../Instruction/Instruction.js";

// MARK: Game
/** ゲーム全体。ゲームのすべての断面を持つ。 */
export type Game = {
    matchInfo: MatchInfo;
    history: HistoryEntry[];
};
export type HistoryEntry = {
    state: GameState;
    instruction: Instruction;
};

/** 処理を1つだけ実行し、Gameを更新する。 */
export function applyOneInstruction(
    game: Game,
    instruction: Instruction
): void {
    const current = game.history.at(-1);
    if (current === undefined) {
        throw Error();
    } else {
        const newEntry: HistoryEntry = {
            state: getNextState(current.state, instruction),
            instruction: instruction,
        };
        game.history.push(newEntry);
    }
}

/** 1つ以上の処理を実行し、Gameを更新する。 */
export function applyInstructions(
    game: Game,
    instructions: Instruction[] | SimultaneousInstructions
): void {
    if (Array.isArray(instructions)) {
        for (const inst of instructions) {
            applyOneInstruction(game, inst);
        }
    } else {
        // TODO: ?
    }
}
