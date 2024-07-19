"use strict";
import {
    Card,
    Characteristics,
    ContinuousEffect,
    ProcessForbiddingContinousEffect,
    ProcessAlteringContinousEffect,
} from "./GameObject";
import {
    Ability,
    ActivatedAbility,
    TriggeredAbility,
    SpellAbility,
    StaticAbility,
} from "./Ability";
import {
    MultipleReference,
    creatures_controlled_by_player,
    Target,
} from "./Reference";
import {
    GeneratingContinuousEffect,
    GeneratingProcessAlteringEffect,
    Instruction,
    Tapping,
    Untapping,
    VoidInstruction,
} from "./Instruction";
import { UntapStep } from "./Turn";
import { CardType, ManaSymbol, ManaSymbols } from "./Characteristic";

// 呪文 > 呪文能力 > 指示

// 睡眠
// プレイヤー１人を対象とする。そのプレイヤーがコントロールするすべてのクリーチャーをタップする。
// それらのクリーチャーは、そのプレイヤーの次のアンタップ・ステップの間にアンタップしない。
// OK
const card_sleep = new Card({
    name: ["Sleep"],
    mana_cost: ManaSymbols("2UU"),
    card_types: [CardType.Sorcery],
    abilities: [
        new SpellAbility({
            text: "Tap all creatures target player controls. Those creatures don’t untap during that player’s next untap step.",
            effects: () => {
                const ref_creatures =
                    creatures_controlled_by_player(TargetOfThis);
                return [
                    new Tapping([ref_creatures]),
                    new GeneratingProcessAlteringEffect(
                        ({ instruction, state }) =>
                            instruction.isInstanceOf(Untapping) &&
                            state.current_step === UntapStep,
                        new VoidInstruction()
                    ),
                ];
            },
        }),
    ],
});

// TODO よく使う効果を使い回せるようにしたい

// 可能な限り、カードに書かれているとおりに実装する。ルール変更によって挙動・解釈が変わることがあるため

// 砕ける波/Breaking Wave
// ソーサリー
// あなたが砕ける波を唱えるためにさらに(２)を支払うなら、あなたは砕ける波を、瞬速を持っているかのように唱えてもよい。（あなたはこれを、あなたがインスタントを唱えられるときならいつでも唱えてよい。）
// **同時に**、すべてのタップ状態のクリーチャーをアンタップし、すべてのアンタップ状態のクリーチャーをタップする。
