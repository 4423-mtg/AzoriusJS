/** 処理指示が何かを参照することを表すクラス */
// TODO 任意の参照を作らなければならない...
// 「このターンに戦場に出た」「このターン〇〇にダメージを与えた」とかなんでもあり得る...
// 「このターンに呪文を唱えた回数」（ストーム）
// => コードレベルで書けるようにするしかない
// gamestateとgamehistoryが引数でいい？　たぶん。

// 「対象のプレイヤーがコントロールするすべてのクリーチャー」を表す参照
// new Reference((gamestate, gamehistory) => {
//     return gamestate.get_objects({
//         is_permanent: true,
//         type: Type.Creature,
//         controller: this.target,
//     });
// })
import { GameState, GameHistory } from "./Game";

type GameQuery = (
    game_state: GameState,
    game_history: GameHistory,
    self: any,
    source?: any
) => any;

export class Reference {
    /** game_state: ゲームの状態 \
     * game_history: ゲームの履歴 \
     * self: この参照を含むゲーム内オブジェクト
     */
    query_function: GameQuery;
    constructor(func: GameQuery) {
        this.query_function = func;
    }
    /** なんでも返ってくる InGameObject[], int, string, ... */
    execute(game_state: GameState, game_history: GameHistory, self: any): any {
        return this.query_function(game_state, game_history, self);
    }
}

// よく使う参照は使いまわしたい
/** 指定プレイヤーのコントロールしているクリーチャー */
export function creatures_controlled_by(player: any): Reference {
    return new Reference((state, history, self, source) => {
        // TODO 発生源も必要？
        return state.get_objects({
            // TODO GameState.get_objects()
            is_permanent: true,
            type: Type.Creature, // TODO Type
            controller: player,
        });
    });
}

/** 対象 */
export const Target = new Reference((state, history, self, source: any) => {
    return self.target;
});
