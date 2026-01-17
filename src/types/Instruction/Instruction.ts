/** 効果やルールによってゲーム中に行われる指示。 */
import type { Player } from "../GameObject/Player.js";
import type { SingleSpec } from "../Query/Query.js";
import type { InstructionType } from "./InstructionType.js";
import type {
    BeginPhaseAndStep,
    BeginStep,
    BeginTurn,
    ChooseValue,
    DealDamage,
    Draw,
    GainLife,
    Look,
    Move,
    Pay,
    PutCounter,
    PutTriggerdAbilitiesOnStack,
    Resolve,
    SeparateIntoPiles,
    StateBasedAction,
    Trigger,
    TurnBasedAction,
    TurnFaceDown,
    TurnFaceUp,
} from "./BasicInstruction.js";
import type {
    Activate,
    Attach,
    Behold,
    Cast,
    Convert,
    CounterSpellOrAbility,
    Create,
    Destroy,
    Discard,
    Double,
    Exchange,
    Exile,
    Fight,
    Goad,
    Investigate,
    Mill,
    Play,
    Regenerate,
    Reveal,
    Sacrifice,
    Scry,
    Search,
    Shuffle,
    Surveil,
    Tap,
    Transform,
    Triple,
    Unattach,
    Untap,
} from "./KeywordAction.ts/Evergreen.js";

// ==========================================================================
// MARK: 型定義
/** 処理。 */
export type Instruction<T extends InstructionType = InstructionType> =
    T extends "simultaneous"
        ? SimultaneousInstructions
        : T extends "chooseInstruction"
        ? ChooseInstruction
        : T extends "move"
        ? Move
        : T extends "trigger"
        ? Trigger
        : T extends "resolve"
        ? Resolve
        : T extends "pay"
        ? Pay
        : T extends "draw"
        ? Draw
        : T extends "beginTurn"
        ? BeginTurn
        : T extends "beginPhaseAndStep"
        ? BeginPhaseAndStep
        : T extends "beginStep"
        ? BeginStep
        : T extends "dealDamage"
        ? DealDamage
        : T extends "gainLife"
        ? GainLife
        : T extends "putCounter"
        ? PutCounter
        : T extends "look"
        ? Look
        : T extends "separateIntoPiles"
        ? SeparateIntoPiles
        : T extends "chooseValue"
        ? ChooseValue
        : T extends "turnFaceDown"
        ? TurnFaceDown
        : T extends "turnFaceUp"
        ? TurnFaceUp
        : T extends "turnBasedAction"
        ? TurnBasedAction
        : T extends "stateBasedAction"
        ? StateBasedAction
        : T extends "putTriggerdAbilitiesOnStack"
        ? PutTriggerdAbilitiesOnStack
        : T extends "activate"
        ? Activate
        : T extends "attach"
        ? Attach
        : T extends "unattach"
        ? Unattach
        : T extends "behold"
        ? Behold
        : T extends "cast"
        ? Cast
        : T extends "counter"
        ? CounterSpellOrAbility
        : T extends "create"
        ? Create
        : T extends "destroy"
        ? Destroy
        : T extends "discard"
        ? Discard
        : T extends "double"
        ? Double
        : T extends "triple"
        ? Triple
        : T extends "exchange"
        ? Exchange
        : T extends "exile"
        ? Exile
        : T extends "fight"
        ? Fight
        : T extends "goad"
        ? Goad
        : T extends "investigate"
        ? Investigate
        : T extends "mill"
        ? Mill
        : T extends "play"
        ? Play
        : T extends "regenerate"
        ? Regenerate
        : T extends "reveal"
        ? Reveal
        : T extends "sacrifice"
        ? Sacrifice
        : T extends "scry"
        ? Scry
        : T extends "search"
        ? Search
        : T extends "shuffle"
        ? Shuffle
        : T extends "surveil"
        ? Surveil
        : T extends "tap"
        ? Tap
        : T extends "untap"
        ? Untap
        : T extends "transform"
        ? Transform
        : T extends "convert"
        ? Convert
        : never;

/** Instructionの定義用 */
export type DefineInstruction<
    T extends InstructionType,
    U extends { [K: PropertyKey]: unknown } & _ForbidKeys<
        keyof _InstructionCommonAttributes<T>
    > = {},
> = _InstructionCommonAttributes<T> & U;

/** Instructionの共通フィールド */
type _InstructionCommonAttributes<T extends InstructionType> = {
    type: T;
    instructor: SingleSpec<Player>;
    performer: SingleSpec<Player>;
    completed: boolean;
};
type _ForbidKeys<K extends PropertyKey> = {
    [P in K]?: never;
};

// ==========================================================================
// MARK: 関数
// - Instruction は入れ子になることがある。
//   - どのような入れ子になるかは各 Instruction が各自定義する。
/** Instructionのチェーンから、次の瞬間のInstructionのチェーンを得る。 */
export function getNextInstructionChain(chain: Instruction[]): Instruction[] {
    const incomplete = (instruction: Instruction) => !instruction.completed;
    const i = chain.findLastIndex(incomplete);
    const e = chain.findLast(incomplete);
    if (i === -1 || e === undefined) {
        throw new Error();
    } else {
        return chain.slice(0, i).concat(_yieldNext(e));
    }
}

/** 完了していないInstructionから、次のInstructionを生成する。 */ // TODO: 実装
export function _yieldNext(inst: Instruction): Instruction[] {
    if (inst.completed) {
        throw new Error();
    }
    switch (inst.type) {
        case "simultaneous":
            break;
        case "chooseInstruction":
            break;
        case "move":
            break;
        case "trigger":
            break;
        case "resolve":
            break;
        case "pay":
            break;
        case "draw":
            return [
                {
                    type: "draw",
                    instructor: inst.instructor,
                    performer: inst.performer,
                    completed: inst.number === ++inst.current,
                    number: inst.number,
                    current: ++inst.current,
                },
                {
                    type: "draw",
                    instructor: inst.instructor,
                    performer: inst.performer,
                    completed: true,
                    number: 1,
                    current: 1,
                },
            ];
        case "beginTurn":
            break;
        case "beginPhaseAndStep":
            break;
        case "beginStep":
            break;
        case "dealDamage":
            break;
        case "gainLife":
            break;
        case "putCounter":
            break;
        case "look":
            break;
        case "separateIntoPiles":
            break;
        case "chooseValue":
            break;
        case "turnFaceDown":
            break;
        case "turnFaceUp":
            break;
        case "turnBasedAction":
            break;
        case "stateBasedAction":
            break;
        case "putTriggerdAbilitiesOnStack":
            break;
        case "activate":
            break;
        case "attach":
            break;
        case "unattach":
            break;
        case "behold":
            break;
        case "cast":
            break;
        case "counter":
            break;
        case "create":
            break;
        case "destroy":
            break;
        case "discard":
            break;
        case "double":
            break;
        case "triple":
            break;
        case "exchange":
            break;
        case "exile":
            break;
        case "fight":
            break;
        case "goad":
            break;
        case "investigate":
            break;
        case "mill":
            break;
        case "play":
            break;
        case "regenerate":
            break;
        case "reveal":
            break;
        case "sacrifice":
            break;
        case "scry":
            break;
        case "search":
            break;
        case "shuffle":
            break;
        case "surveil":
            break;
        case "tap":
            break;
        case "untap":
            break;
        case "transform":
            break;
        case "convert":
            break;
        default:
            throw new Error(inst.type);
    }
}

export function executeInstruction(params: type) {}

// ==========================================================
// MARK: 基本
/** 複数の処理を同時に行う指示。 */ // ゴブリンの溶接工
export type SimultaneousInstructions = DefineInstruction<
    "simultaneous",
    {
        instructions: Instruction[];
    }
>;

/** 複数の処理から1つを選ばせる指示 */ // 優先権など
export type ChooseInstruction = DefineInstruction<
    "chooseInstruction",
    {
        instructions: Instruction[];
    }
>;
