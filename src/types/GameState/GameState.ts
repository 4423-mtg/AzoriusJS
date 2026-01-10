import type { Zone, ZoneType } from "./Zone.js";
import type { GameObject, GameObjectId } from "../GameObject/GameObject.js";
import type { Player } from "../GameObject/Player.js";
import type { Phase, Step, Turn } from "../Turn.js";
import type { Characteristics } from "../Characteristics/Characteristic.js";
import type { Card } from "../GameObject/Card/Card.js";
import type { Instruction } from "../Instruction/Instruction.js";
import type { StackedAbility } from "../GameObject/StackedAbility.js";
import type { Spell } from "../GameObject/Card/Spell.js";
import {
    getLayer,
    hasLayer,
    isCharacteristicsAlteringEffect,
    isContinuousEffect,
    type CharacteristicsAlteringEffect,
} from "../GameObject/GeneratedEffect/ContinuousEffect.js";
import type { Timestamp } from "./Timestamp.js";
import {
    isAbility,
    isCharacteristicDefiningAbility,
    type Ability,
} from "../GameObject/Ability.js";
import {
    isAnyLayer,
    isLayer1a,
    layerCategories,
    type AnyLayer,
    type Layer,
    type Layer1a,
    type Layer1b,
    type Layer2,
    type Layer3,
    type Layer4,
    type Layer5,
    type Layer6,
    type Layer7a,
    type Layer7b,
    type Layer7c,
    type Layer7d,
    type LayerCategory,
} from "../Characteristics/Layer.js";

export type GameState = {
    timestamp: Timestamp;
    objects: GameObject[];
    players: Player[];
    turnOrder: number[];
    zones: Zone[];
    currentTurn: Turn | undefined;
    currentPhase: Phase | undefined;
    currentStep: Step | undefined;
    numberOfPassedPlayers: number;
    /** 優先権を持っているプレイヤーのターンインデックス */
    currentPriorityPlayerIndex: number | undefined;
    /** 最後に優先権パスでない行動をしたプレイヤーのターンインデックス */
    latestActionPlayerIndex: number | undefined;
    /** このターンにクリンナップ・ステップをもう一度行うかどうか。 */
    cleanupAgainFlag: boolean;
    // TODO: 「最後に通常のターンを行ったプレイヤー」は要るのかどうか...
};

// ============================================================================
// MARK: 状態取得
// ============================================================================
/** アクティブプレイヤーを取得する */
export function getActivePlayer(state: GameState): Player | undefined {
    return state.currentTurn?.activePlayer;
}
/** 優先権を持っているプレイヤーを取得する */
export function getPriorityPlayer(state: GameState): Player | undefined {
    if (state.currentPriorityPlayerIndex === undefined) {
        return undefined;
    } else {
        const playerIdx = state.turnOrder[state.currentPriorityPlayerIndex];
        return playerIdx === undefined ? undefined : state.players[playerIdx];
    }
}
/** 最後に優先権パスでない行動をしたプレイヤーを取得する */
export function getLatestActionPlayer(state: GameState): Player | undefined {
    if (state.latestActionPlayerIndex === undefined) {
        return undefined;
    } else {
        const playerIdx = state.turnOrder[state.latestActionPlayerIndex];
        return playerIdx === undefined ? undefined : state.players[playerIdx];
    }
}

/** プレイヤーをターン順で取得する */
export function getPlayersByTurnOrder(state: GameState): Player[] {
    return state.turnOrder.map((n) => {
        if (n < state.players.length) {
            return state.players[n] as Player; // FIXME: no as
        } else {
            throw Error();
        }
    });
}
/** 指定した領域を取得する */
export function getZones(
    state: GameState,
    option: { type: ZoneType; owner?: Player }
): Zone[] {
    return state.zones.filter(
        (z) => z.owner === option.owner && z.type === option.type
    );
}

// ============================================================================
// MARK: 特性関連
// ============================================================================
const _takeLayer = <T extends LayerCategory>(
    e: CharacteristicsAlteringEffect[],
    lc: T
) =>
    e.map((_e) => ({
        effect: _e,
        layer: _e[`layer${lc}`] as (typeof _e)[`layer${T}`],
    }));
const _dropUndefined = <T, U>(arg: {
    effect: T;
    layer: U;
}): arg is {
    effect: T;
    layer: Exclude<U, undefined>;
} => arg.layer !== undefined;

/** すべてのオブジェクトと、それが現在取っている特性を取得する。 */
export function getAllCharacteristics(state: GameState): {
    object: Card | Player;
    characteristics: Characteristics;
}[] {
    // すべての特性変更効果
    const effects = state.objects.filter((o) =>
        isCharacteristicsAlteringEffect(o)
    );
    // 適用開始済み効果をメモするリスト
    const appliedEffects: GameObjectId[] = []; // FIXME: 重複しないのでSetにする
    // レイヤーを適用順に格納するキュー
    const layerQueue: AnyLayer[] = [];

    /** 能力が無効化されているならTrue */
    const _isLost = (ability: Ability): boolean => {
        // ここまでのレイヤーを適用してみて、能力が無効化されていないか確認する
        return _applyLayers(state, layerQueue).every(({ characteristics }) => {
            characteristics.abilities === undefined ||
                characteristics.abilities.some(
                    (_ability) => _ability.id === ability.id
                ) === false;
        });
    };

    // サブルーチン
    function _pushToQueue(
        effects: CharacteristicsAlteringEffect[],
        category: LayerCategory
    ) {
        // 能力無効化チェック
        const validEffects = effects.filter(
            (e) => !(isAbility(e.source) && _isLost(e.source))
        );

        // 種類別に応じたレイヤーを取り出す
        let x;
        switch (category) {
            case "1a":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "1b":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "2":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "3":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "4":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "5":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "6":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "7a":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "7b":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "7c":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            case "7d":
                x = _takeLayer(validEffects, category).filter(_dropUndefined);
                break;
            default:
                throw new Error();
        }
        _sortLayers(state, x).forEach(({ effect, layer }) => {
            // レイヤーをキューに入れる
            layerQueue.push(layer);
            // 継続的効果を適用済みとしてメモする
            if (!appliedEffects.includes(effect.objectId)) {
                appliedEffects.push(effect.objectId);
            }
        });
    }

    // 各種類別について
    for (const cate of layerCategories) {
        // 特性定義能力からであるもの
        _pushToQueue(
            effects.filter((e) => isCharacteristicDefiningAbility(e.source)),
            cate
        );
        // 特性定義能力からでないもの
        _pushToQueue(
            effects.filter((e) => !isCharacteristicDefiningAbility(e.source)),
            cate
        );
    }

    // レイヤーを順番に適用する
    const x = _applyLayers(state, layerQueue);
    return x;
}

// FIXME:
type _t2 =
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer1a;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer1b;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer2;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer3;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer4;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer5;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer6;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer7a;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer7b;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer7c;
      }[]
    | {
          effect: CharacteristicsAlteringEffect;
          layer: Layer7d;
      }[];

/** レイヤーの適用順を決定する。 */ // TODO: 実装
function _sortLayers(state: GameState, args: _t2): typeof args {
    // - すべての継続的効果をすべての順序で適用してみて、依存をチェックする
    // - 依存があってループしているならタイムスタンプ順で適用、ループしていないなら依存順で適用する。依存がないものはタイムスタンプ順で適用する
    //   - 適用順は1つ適用するごとに再計算する

    return []; // TODO:
    // 複数のオブジェクトが同時に領域に入る場合、コントローラーがそれらの相対的なタイムスタンプ順を自由に決定する
}

/** 与えられたレイヤーをGameStateに対して適用してみた場合の、各GameObjectの特性を得る。
 * なお、GameStateを変更はしない。
 */
export function _applyLayers( // TODO: 実装
    state: GameState,
    layers: AnyLayer[]
): {
    object: Card | Player;
    characteristics: Characteristics;
}[] {
    // TODO: queryを解決しながら適用していく
    return undefined;
}

/** 指定された特性であるオブジェクトをすべて取得する。 */
export function getObjectsWithCharacteristics(
    state: GameState,
    predicate: (characteristics: Characteristics) => boolean
): {
    object: Card | Player;
    characteristics: Characteristics;
}[] {
    return getAllCharacteristics(state).filter(({ object, characteristics }) =>
        predicate(characteristics)
    );
}

export function getAllObjectsInZone(
    state: GameState,
    zone: Zone
): GameObject[] {
    return state.objects.filter((obj) => obj.zone === zone);
}

// ============================================================================
// MARK: Instruction関連
// ============================================================================
/** ゲームの状態から、次に行うべき処理を取得する。 */ // TODO: 実装
export function getNextInstructionsFromState(state: GameState): Instruction[] {
    // TODO: ゲーム開始時
    if (
        // まだ誰も優先権を持っていないなら、ターン起因処理を行う
        state.currentPriorityPlayerIndex === undefined
    ) {
        // ターン起因処理 & アクティブプレイヤーが優先権を得る
        return [] as Instruction[];
    } else if (
        // 全員が優先権を放棄している
        state.currentPriorityPlayerIndex === state.latestActionPlayerIndex
    ) {
        const tempZones = getZones(state, { type: "Stack" });
        if (tempZones.length !== 1) {
            throw Error("Not Implemented");
        } else {
            const stack = tempZones[0] as Exclude<
                (typeof tempZones)[0],
                undefined
            >;
            const stackedObjects = getAllObjectsInZone(state, stack);
            if (stackedObjects.length === 0) {
                // スタックに何もなければ次へ進む。
                //   - 未使用のマナが消滅する。
                //   - 次のターン・フェイズ・ステップに移る。
                //     - TODO: クリンナップ2回目
                return [] as Instruction[];
            } else {
                // スタックに何かあれば解決する。
                const topObject = stackedObjects.at(-1) as
                    | Spell
                    | StackedAbility;
                return [{ type: "resolve", stackedObject: topObject }];
            }
        }
    } else {
        // 全員が優先権を放棄していないなら、優先権を持っている人は
        // 優先権行動をするか、優先権を放棄する
        return [] as Instruction[];
    }
}

// フェイズ開始
// ターン起因処理
// アクティブプレイヤーが優先権を得る
// 優先権行動
// 次のプレイヤーの優先権行動
// ...
// (全員パス)
// スタックにあれば解決、なければ次のフェイズへ

/** 処理を1回実行して、その結果のGameStateを返す。 */
export function applyInstruction(
    state: GameState,
    instructions: Instruction[]
): GameState {
    const inst = instructions.at(-1);
    if (inst === undefined) {
        throw new Error();
    } else {
        // (1) GameStateをコピーする。
        const newState = deepCopyGamestate(state);

        // (2) コピーした GameState に Instruction を適用する。 // TODO: 実装
        // TODO: 置換効果等を考慮する
        switch (inst.type) {
            case "draw":
                // ドロー処理
                const x = inst;
                newState;
                break;
            case "simultaneous":
                break;
            default:
                inst;
                break;
        }

        // (3) 特性を再計算して GameState に書き込む
        const objch = getAllCharacteristics(newState);
        for (const { object, characteristics } of objch) {
            const _sameobj = newState.objects.find(
                (_obj) => _obj.objectId === object.objectId
            );
            if (_sameobj === undefined) {
                throw new Error();
            } else {
                _sameobj.characteristics = characteristics;
            }
        }

        return newState;
    }
}

export function deepCopyGamestate(state: GameState): GameState {
    // TODO: 実装
    return { ...state }; // FIXME: shallow copy
}
