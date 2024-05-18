'use strict';

/** 処理指示を表すクラス。効果やターン起因処理、状況起因処理などの行う指示
 * ゲーム中に実行されるときにInGameReferenceを通じて実際のゲーム内の情報を注入される
 */
class InGameInstruction {
    id
    performer
    perform() {}
}

// キーワード処理 0日目
// TODO 托鉢するものは置換処理の方で特別扱いする
class DrawInstruction extends InGameInstruction {
    number_of_cards
    draw() {}
    perform() {
        this.draw()
    }
}
class DealDamageInstruction extends InGameInstruction {
    obj  // InGameReference[]
}
class ResolveInstruction extends InGameInstruction {}
class GenerateDelayedTriggeredAbilityInstruction {}
// target

// キーワード処理 1日目
class TapInstruction extends InGameInstruction {}
class UntapInstruction extends InGameInstruction {}
class CastInstruction extends InGameInstruction {}
class ActivateInstruction extends InGameInstruction {}
class PlayInstruction extends InGameInstruction {}
class DiscardInstruction extends InGameInstruction {}
class DestroyInstruction extends InGameInstruction {}
class ExileInstruction extends InGameInstruction {}
class SacrificeInstruction extends InGameInstruction {}
class RevealInstruction extends InGameInstruction {}
class SearchInstruction extends InGameInstruction {}
class ShuffleInstruction extends InGameInstruction {}

// キーワード処理 2日目
class CounterInstruction extends InGameInstruction {}
class AttachInstruction extends InGameInstruction {}
class UnattachInstruction extends InGameInstruction {}
class CreateInstruction extends InGameInstruction {}
class DoubleInstruction extends InGameInstruction {}
class ExchangeInstruction extends InGameInstruction {}
class FightInstruction extends InGameInstruction {}
class ScryInstruction extends InGameInstruction {}
class MillInstruction extends InGameInstruction {}

// キーワード処理 3日目
class TransformInstruction extends InGameInstruction {}

/** 処理指示から何かへの参照を表すクラス */
class InGameReference {
    static reference_count = 0
    reference_id
    ingame_id
}
class InGameObjectReference extends InGameReference {}
class InGamePlayerReference extends InGameReference {}

