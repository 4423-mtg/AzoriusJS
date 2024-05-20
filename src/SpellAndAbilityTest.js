'use strict';
import { Card, Characteristics, ContinuousEffect } from "./GameObject"
import { ActivatedAbility, TriggeredAbility, SpellAbility, StaticAbility } from "./Ability"
import * as Ins from "./Instruction"
import { Reference, creatures_controlled_by, Target } from "./Reference"

// 呪文 > 呪文能力 > 指示

// 睡眠
// プレイヤー１人を対象とする。そのプレイヤーがコントロールするすべてのクリーチャーをタップする。
// それらのクリーチャーは、そのプレイヤーの次のアンタップ・ステップの間にアンタップしない。
const card_sleep = new Card(new Characteristics({
    name: "sleep",
    mana_cost: "2UU",
    card_type: "Sorcery",
    text: "Tap all creatures target player controls. Those creatures don’t untap during that player’s next untap step.",
    ability: new SpellAbility(() => {
        const creatures = creatures_controlled_by(Target)  // FIXME
        return [
            new Ins.Tapping({permanent: creatures}),
            new Ins.GeneratingContinuousEffect(
                new ContinuousEffect()
            )
        ]
    }),
}))



// TODO よく使う効果を使い回せるようにしたい

