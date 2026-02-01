import type { Zone } from "../GameState/Zone.js";

export type GameObjectQuery = {
    zone?: Zone;
    characteristics: {}; //
};

type AlterCardType = {
    cardtype: {
        type: "additional";
        cardtype: ["Creature"];
    };
};

// 4/+2
type AlterPT = {
    power: {
        type: "set";
        value: "4";
    };
    toughness: {
        type: "plus";
        value: "2";
    };
};

type AlterCopiableValue = {
    //
};

// 種類別（レイヤー）に関してはこれでOK。
// 手続き変更効果・処理禁止効果・置換効果・追加ターン効果についてはどう？

// 特性変化は常時再計算するため、関数である必要がある。
// 関数はシリアライズできない（＝効果をファイルに保存できない）
// => レイヤーではなく効果をシリアライズ保存対象にする。（レイヤーは静的なものにする）
//    対象や解決時の選択などは効果に保存する
//    - レイヤーは効果にどう記述する？
//      => とりあえずソースコードに書いてもいい。そのうちタグ化すれば保存もできる
// => クラスにする必要はある？しなくてもいいが、型ガードはできない
//   - 効果の定義を書くときに型ガードがないとチェックができない
//     => タグ化しよう

export type PTSpec = {
    arguments: { name: string; id?: GameObjectId }[];
    power: ValueQuery;
    toughness: ValueQuery;
    // FIXME: pt同時の方がよい？
};
export function isPTSpec(arg: unknown): arg is PTSpec {
    return false; // TODO:
}

export type ValueQuery =
    // 固定値
    | number
    // オブジェクトの数値
    | { value: "power" | "toughness" | "manaValue"; object: GameObjectId }
    // 何かの個数
    | { value: "numberOfCards"; object: GameObjectQuery }
    // 何かの合計値
    | {};
export type GameObjectQuery = { argument: string } | {}; // TODO: 「これ以外」
export function isGameObjectQuery(arg: unknown): arg is GameObjectQuery {}
export type PlayerQuery = {};
export function isPlayerQuery(arg: unknown): arg is PlayerQuery {}
