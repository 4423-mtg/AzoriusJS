import type { MatchInfo } from "./Match.js";
import { getNextInstruction, type GameState } from "./GameState.js";
import { getNextState, type Instruction } from "../Instruction/Instruction.js";

// MARK: Game
/** ゲーム全体。ゲームのすべての断面を持つ。 */
export type Game = {
    matchInfo: MatchInfo;
    history: GameStateSet[];
};
export type GameStateSet = {
    state: GameState;
    instruction: Instruction;
};

/** ゲームの状態を1つ進める。 */
export function proceed(game: Game): void {
    const current = game.history.at(-1);
    if (current === undefined) {
        throw Error();
    } else {
        const nextInstruction = getNextInstruction(current.state);
        const nextState = getNextState(nextInstruction, current.state);
        game.history.push({ state: nextState, instruction: nextInstruction });
    }
}
