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
import { ActivatedAbility, SpellAbility, TriggeredAbility } from "./Ability";
import { CardType } from "./Characteristic";
import { GameState, GameHistory } from "./Game";
import { Card, GameObject, Player, Zone, ZoneType } from "./GameObject";

export type QueryParam = {
    state: GameState;
    history?: GameHistory;
    /** この参照において「これ自身」であるオブジェクト */
    self?: GameObject;
    /** この参照における「これ自身」が能力である場合、それの発生源であるオブジェクト */
    source?: GameObject;
};

// ==============================================================================
/** 任意の参照 */
export type Reference =
    | ObjectReference
    | NumberReference
    | PlayerReference
    | ZoneReference;
// ==============================================================================
/** オブジェクトへの参照 */
export type ObjectReference = (param: QueryParam) => GameObject[];
/** `GameObject | ObjectReference` を `GameObject[]` に変換する関数 */
export function get_objects(
    arg: GameObject | ObjectReference,
    param: QueryParam
) {
    return arg instanceof GameObject ? [arg] : arg(param);
}
// ==============================================================================
/** プレイヤーの参照 */
export type PlayerReference = (param: QueryParam) => Player[];
// ==============================================================================
/** オブジェクトかプレイヤーへの参照 */
export type ObjectOrPlayerReference = (
    param: QueryParam
) => (GameObject | Player)[];
// ==============================================================================
/** 数値の参照 */
export type NumberReference = (param: QueryParam) => number[];

// ==============================================================================
/** 領域の参照 */
export type ZoneReference = (param: QueryParam) => Zone[];
/** オブジェクトのオーナーの領域 */
export function owners_zone(
    object: GameObject | ObjectReference,
    zonetype: ZoneType
): ZoneReference {
    return (param: QueryParam) => {
        const obj = object instanceof GameObject ? object : object(param);
        if (Array.isArray(obj)) {
            throw new Error("");
        } else {
            return [param.state.getZone(zonetype, obj.owner)];
        }
    };
}
// ==============================================================================
// 参照生成ユーティリティ

/** 指定プレイヤーのコントロールしているクリーチャー */
export function Creatures_controlled_by(player: Player): ObjectReference {
    return ({ state }: { state: GameState }) =>
        state.get_objects((obj: GameObject) => {
            return (
                obj.is_permanent() &&
                obj.characteristics.card_types !== undefined &&
                obj.characteristics.card_types.includes(CardType.Creature) &&
                obj.controller == player
            );
        });
}

/** パーマネント */
export function PermanentSpec(spec): ObjectReference {}

/** 対象 */
export function Target(): ObjectOrPlayerReference {
    return (params: QueryParam) => params.self?.target;
}

/** プレイヤーのライブラリーの一番上のカード */
export function Top_of_library(player: Player): ObjectReference {}

/** プレイヤーの領域 */
// export function
