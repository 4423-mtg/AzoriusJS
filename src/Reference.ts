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

export type QueryParam = {
    state: GameState;
    history?: GameHistory;
    /** この参照において「これ自身」であるオブジェクト */
    self?: GameObject;
    /** この参照における「これ自身」が能力である場合、それの発生源であるオブジェクト */
    source?: GameObject;
};

// ==============================================================================
/** 参照型を使って参照可能な型。 */
export type Referable = GameObject | Player | Zone;

export type Reference<T extends Referable, U extends Object = {}> =
    | SingleReference<T, U>
    | MultipleReference<T, U>;

/** 参照。引数として`QueryParam`を受け取り、単一の`T`を返す。\
 * `T`: 戻り値の型。`Referable`である任意の型。\
 * `U`: 追加の引数。任意のオブジェクト型。
 */
export type SingleReference<T extends Referable, U extends Object = {}> = (
    param: QueryParam & U
) => T;

/** 複数参照。引数として`QueryParam`を受け取り、`T[]`を返す。\
 * `T`: 戻り値の配列の要素の型。`Referable`である任意の型。\
 * `U`: 追加の引数。任意のオブジェクト型。
 */
export type MultipleReference<T extends Referable, U extends Object = {}> = (
    param: QueryParam & U
) => T[];

// ==============================================================================
export type Spec<T extends Referable, U extends Object = {}> =
    | SingleSpec<T, U>
    | MultipleSpec<T, U>;

/** `T`に解決可能な型。`T`または`Reference<T, U>`。 */
export type SingleSpec<T extends Referable, U extends Object = {}> =
    | T
    | SingleReference<T, U>;
/** `T[]`に解決可能な型。`Spec<T,U>[]`または`MultipleReference<T,U>`。 */
export type MultipleSpec<T extends Referable, U extends Object = {}> =
    | (T | SingleReference<T, U>)[]
    | MultipleReference<T, U>;

/**
 * `SingleSpec<T, U>`と`QueryParam`と`U`を引数に取り、`T`に解決して返す関数
 * @param spec `T`そのもの、または`T`への参照
 * @param param 参照の解決に使うパラメータ
 * @returns `spec`が`T`なら、`spec`を返す。
 * `spec`が`Reference<T>`なら、`spec(param)`を返す。
 */
export function resolve_single_spec<T extends Referable, U extends Object = {}>(
    spec: SingleSpec<T, U>,
    param: QueryParam & U
): T {
    if (typeof spec === "function") {
        return spec(param);
    } else {
        return spec;
    }
}
/**
 * `MultipleSpec<T,U>`を`T[]`に解決して返す関数
 */
export function resolve_multiple_spec<
    T extends Referable,
    U extends Object = {}
>(spec: MultipleSpec<T, U>, param: QueryParam & U): T[] {
    if (Array.isArray(spec)) {
        return spec.map((s) => resolve_single_spec<T, U>(s, param));
    } else if (typeof spec === "function") {
        return spec(param);
    }
    throw new Error("Unreachable code");
}

/** `Spec<T, U> | MultipleSpec<T, U>`を解決し、`T | T[]`を返す関数。 */
export function resolve_spec<T extends Referable, U extends Object = {}>(
    spec: SingleSpec<T, U> | MultipleSpec<T, U>,
    param: QueryParam & U
): T | T[] {
    if (Array.isArray(spec)) {
        return spec.map((s) => resolve_single_spec<T, U>(s, param));
    } else if (typeof spec === "function") {
        return spec(param);
    } else {
        return spec;
    }
}

// ==============================================================================
// 参照生成ユーティリティ

/** オブジェクトに対し、そのオーナーの特定の領域 */
// TODO あるオブジェクトに対しオーナーは一意に定まる事実を前提としている。
// --> もっと汎化できる？
export function owners_zone_of_object(
    zonetype: ZoneType
): SingleReference<Zone, { object_spec: SingleSpec<GameObject> }> {
    return (
        param: Parameters<
            SingleReference<Zone, { object_spec: SingleSpec<GameObject> }>
        >[number]
    ) => {
        const obj = resolve_single_spec<GameObject>({
            spec: param.object_spec,
            param: param,
        });
        return param.state.get_zone(zonetype, obj.owner);
    };
}

/** あるプレイヤー1人のコントロールしているすべてのクリーチャー */
export function creatures_controlled_by_player(): MultipleReference<
    GameObject,
    { controller: SingleSpec<Player> }
> {
    return (
        param: Parameters<
            MultipleReference<GameObject, { controller: SingleSpec<Player> }>
        >[number]
    ) =>
        param.state.get_objects(
            (obj) =>
                obj.is_permanent([CardType.Creature]) &&
                obj.controller ===
                    resolve_single_spec<Player>({
                        spec: param.controller,
                        param: param,
                    })
        );
}

/** パーマネント */
export function PermanentSpec(spec): MultipleReference<GameObject> {}

/** 対象 */
export function Target(): MultipleReference<GameObject | Player> {
    return (params: QueryParam) => params.self?.target;
}

/** プレイヤーのライブラリーの一番上のカード */
export function Top_of_library(player: Player): MultipleReference<GameObject> {}

/** プレイヤーの領域 */
// export function
