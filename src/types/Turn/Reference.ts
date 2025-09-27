"use strict";
import { Game, GameState, Zone } from "./Game";
import { GameObject, Player } from "./GameObject";

export {
    ReferenceParam,
    SingleRef,
    MultiRef,
    Spec,
    SingleSpec,
    MultiSpec,
    resolve_spec,
    resolve_single_spec,
    resolve_multi_spec,
    resolve_spec_apply,
};

// export type ReferenceParams = {
//     state: GameState;
//     history: GameHistory;
//     self: GameObject;
// };

/** Referenceの解決に必要な値。 */
type ReferenceParam = {
    game: Game;
    self: GameObject | undefined;
};

type Referable =
    | string
    | number
    | boolean
    | GameObject
    | Player
    | Zone
    | undefined;

// ==============================================================================
type _Ref = { resolve: (params: ReferenceParam) => any };

class SingleRef<T extends Referable> {
    #ref: (params: ReferenceParam) => T;

    constructor(ref: (params: ReferenceParam) => T) {
        this.#ref = ref;
    }

    resolve: (params: ReferenceParam) => T = (params) => this.#ref(params);

    /** オーナー (GameObjectのみ)*/
    owner = new SingleRef((params: ReferenceParam) => {
        const ret = this.#ref(params);
        return isGameObject(ret) ? ret.owner : undefined;
    });

    /** コントローラー (GameObjectのみ)*/
    controller = new SingleRef((params: ReferenceParam) => {
        const ret = this.#ref(params);
        return isGameObject(ret) ? ret.controller : undefined;
    });
}

class MultiRef<T extends Referable> {
    #ref: (param: ReferenceParam) => T[];

    constructor(ref: (param: ReferenceParam) => T[]) {
        this.#ref = ref;
    }

    resolve: (params: ReferenceParam) => T[] = (params) => this.#ref(params);
}

type SingleSpec<T extends Referable> = T | SingleRef<T>;
type MultiSpec<T extends Referable> = SingleSpec<T>[] | MultiRef<T>;
type Spec<T extends Referable> = SingleSpec<T> | MultiSpec<T>;

function isSingleSpec<T extends Referable>(
    spec: Spec<T>
): spec is T | SingleRef<T> {
    return !isMultiSpec(spec);
}

function isMultiSpec<T extends Referable>(spec: Spec<T>): spec is MultiSpec<T> {
    return spec instanceof MultiRef || Array.isArray(spec);
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
function resolve_spec<T extends Referable>(
    spec: Spec<T>,
    params: ReferenceParam
): T | T[] {
    if (isSingleSpec<T>(spec)) {
        return resolve_single_spec(spec, params);
    } else if (isMultiSpec(spec)) {
        return resolve_multi_spec(spec, params);
    } else {
        return spec;
    }
}

function resolve_single_spec<T extends Referable>(
    spec: SingleSpec<T>,
    params: ReferenceParam
): T {
    return spec instanceof SingleRef ? spec.resolve(params) : spec;
}
function resolve_multi_spec<T extends Referable>(
    spec: MultiSpec<T>,
    params: ReferenceParam
): T[] {
    if (Array.isArray(spec)) {
        return spec.map((s) => resolve_single_spec(s, params));
    } else {
        return spec.resolve(params);
    }
}

/** `spec`を`params`で解決し、得られたオブジェクトを`func`に引数として渡す。 */
function resolve_spec_apply<T extends Referable, U>(
    spec: Spec<T>,
    params: ReferenceParam,
    func: (resolved: T) => U
): U | U[] {
    const temp = resolve_spec(spec, params);
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
