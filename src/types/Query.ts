import type { Game } from "./GameState/Game.js";
import { isInBattlefield, type GameObject } from "./GameObject/GameObject.js";
import { getObjectByCharacteristics } from "./GameState/GameState.js";
import type { Characteristics } from "./Characteristics/Characteristic.js";
import type { CardType } from "./Characteristics/CardType.js";
import type { Subtype } from "./Characteristics/Subtype.js";
import type { Supertype } from "./Characteristics/Supertype.js";
import type { Card } from "./GameObject/Card/Card.js";

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
}

// MultiQuery ===============================================================
export class MultiQuery<T> {
    query: (args: QueryArgument) => T[];

    constructor(query: (args: QueryArgument) => T[]) {
        this.query = query;
    }

    resolve: (args: QueryArgument) => T[] = (args) => this.query(args);
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
/** 指定の特性を満たすパーマネント */
export function permanentQuery(
    query: (characteristics: Characteristics) => boolean
): MultiQuery<Card> {
    return new MultiQuery(({ game, self }: QueryArgument) => {
        const state = game.gameStates.at(-1);
        if (state === undefined) {
            throw Error();
        } else {
            return getObjectByCharacteristics(state, query)
                .map(({ object, characteristics }) => object)
                .filter((obj) => isInBattlefield(obj));
        }
    });
}

export function addCardType(added: {
    cardType?: MultiSpec<CardType>;
    subtype?: MultiSpec<Subtype>;
    supertype?: MultiSpec<Supertype>;
}): (affected: Characteristics) => {
    cardType: MultiSpec<CardType>;
    subtype: MultiSpec<Subtype>;
    supertype: MultiSpec<Supertype>;
} {
    return (affected) => ({
        cardType: new MultiQuery((_args) => {
            const _t =
                added.cardType !== undefined
                    ? resolveMultiSpec(added.cardType, _args)
                    : [];
            return affected.card_types?.concat(_t) ?? _t;
        }),
        subtype: new MultiQuery((_args) => {
            const _t =
                added.subtype !== undefined
                    ? resolveMultiSpec(added.subtype, _args)
                    : [];
            return affected.subtypes?.concat(_t) ?? _t;
        }),
        supertype: new MultiQuery((_args) => {
            const _t =
                added.supertype !== undefined
                    ? resolveMultiSpec(added.supertype, _args)
                    : [];
            return affected.supertypes?.concat(_t) ?? _t;
        }),
    });
}

export function overwriteType(newtype: {
    cardType?: MultiSpec<CardType>;
    subtype?: MultiSpec<Subtype>;
    supertype?: MultiSpec<Supertype>;
}): (affected: Characteristics) => {
    cardType: MultiSpec<CardType> | undefined;
    subtype: MultiSpec<Subtype> | undefined;
    supertype: MultiSpec<Supertype> | undefined;
} {
    return (affected) => {
        const _cardt = newtype.cardType;
        const _subt = newtype.subtype;
        const _supert = newtype.supertype;
        return {
            cardType:
                _cardt !== undefined
                    ? new MultiQuery((args) => resolveMultiSpec(_cardt, args))
                    : affected.card_types,
            subtype:
                _subt !== undefined
                    ? new MultiQuery((args) => resolveMultiSpec(_subt, args))
                    : affected.subtypes,
            supertype:
                _supert !== undefined
                    ? new MultiQuery((args) => resolveMultiSpec(_supert, args))
                    : affected.supertypes,
        };
    };
}

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
