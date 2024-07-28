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
    /** この参照における「これ自身」が能力である場合、それの発生源であるオブジェクト */
    source_of_ability?: GameObject;
};

// ==============================================================================
/** 参照型を使って参照可能な型。 */
export type Referable = GameObject | Player | Zone | number | string;

export type OptionalArgs = Record<number | string | symbol, unknown>;

/** すべての参照型。 */
export type Reference<
    T extends Referable = Referable,
    U extends OptionalArgs = OptionalArgs
> = SingleReference<T, U> | MultipleReference<T, U>;

/** 単一参照。引数として`QueryParam`を受け取り、単一の`T`を返す。
 * - `T`: 戻り値の型。`Referable`である任意の型。
 * - `U`: 追加の引数。任意のオブジェクト型。
 */
export type SingleReference<
    T extends Referable,
    U extends OptionalArgs = OptionalArgs
> = (param: ReferenceParam, optional: U) => T;

/** 複数参照。引数として`QueryParam`を受け取り、`T[]`を返す。
 * - `T`: 戻り値の配列の要素の型。`Referable`である任意の型。
 * - `U`: 追加の引数。任意のオブジェクト型。
 */
export type MultipleReference<
    T extends Referable,
    U extends OptionalArgs = OptionalArgs
> = (param: ReferenceParam, optional: U) => T[];

export type OptionalArgsType<T> = T extends Reference<any, infer V> ? V : never;

type xxx = OptionalArgsType<Reference<Zone, { x: GameObject }>>;

// ==============================================================================
export type Spec<T extends Referable, U extends OptionalArgs = OptionalArgs> =
    | SingleSpec<T, U>
    | MultipleSpec<T, U>;

/** `T`に解決可能な型。`T`または`Reference<T, U>`。 */
export type SingleSpec<
    T extends Referable,
    U extends OptionalArgs = OptionalArgs
> = T | SingleReference<T, U>;

/** `T[]`に解決可能な型。`Spec<T,U>[]`または`MultipleReference<T,U>`。 */
export type MultipleSpec<
    T extends Referable,
    U extends OptionalArgs = OptionalArgs
> = SingleSpec<T, U>[] | MultipleReference<T, U>;

/**
 * `SingleSpec<T, U>`と`QueryParam`と`U`を引数に取り、`T`に解決して返す関数
 * @param spec `T`に解決可能な型
 * @param param 参照の解決に使うパラメータ
 * @returns `spec`が`T`なら、`spec`を返す。
 * `spec`が`Reference<T>`なら、`spec(param)`を返す。
 */
export function resolve_single_spec<
    T extends Referable,
    U extends OptionalArgs = OptionalArgs
>(spec: SingleSpec<T, U>, param: ReferenceParam, optional: U): T {
    if (typeof spec === "function") {
        return spec(param, optional);
    } else {
        return spec;
    }
}
/**
 * `MultipleSpec<T,U>`を`T[]`に解決して返す関数
 */
export function resolve_multiple_spec<
    T extends Referable,
    U extends OptionalArgs = OptionalArgs
>(spec: MultipleSpec<T, U>, param: ReferenceParam, optional: U): T[] {
    if (Array.isArray(spec)) {
        return spec.map((s) => resolve_single_spec<T, U>(s, param, optional));
    } else if (typeof spec === "function") {
        return spec(param, optional);
    }
    throw new Error("Unreachable code");
}

/** `Spec<T, U> | MultipleSpec<T, U>`を解決し、`T | T[]`を返す関数。 */
export function resolve_spec<
    T extends Referable,
    U extends OptionalArgs = OptionalArgs
>(spec: Spec<T, U>, param: ReferenceParam, optional: U): T | T[] {
    if (Array.isArray(spec)) {
        return spec.map((s) => resolve_single_spec<T, U>(s, param, optional));
    } else if (typeof spec === "function") {
        return spec(param, optional);
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

/** オブジェクト1つに対し、そのオーナーの`zonetype`の領域 */
function owners_zone_of_object(
    zonetype: ZoneType
): SingleReference<Zone, { object: GameObject }> {
    return (param, optional) => {
        return param.state.get_zone(zonetype, optional.object.owner);
    };
}

/** オーナーの手札 */
export const owners_hand = owners_zone_of_object(ZoneType.Hand);

/** 1人以上のプレイヤーに対し、それらのプレイヤーのコントロールしているすべてのクリーチャー */
export function creatures_controlled_by_player(): MultipleReference<
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
): Reference<GameObject, {}> {
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
