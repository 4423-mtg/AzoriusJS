"use strict";
import { GameHistory, GameState } from "./Game";
import { GameObject, Player, Zone } from "./GameObject";

// export type ReferenceParams = {
//     state: GameState;
//     history: GameHistory;
//     self: GameObject;
// };

/** Referenceの解決に必要な値。 */
export class ReferenceParam {
    #history: GameState[];
    #self: GameObject;

    constructor(args: { history: GameState[]; self: GameObject }) {
        this.#history = args.history;
        this.#self = args.self;
    }

    get state(): GameState {
        return this.#history[-1];
    }
    get history(): GameState[] {
        return this.#history;
    }
    get self(): GameObject {
        return this.#self;
    }
}

export type Referable =
    | GameObject
    | Player
    | Zone
    | number
    | string
    | undefined;

// ==============================================================================
export class Ref<T extends Referable> {
    ref: (params: ReferenceParam) => T | T[];

    constructor(ref: (params: ReferenceParam) => T | T[]) {
        this.ref = ref;
    }

    resolve: (params: ReferenceParam) => T | T[] = (params) => this.ref(params);
}

export class SingleRef<T extends Referable> extends Ref<T> {
    declare ref: (params: ReferenceParam) => T;

    constructor(ref: (params: ReferenceParam) => T) {
        super(ref);
    }

    resolve: (params: ReferenceParam) => T = (params) => this.ref(params);

    // オーナー
    owner = new SingleRef((params: ReferenceParam) => {
        const ret = this.ref(params);
        return isGameObject(ret) ? ret.owner : undefined;
    });

    // コントローラー
    controller = new SingleRef((params: ReferenceParam) => {
        const ret = this.ref(params);
        return isGameObject(ret) ? ret.controller : undefined;
    });
}

export class MultiRef<T extends Referable> extends Ref<T> {
    declare ref: (param: ReferenceParam) => T[];

    constructor(ref: (param: ReferenceParam) => T[]) {
        super(ref);
    }

    resolve: (params: ReferenceParam) => T[] = (params) => this.ref(params);
}

export type SingleSpec<T extends Referable> = T | SingleRef<T>;
export type MultiSpec<T extends Referable> = SingleSpec<T>[] | MultiRef<T>;
export type Spec<T extends Referable> = SingleSpec<T> | MultiSpec<T>;

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
export function resolve_single_spec<T extends Referable>(
    spec: SingleSpec<T>,
    params: ReferenceParam
): T {
    return spec instanceof SingleRef ? spec.resolve(params) : spec;
}
export function resolve_multi_spec<T extends Referable>(
    spec: MultiSpec<T>,
    params: ReferenceParam
): T[] {
    if (Array.isArray(spec)) {
        return spec.map((s) => resolve_single_spec(s, params));
    } else {
        return spec.resolve(params);
    }
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
