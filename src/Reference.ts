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
import { CardType } from "./Characteristic";
import { GameState, GameHistory } from "./Game";
import { GameObject, Zone } from "./GameObject";

export type QueryParam = {
    state: GameState;
    history?: GameHistory;
    /** この参照において「これ自身」であるオブジェクト */
    self?: GameObject;
    /** この参照における「これ自身」が能力である場合、それの発生源であるオブジェクト */
    source?: GameObject;
};

export class Reference {
    query_func: (args: QueryParam) => any;

    constructor(func: (args: QueryParam) => any) {
        this.query_func = func;
    }

    /** なんでも返ってくる InGameObject[], int, string, ... */
    execute(args: QueryParam): any {
        return this.query_func(args);
    }
}

/** オブジェクトへの参照 */
export class ObjectReference extends Reference {
    execute(args: QueryParam): GameObject[] {
        const ret = super.execute(args);
        if (!Array.isArray(ret)) {
            throw Error("error");
        } else if (ret.some((obj) => !(obj instanceof GameObject))) {
            throw Error("error");
        } else {
            return ret;
        }
    }
}

/** 値の参照 */
export class ValueReference extends Reference {
    execute(args: QueryParam): number {}
}

/** 領域の参照 */
export class ZoneReference extends Reference {
    execute(args: QueryParam): Zone {}
}

// よく使う参照は使いまわしたい
/** 指定プレイヤーのコントロールしているクリーチャー */
export function creatures_controlled_by(player: any): Reference {
    return new Reference((args: QueryParam) => {
        // TODO 発生源も必要？
        return args.state.get_objects({
            // TODO GameState.get_objects()
            is_permanent: true,
            type: CardType.Creature, // TODO Type
            controller: player,
        });
    });
}

/** プレイヤーのライブラリーの一番上のカード */
export function top_of_library(player: Player): ObjectReference {}

/** プレイヤーの領域 */
// export function

/** 対象 */
export const TargetOfThis = new Reference((args: QueryParam) => {
    return args.self?.target;
});
