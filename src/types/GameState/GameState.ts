import {
    Battlefield,
    Command,
    Exile,
    Graveyard,
    Hand,
    Library,
    Stack,
    type Zone,
    type ZoneType,
} from "./Zone.js";
import type { GameObject } from "../GameObject/GameObject.js";
import { Player } from "../GameObject/Player.js";
import { StackedAbility } from "../GameObject/StackedAbility.js";
import { Card } from "../GameObject/Card/Card.js";
import type { Phase, Step, Turn } from "../Turn/Turn.js";

export class GameState {
    /** プレイヤー */
    // #players: Player[];
    /** プレイヤーのターン進行順 */
    #turn_order: Player[];
    /** 最後に通常のターンを行ったプレイヤーの、 turn_order でのインデックス。 */
    #turn_order_latest?: number;
    /** 現在優先権を持っているプレイヤーの、 turn_order でのインデックス。 */
    #priority_player_index?: number;

    /** 領域 */
    #zones: Set<Zone> = new Set<Zone>();
    /** すべてのオブジェクト */
    #game_objects: GameObject[] = []; // Mapに変えるかも

    /** 現在のターン */
    #turn: Turn;
    /** 現在のフェイズ */
    #phase: Phase;
    /** 現在のステップ */
    #step?: Step;

    /** 優先権を連続でパスしたプレイヤーの数 */
    #pass_count: number = 0;
    pass_count(): number {
        return this.#pass_count;
    }
    /** クリンナップをもう一度行うかどうか。
     * クリンナップの間に状況起因処理か能力の誘発があった場合、
     * そのクリンナップでは優先権が発生するとともに、追加のクリンナップが発生する。 */
    #cleanup_again = false;
    cleanup_again(): boolean {
        return this.#cleanup_again;
    }

    // ==================================================================
    // MARK: GameState/object
    // /** オブジェクトを追加 */
    // add_game_object(...objects: GameObject[]) {
    //     this.#game_objects.push(...objects);
    // }
    /** すべてのオブジェクト */ // FIXME:
    getGameObjects<T extends GameObject>(query: {
        type: new (..._: any[]) => T;
        controller?: Player;
        owner?: Player;
        zone?: { type: ZoneType; owner?: Player };
    }): T[] {
        function _typeguard(obj: GameObject): obj is T {
            if (Array.isArray(query.type)) {
                return query.type.some((t) => obj instanceof t);
            } else {
                return obj instanceof query.type;
            }
        }

        return this.#game_objects.filter(_typeguard).filter((obj) => {
            const b1 =
                query.controller === undefined ||
                obj.controller.object_id === query.controller.id;
            const b2 =
                query.owner === undefined ||
                obj.owner.object_id === query.owner.id;
            const b3 =
                query.zone === undefined ||
                ((obj instanceof Card || obj instanceof StackedAbility) &&
                    obj.zone?.zonetype === query.zone.type &&
                    obj.zone.owner?.id === query.zone.owner?.id);
            return b1 && b2 && b3;
        });
    }

    stacked_objects(): (Card | StackedAbility)[] {
        // FIXME: スタックでは順序がある
        return this.#game_objects
            .filter(
                (obj) => obj instanceof Card || obj instanceof StackedAbility
            )
            .filter((obj) => obj.zone?.zonetype === Stack);
    }

    /** 誘発してまだスタックに置かれていない誘発型能力 */
    // triggered_abilities_not_stacked(): StackedAbility[] {
    //     return this.game_objects({ type: StackedAbility }).filter(
    //         (ability) => ability.zone === undefined
    //     );
    // }

    // ==================================================================
    // MARK:GameState/プレイヤー
    /** すべてのプレイヤー */
    players(): Player[] {
        return this.getGameObjects({ type: Player });
    }
    set_players(players: Player[]) {
        players.forEach((pl) => this.#game_objects.push(pl));
    }
    /** アクティブプレイヤー */
    get_active_player(): Player {
        return this.getTurn().active_player;
    }
    /** 優先権を持つプレイヤー */
    get_player_with_priority(): {
        index: number | undefined;
        player: Player | undefined;
    } {
        return this.#priority_player_index !== undefined
            ? {
                  index: this.#priority_player_index,
                  player: this.#turn_order[this.#priority_player_index],
              }
            : {
                  index: undefined,
                  player: undefined,
              };
    }
    set_player_with_priority(index: number) {
        this.#priority_player_index = index;
    }

    /** ターン順 */
    get_turn_order() {
        return this.#turn_order;
    }
    /** ターン順を設定する。ゲームに存在しないプレイヤーが与えられた場合は無視する。 */
    set_turn_order(players: Player[]) {
        this.#turn_order = [];
        players.forEach((pl) => {
            if (this.players().includes(pl)) {
                this.#turn_order.push(pl);
            }
        });
    }
    /** 最後に通常のターンを行ったプレイヤーのインデックス。 */
    get_current_turn_order(): number | undefined {
        return this.#turn_order_latest;
    }

    /** 指定した順番を起点としてターン順に1周する、プレイヤーの配列 */
    turn_order_from(index: number): Player[] {
        if (index === 0) {
            return this.#turn_order;
        } else {
            return new Array<Player>().concat(
                this.#turn_order.slice(index),
                this.#turn_order.slice(0, index - 1)
            );
        }
    }
    /** プレイヤーをAPNAP順で返す。 */
    get_players_apnap(): Player[] {
        const index = this.get_turn_order().indexOf(this.get_active_player());
        return this.turn_order_from(index >= 0 ? index : 0);
    }

    // ==================================================================
    // MARK: GameState/領域
    /** 戦場 */
    get battlefield(): Zone[] {
        return this.getZone(Battlefield);
    }
    /** スタック */
    get stack(): Zone[] {
        return this.getZone(Stack);
    }
    /** 追放 */
    get exile(): Zone[] {
        return this.getZone(Exile);
    }
    /** 手札（人数分） */
    get hand(): Zone[] {
        return this.getZone(Hand);
    }
    /** ライブラリー（人数分） */
    get library(): Zone[] {
        return this.getZone(Library);
    }
    /** 墓地（人数分） */
    get graveyard(): Zone[] {
        return this.getZone(Graveyard);
    }
    /** 統率（人数分） */
    get command(): Zone[] {
        return this.getZone(Command);
    }
    /** 領域の種類とオーナーを指定して領域を取得 */
    getZone(
        zoneType: ZoneType | ZoneType[],
        owner?: Player | Player[]
    ): Zone[] {
        const cond1: (z: Zone) => boolean = (z) =>
            Array.isArray(zoneType)
                ? zoneType.includes(z.zoneType)
                : z.zoneType === zoneType;
        const cond2: (z: Zone) => boolean = (z) =>
            owner === undefined
                ? true
                : Array.isArray(owner)
                ? z.owner !== undefined && owner.includes(z.owner)
                : z.owner === owner;

        return new Array(...this.#zones).filter((z) => cond1(z) && cond2(z));
    }
    addZone(zone: Zone) {
        this.#zones.add(zone);
    }

    // ==================================================================
    // MARK: GameState/ターン // FIXME: getter/setter?
    getTurn(): Turn {
        return this.#turn;
    }
    setTurn(turn: Turn) {
        this.#turn = turn;
    }
    getPhase(): Phase {
        return this.#phase;
    }
    setPhase(phase: Phase) {
        this.#phase = phase;
    }
    getStep(): Step | undefined {
        return this.#step;
    }
    setStep(step: Step | undefined) {
        this.#step = step;
    }

    // ==================================================================
    /** ディープコピー */
    deepcopy(): GameState {
        return new GameState(); // TODO:
    }
}
