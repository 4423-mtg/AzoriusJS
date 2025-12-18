import { Game } from "./GameState/Game.js";
import { type GameObject } from "./GameObject/GameObject.js";

// export type QueryParams = {
//     state: GameState;
//     history: GameHistory;
//     self: GameObject;
// };

/** Queryの解決に必要な値。 */
export type QueryArgument = {
    game: Game;
    self: GameObject | undefined;
};

// ==============================================================================
// 「前のターンに続唱で唱えたカード」をJSONで書ける？
// 関数を保存することはできないので、実装済み処理のタグを保存する
// どうせテンプレ作ってまとめたくなるので最初からタグ方式でいい
// - メソッドチェーンできるようにしたい
// - resolveは関数でいい？
export class SingleQuery<T> {
    query: (args: QueryArgument) => T;

    constructor(query: (args: QueryArgument) => T) {
        this.query = query;
    }

    resolve(args: QueryArgument): T {
        return this.query(args);
    }

    // メソッドチェーン
    field(name: keyof T): SingleQuery<T[typeof name]> {
        const newQuery = (args: QueryArgument) => {
            const temp = this.query(args);
            return temp[name];
        };
        return new SingleQuery(newQuery);
    }
    // FIXME: 例外が返るのはおかしい。undefinedが返るべき。
    // T[typeof name]が関数であることは確定してはいるが、型情報になっていない。
    // 大人しく全部並べるべきか
    method(
        name: FunctionPropertiesKey<T>,
        hoge: T[typeof name],
        ...args: Parameters<FunctionProperty<T, typeof name>>
    ): SingleQuery<ReturnType<FunctionProperty<T, typeof name>>> {
        const newQuery = (_args: QueryArgument) => {
            const temp = this.query(_args);
            const property = temp[name];
            if (typeof property === "function") {
                return property(...args);
            } else {
                throw new Error("");
            }
        };
        return new SingleQuery(newQuery);
    }
    apply<U extends any[], V>(
        func: (ret: T, ...args: U) => V,
        ...args: U
    ): SingleQuery<V> {
        const newQuery = (_args: QueryArgument) =>
            func(this.query(_args), ...args);
        return new SingleQuery(newQuery);
    }
}

/** `T[K]` が関数であるなら `T[K]`。そうでないなら、 `never`。 */
type FunctionProperty<T, K extends keyof T> = T[K] extends (
    ...args: any[]
) => any
    ? T[K]
    : never;

/** T のプロパティのうち関数であるものの名前(key)。 */
type FunctionPropertiesKey<T> = _a<T, keyof T>;
type _a<T, K extends keyof T> = K extends unknown
    ? T[K] extends (...args: any[]) => any
        ? K
        : never
    : never;

// MultiQuery ===============================================================
export class MultiQuery<T> {
    query: (args: QueryArgument) => T[];

    constructor(query: (args: QueryArgument) => T[]) {
        this.query = query;
    }

    resolve: (args: QueryArgument) => T[] = (args) => this.query(args);

    field(name: keyof T): MultiQuery<T[typeof name]> {
        const newQuery = (args: QueryArgument) => {
            const temp = this.query(args);
            return temp.map((e) => e[name]);
        };
        return new MultiQuery(newQuery);
    }

    method(
        name: FunctionPropertiesKey<T>,
        ...args: Parameters<FunctionProperty<T, typeof name>>
    ): MultiQuery<ReturnType<FunctionProperty<T, typeof name>>> {
        const newQuery = (_args: QueryArgument) => {
            const temp = this.query(_args);
            return temp.map((e) => {
                if (typeof e[name] === "function") {
                    return e[name](...args);
                } else {
                    throw new Error();
                }
            });
        };
        return new MultiQuery(newQuery);
    }

    // TODO:
    apply() {}
}

export type SingleSpec<T> = T | SingleQuery<T>;
export type MultiSpec<T> = SingleSpec<T>[] | MultiQuery<T>;
export type Spec<T> = SingleSpec<T> | MultiSpec<T>;

function isSingleSpec<T>(spec: Spec<T>): spec is T | SingleQuery<T> {
    return !isMultiSpec(spec);
}

function isMultiSpec<T>(spec: Spec<T>): spec is MultiSpec<T> {
    return spec instanceof MultiQuery || Array.isArray(spec);
}

// Specの解決 ===============================================================
export function resolveSpec<T>(spec: Spec<T>, args: QueryArgument): T | T[] {
    return isSingleSpec<T>(spec)
        ? resolveSingleSpec(spec, args)
        : isMultiSpec(spec)
        ? resolveMultiSpec(spec, args)
        : spec;
}
export function resolveSingleSpec<T>(
    spec: SingleSpec<T>,
    args: QueryArgument
): T {
    return spec instanceof SingleQuery ? spec.resolve(args) : spec;
}
export function resolveMultiSpec<T>(
    spec: MultiSpec<T>,
    args: QueryArgument
): T[] {
    return Array.isArray(spec)
        ? spec.map((s) => resolveSingleSpec(s, args))
        : spec.resolve(args);
}

// ==============================================================================
// TODO

// プレイヤーの領域
// SingleSpec<Player>.zone: (zonetype) => SingleSpec<Zone>
// プレイヤーのパーマネント
// SingleSpec<Player>.permanent: () => MultiSpec<GameObject>
// ある領域にあるオブジェクト
// SingleSpec<Zone>.objects: () => MultiSpec<GameObject>
// 特定の条件を満たすパーマネント
// permanent: (spec) => MultiSpec<GameObject>
// プレイヤーのライブラリーの一番上
// SingleSpec<Player>.top_of_library: () => SingleSpec<GameObject>
// オブジェクトの対象
// SingleSpec<GameObject>.target: () => MultiSpec<GameObject | Player>
