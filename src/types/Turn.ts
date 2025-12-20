/** ターン、フェイズ、ステップを表すオブジェクト */
import type { Player } from "./GameObject/Player.js";
const { randomUUID } = await import("node:crypto");

/** ターン */
export type Turn = {
    id: TurnId;
    activePlayer: Player;
    isExtra: boolean;
};
type TurnId = ReturnType<typeof randomUUID>;
export type TurnParameters = Omit<Turn, "id">;
export function createTurn(params: TurnParameters): Turn {
    return {
        id: createTurnId(),
        activePlayer: params.activePlayer,
        isExtra: params.isExtra,
    };
}
function createTurnId(): TurnId {
    return randomUUID();
}

// ====================================================================
/** フェイズの種別 */
export const phaseType = [
    "Beginning",
    "Precombat Main",
    "Combat",
    "Postcombat Main",
    "Ending",
] as const;
export type PhaseType = (typeof phaseType)[number];

/** フェイズ */
export type Phase = {
    id: PhaseId;
    type: PhaseType;
    isExtra: boolean;
};
type PhaseId = ReturnType<typeof randomUUID>;
export type PhaseParameters = Omit<Phase, "id">;
export function createPhase(params: PhaseParameters): Phase {
    return {
        id: createPhaseId(),
        type: params.type,
        isExtra: params.isExtra,
    };
}
function createPhaseId(): PhaseId {
    return randomUUID();
}

// ====================================================================
/** ステップの種別 */
export const stepType = [
    "Untap",
    "Upkeep",
    "Draw",
    "Beginning of Combat",
    "Declare Attackers",
    "Declare Blockers",
    "Combat Damage",
    "End of Combat",
    "End",
    "Cleanup",
] as const;
export type StepType = (typeof stepType)[number];

/** ステップ */
export type Step = {
    id: StepId;
    type: StepType;
    isExtra: boolean;
};
type StepId = ReturnType<typeof randomUUID>;
export type StepParameters = Omit<Step, "id">;
export function createStep(params: StepParameters): Step {
    return {
        id: createStepId(),
        type: params.type,
        isExtra: params.isExtra,
    };
}
function createStepId() {
    return randomUUID();
}

// ====================================================================
type PhaseStepPair = {
    phaseType: PhaseType;
    stepType: StepType | undefined;
};

export const turnDefinition: Array<PhaseStepPair> = [
    { phaseType: "Beginning", stepType: "Untap" },
    { phaseType: "Beginning", stepType: "Upkeep" },
    { phaseType: "Beginning", stepType: "Draw" },
    { phaseType: "Precombat Main", stepType: undefined },
    { phaseType: "Combat", stepType: "Beginning of Combat" },
    { phaseType: "Combat", stepType: "Declare Attackers" },
    { phaseType: "Combat", stepType: "Declare Blockers" },
    { phaseType: "Combat", stepType: "Combat Damage" },
    { phaseType: "Combat", stepType: "End of Combat" },
    { phaseType: "Postcombat Main", stepType: undefined },
    { phaseType: "Ending", stepType: "End" },
    { phaseType: "Ending", stepType: "Cleanup" },
];

/** フェイズとステップの組から、それの次に来るフェイズとステップを返す。 */
export function getNextPhaseAndStep(
    phaseType: PhaseType,
    stepType?: StepType
): PhaseStepPair | undefined {
    const index = turnDefinition.findIndex(
        (e) => e.phaseType === phaseType && e.stepType === stepType
    );
    if (index === -1) {
        return undefined;
    } else if (index < turnDefinition.length) {
        return turnDefinition[index + 1];
    } else {
        return turnDefinition[0];
    }
}

function isValidPhaseAndStep(
    phaseType: PhaseType,
    stepType?: StepType
): boolean {
    return turnDefinition.includes({
        phaseType: phaseType,
        stepType: stepType,
    });
}

/** そのフェイズの最初のステップを返す。 */
export function getFirstStepOfPhase(
    phaseType: PhaseType
): StepType | undefined {
    return turnDefinition.find((e) => e.phaseType === phaseType)?.stepType;
}

// TODO: ターン起因処理
