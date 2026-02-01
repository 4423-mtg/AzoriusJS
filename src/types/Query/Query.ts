import type { Game } from "../GameState/Game.js";
import { isInBattlefield, type GameObject } from "../GameObject/GameObject.js";
import { getObjectsWithCharacteristics } from "../GameState/GameState.js";
import type {
    CardTypeSet,
    Characteristics,
} from "../Characteristics/Characteristic.js";
import type { CardType } from "../Characteristics/CardType.js";
import type { Subtype } from "../Characteristics/Subtype.js";
import type { Supertype } from "../Characteristics/Supertype.js";
import type { Card } from "../GameObject/Card/Card.js";

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

// ==========================================================================
// MARK: SingleQuery
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
export function isSingleQuery(obj: unknown): obj is SingleQuery<unknown> {
    return obj instanceof SingleQuery;
}

// ==========================================================================
// MARK: MultiQuery
export class MultiQuery<T> {
    query: (args: QueryArgument) => T[];

    constructor(query: (args: QueryArgument) => T[]) {
        this.query = query;
    }

    resolve: (args: QueryArgument) => T[] = (args) => this.query(args);
}
export function isMultiQuery(obj: unknown): obj is MultiQuery<unknown> {
    return obj instanceof MultiQuery;
}

// ==========================================================================
// MARK: Spec
export type SingleSpec<T> = T | SingleQuery<T>;
export function isSingleSpec<T>(
    obj: unknown,
    type: new (...args: unknown[]) => T,
): obj is SingleSpec<T> {
    return obj instanceof T;
}

export type MultiSpec<T> = SingleSpec<T>[] | MultiQuery<T>;
export function isMultiSpec(obj: unknown): obj is MultiSpec<unknown> {
    return (
        obj instanceof MultiQuery ||
        (Array.isArray(obj) && obj.every((o) => isSingleSpec(o)))
    );
}

export type Spec<T> = SingleSpec<T> | MultiSpec<T>;
export function isSpec(obj: unknown): obj is Spec<unknown> {
    //
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
    args: QueryArgument,
): T {
    return spec instanceof SingleQuery ? spec.resolve(args) : spec;
}
export function resolveMultiSpec<T>(
    spec: MultiSpec<T>,
    args: QueryArgument,
): T[] {
    return Array.isArray(spec)
        ? spec.map((s) => resolveSingleSpec(s, args))
        : spec.resolve(args);
}

// ==============================================================================
/** 指定の特性を満たすパーマネント */
export function permanentQuery(
    query: (characteristics: Characteristics) => boolean,
): MultiQuery<Card> {
    return new MultiQuery(({ game, self }: QueryArgument) => {
        const state = game.gameStates.at(-1);
        if (state === undefined) {
            throw Error();
        } else {
            return getObjectsWithCharacteristics(state, query)
                .map(({ object, characteristics }) => object)
                .filter((obj) => isInBattlefield(obj));
        }
    });
}

/** カードタイプ・サブタイプ・特殊タイプを追加する。 */
export function addCardType(
    added: Partial<CardTypeSet>,
): (current: Characteristics) => CardTypeSet {
    return (current) => {
        const _cardt = added.cardType;
        const _subt = added.subtype;
        const _supert = added.supertype;
        return {
            cardType:
                _cardt === undefined
                    ? current.card_types
                    : new MultiQuery((_args) =>
                          (current.card_types ?? []).concat(
                              resolveMultiSpec(_cardt, _args),
                          ),
                      ),
            subtype:
                _subt === undefined
                    ? current.subtypes
                    : new MultiQuery((_args) =>
                          (current.subtypes ?? []).concat(
                              resolveMultiSpec(_subt, _args),
                          ),
                      ),
            supertype:
                _supert === undefined
                    ? current.supertypes
                    : new MultiQuery((_args) =>
                          (current.supertypes ?? []).concat(
                              resolveMultiSpec(_supert, _args),
                          ),
                      ),
        };
    };
}

/** カードタイプ・サブタイプ・特殊タイプを、指定したタイプで上書きする。指定がないものは元のタイプを残す。 */
export function overwriteType(
    newtype: Partial<CardTypeSet>,
): (current: Characteristics) => CardTypeSet {
    return (current) => {
        const _cardt = newtype.cardType;
        const _subt = newtype.subtype;
        const _supert = newtype.supertype;
        return {
            cardType:
                _cardt !== undefined
                    ? new MultiQuery((args) => resolveMultiSpec(_cardt, args))
                    : current.card_types,
            subtype:
                _subt !== undefined
                    ? new MultiQuery((args) => resolveMultiSpec(_subt, args))
                    : current.subtypes,
            supertype:
                _supert !== undefined
                    ? new MultiQuery((args) => resolveMultiSpec(_supert, args))
                    : current.supertypes,
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
