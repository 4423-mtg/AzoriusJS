"use strict";
import { GameHistory, GameState } from "./Game";
import { GameObject, Player, Zone } from "./GameObject";

export type ReferenceParams = {
    state: GameState;
    history: GameHistory;
    self: GameObject;
};

export type Referable =
    | GameObject
    | Player
    | Zone
    | number
    | string
    | undefined;

// ==============================================================================
export class Ref<T extends Referable> {
    ref: (params: ReferenceParams) => T | T[];

    constructor(ref: (params: ReferenceParams) => T | T[]) {
        this.ref = ref;
    }

    resolve: (params: ReferenceParams) => T | T[] = (params) =>
        this.ref(params);
}

export class SingleRef<T extends Referable> extends Ref<T> {
    ref: (params: ReferenceParams) => T;

    constructor(ref: (params: ReferenceParams) => T) {
        super(ref);
    }

    resolve: (params: ReferenceParams) => T = (params) => this.ref(params);

    // オーナー
    owner = new SingleRef((params: ReferenceParams) => {
        const ret = this.ref(params);
        return isGameObject(ret) ? ret.owner : undefined;
    });

    // コントローラー
    controller = new SingleRef((params: ReferenceParams) => {
        const ret = this.ref(params);
        return isGameObject(ret) ? ret.controller : undefined;
    });
}
function isGameObject(arg: any): arg is GameObject {
    return arg instanceof GameObject;
}

export class MultiRef<T extends Referable> extends Ref<T> {
    ref: (param: ReferenceParams) => T[];

    constructor(ref: (param: ReferenceParams) => T[]) {
        super(ref);
    }

    resolve: (params: ReferenceParams) => T[] = (params) => this.ref(params);
}

export type SingleSpec<T extends Referable> = T | SingleRef<T>;
export type MultiSpec<T extends Referable> = SingleSpec<T>[] | MultiRef<T>;
export type Spec<T extends Referable> = SingleSpec<T> | MultiSpec<T>;

export function resolve_single<T extends Referable>(
    spec: SingleSpec<T>,
    params: ReferenceParams
): T {
    return spec instanceof SingleRef ? spec.resolve(params) : spec;
}
export function resolve_multi<T extends Referable>(
    spec: MultiSpec<T>,
    params: ReferenceParams
): T[] {
    if (Array.isArray(spec)) {
        return spec.map((s) => resolve_single(s, params));
    } else {
        return spec.resolve(params);
    }
}

// ==============================================================================
// TODO
// オブジェクトのオーナー
// SingleSpec<GameObject>.owner: () => SingleSpec<Player>

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
