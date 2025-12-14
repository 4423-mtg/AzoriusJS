import { Game } from "./GameState/Game.js";
import { Zone } from "./GameState/Zone.js";
import { type GameObject } from "./GameObject/GameObject.js";
import { Player } from "./GameObject/Player.js";
import type { Power } from "./Characteristics/Characteristic.js";
import { Card } from "./GameObject/Card/Card.js";
import { unescape } from "node:querystring";
import type { Timestamp } from "./GameState/GameState.js";

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
    method(
        name: FunctionPropertyKeys<T>,
        ...args: Parameters<FunctionPropertyType<T, typeof name>>
    ): SingleQuery<ReturnType<FunctionPropertyType<T, typeof name>>> {
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

    /** オーナー (GameObjectのみ)*/
    owner(): SingleQuery<
        T extends GameObject ? GameObject["owner"] : undefined
    > {
        const newQuery = (args: QueryArgument) => {
            const temp: T = this.query(args);
            return (
                isGameObject(temp) ? temp["owner"] : undefined
            ) as T extends GameObject ? GameObject["owner"] : undefined;
        };
        return new SingleQuery(newQuery);
    }
    /** コントローラー (GameObjectのみ)*/
    controller = new SingleQuery((args: QueryArgument) => {
        const ret = this.query(args);
        return isGameObject(ret) ? ret.controller : undefined;
    });
}

type FunctionPropertyType<T, K extends keyof T> = T[K] extends (
    ...args: any[]
) => any
    ? T[K]
    : never;

type FunctionPropertyKeys<T> = _a<T, keyof T>;
type _a<T, K extends keyof T> = K extends unknown
    ? T[K] extends (...args: any[]) => any
        ? K
        : never
    : never;

export function RunSingleQuery<T>(
    query: SingleQuery<T>,
    args: QueryArgument
): T {
    return query.query(args);
}

export class MultiQuery<T> {
    #query: (param: QueryArgument) => T[];

    constructor(query: (param: QueryArgument) => T[]) {
        this.#query = query;
    }

    resolve: (params: QueryArgument) => T[] = (params) => this.#query(params);
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

// タイプガード ===============================================================
function isGameObject(arg: any): arg is GameObject {
    return arg instanceof GameObject;
}

function isPlayer(arg: any): arg is Player {
    return arg instanceof Player;
}

function isZone(arg: any): arg is Zone {
    return arg instanceof Zone;
}

// Specの解決 ===============================================================
export function resolveSpec<T>(spec: Spec<T>, args: QueryArgument): T | T[] {
    if (isSingleSpec<T>(spec)) {
        return resolveSingleSpec(spec, args);
    } else if (isMultiSpec(spec)) {
        return resolveMultiSpec(spec, args);
    } else {
        return spec;
    }
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
    if (Array.isArray(spec)) {
        return spec.map((s) => resolveSingleSpec(s, args));
    } else {
        return spec.resolve(args);
    }
}

/** `spec`を`params`で解決し、得られたオブジェクトを`func`に引数として渡す。 */
export function resolve_spec_apply<T, U>(
    spec: Spec<T>,
    args: QueryArgument,
    func: (resolved: T) => U
): U | U[] {
    const temp = resolveSpec(spec, args);
    return Array.isArray(temp)
        ? temp.map((eachtemp) => func(eachtemp))
        : func(temp);
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
