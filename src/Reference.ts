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
import { Card, GameObject, Player, Zone, ZoneType } from "./GameObject";

export type ReferenceParam = {
    state: GameState;
    history?: GameHistory;
    /** この参照において「これ自身」であるオブジェクト */
    self?: GameObject;
    // /** この参照における「これ自身」が能力である場合、それの発生源であるオブジェクト */
    // source_of_ability?: GameObject;
};
/** 参照型を使って参照可能な型。 */
export type Referable = GameObject | Player | Zone | number | string;

// ==============================================================================
/** 単一参照。単一の`T`を返す。
 * - `T`: 戻り値の型。`Referable`である任意の型。
 * - `U`: 追加の引数。任意のオブジェクト型。
 */
export type SingleRef<T extends Referable> = (param: ReferenceParam) => T;

/** 複数参照。`T[]`を返す。
 * - `T`: 戻り値の配列の要素の型。`Referable`である任意の型。
 * - `U`: 追加の引数。任意のオブジェクト型。
 */
export type MultiRef<T extends Referable> = (param: ReferenceParam) => T[];

/** 単一または複数参照型。 */
export type Ref<T extends Referable = Referable> = SingleRef<T> | MultiRef<T>;

// ==============================================================================
/** `T`に解決可能な型。`T`または`SingleRef<T>`。 */
export type SingleSpec<T extends Referable> = T | SingleRef<T>;

/** `T[]`に解決可能な型。`SingleSpec<T>[]`または`MultiRef<T>`。 */
export type MultiSpec<T extends Referable> = SingleSpec<T>[] | MultiRef<T>;

/** `T`または`T[]`に解決可能な型。 */
export type Spec<T extends Referable> = SingleSpec<T> | MultiSpec<T>;

// ==============================================================================
/**
 * `SingleSpec<T>`と`QueryParam`を`T`に解決して返す。
 * @param spec `T`に解決可能な型
 * @param param 参照の解決に使うパラメータ
 * @returns `spec`が`T`なら、`spec`を返す。
 * `spec`が`SingleRef<T>`なら、`spec(param)`を返す。
 */
export function resolve_single_spec<T extends Referable>(
    spec: SingleSpec<T>,
    param: ReferenceParam
): T {
    if (typeof spec === "function") {
        return spec(param);
    } else {
        return spec;
    }
}
/**
 * `MultiSpec<T>`を`T[]`に解決して返す関数
 */
export function resolve_multiple_spec<T extends Referable>(
    spec: MultiSpec<T>,
    param: ReferenceParam
): T[] {
    if (Array.isArray(spec)) {
        return spec.map((s) => resolve_single_spec<T>(s, param));
    } else {
        return spec(param);
    }
}

/** `Spec<T, U> | MultipleSpec<T, U>`を解決し、`T | T[]`を返す関数。 */
export function resolve_spec<T extends Referable>(
    spec: Spec<T>,
    param: ReferenceParam
): T | T[] {
    if (Array.isArray(spec)) {
        return spec.map((s) => resolve_single_spec<T>(s, param));
    } else if (typeof spec === "function") {
        return spec(param);
    } else {
        return spec;
    }
}

// ==============================================================================
// 参照生成ユーティリティ
/** 引数`T | T[]`に関数`func`を適用後、`U[]`に展開する。
 * - 引数が`T`かつ`func`の戻り値が`U`である（配列でない）場合、
 * 戻り値を要素１つだけを持つ配列`U[]`に入れて返す。
 * - 引数が`T[]`かつ`func`の戻り値が`U[]`（配列）である場合、
 * 深さ1の`Array.prototype.flat()`により戻り値をフラット化し`U[]`にして返す。
 */
export function flatApply<T, U>(arg: T | T[], func: (t: T) => U | U[]): U[] {
    if (Array.isArray(arg)) {
        arg.flatMap((a) => func(a));
    } else {
        const ret = func(arg);
        return Array.isArray(ret) ? ret : [ret];
    }
    throw new Error("Unreachable code");
}

/** オブジェクトのオーナー */
function owner(object: SingleSpec<GameObject>): SingleSpec<Player> {
    if (typeof object == "function") {
        return (param: ReferenceParam) => {
            const obj = resolve_single_spec(object, param);
            return obj.owner;
        };
    } else {
        return (param: ReferenceParam) => object.owner;
    }
}

/** オブジェクト1つに対し、そのオーナーの`zonetype`の領域 */
function zone_of_object_owner(
    object: SingleSpec<GameObject>,
    zonetype: ZoneType
): SingleRef<Zone> {
    return (param) => {
        return param.state.get_zone(zonetype, param.state.xxx);
    };
}

/** オーナーの手札 */
export const owners_hand = zone_of_object_owner(ZoneType.Hand);

/** 1人以上のプレイヤーに対し、それらのプレイヤーのコントロールしているすべてのクリーチャー */
export function creatures_controlled_by_player(): MultiRef<
    GameObject,
    { controller: Player }
> {
    return (param, optional) => {
        const _get_creatures = (pl: Player) =>
            param.state.get_objects(
                (obj) =>
                    obj.is_permanent([CardType.Creature]) &&
                    obj.controller == pl
            );
        return flatApply<Player, GameObject>(
            optional.controller,
            _get_creatures
        );
    };
}

/** 条件`spec`を満たすすべてのパーマネント */
export function permanent_of(
    spec: (obj: GameObject) => boolean
): Ref<GameObject, {}> {
    return (param) => {
        return param.state.get_objects(
            (obj) => obj.is_permanent() && spec(obj)
        );
    };
}

/** オブジェクトに対し、それの対象 */
// export function target(): MultipleReference<GameObject | Player> {
//     return (params: QueryParam) => params.self?.target;
// }

/** プレイヤー1人に対し、そのプレイヤーのライブラリーの一番上のカード */
// export function top_of_library(player: Player): MultipleReference<GameObject> {}
