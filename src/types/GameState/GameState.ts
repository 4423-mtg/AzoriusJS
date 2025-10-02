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
import type { Phase, Step, Turn } from "../Turn/Turn.js";
import { ModifyingLayer1a } from "../Characteristics/Layer/LayerInstance.js";
import type { Characteristics } from "../Characteristics/Characteristic.js";

export class GameState {
    timestamp: Timestamp;

    constructor(timestamp: Timestamp) {
        this.timestamp = timestamp;
    }

    /* ========================================================== */
    // MARK: オブジェクト
    /* ========================================================== */
    /** すべてのオブジェクト */
    #gameObjects: GameObject[] = []; // Mapに変えるかも

    /** すべてのオブジェクト */
    getGameObjects(): GameObject[] {
        return [...this.#gameObjects];
    }
    /** オブジェクトを追加 */
    addGameObject(object: GameObject) {
        this.#gameObjects.push(object);
    }

    /* ========================================================== */
    // MARK: プレイヤー
    /* ========================================================== */
    getPlayers(): Player[] {
        return this.getGameObjects().filter((obj) => obj instanceof Player);
    }
    addPlayers(player: Player) {
        this.addGameObject(player);
    }

    /** プレイヤーのターン進行順 */
    #turnOrder: Player[] = [];
    /** ターン順 */
    getTurnOrder(startIndex?: number): Player[] {
        if (startIndex === undefined) {
            return [...this.#turnOrder];
        } else if (startIndex > this.#turnOrder.length - 1) {
            throw new RangeError("Index Out of Range", { cause: startIndex });
        } else {
            return new Array<Player>().concat(
                this.#turnOrder.slice(startIndex),
                this.#turnOrder.slice(0, startIndex - 1)
            );
        }
    }
    /** ターン順を設定する。 */
    setTurnOrder(players: Player[]) {
        const nonExistent = players.filter(
            (pl) => !this.getPlayers().includes(pl)
        );
        if (nonExistent.length > 0) {
            throw new Error("that player doesn't exist", {
                cause: nonExistent,
            });
        } else {
            this.#turnOrder = players;
        }
    }

    /* ========================================================== */
    // MARK: 領域
    /* ========================================================== */
    /** 領域 */
    #zones: Zone[] = [];

    /** 領域の種類とオーナーを指定して領域を取得 */
    getZone(arg: {
        zoneType?: ZoneType | ZoneType[];
        owner?: Player | Player[];
    }): Zone[] {
        const cond1: (z: Zone) => boolean = (z) =>
            arg.zoneType === undefined
                ? true
                : Array.isArray(arg.zoneType)
                ? arg.zoneType.includes(z.zoneType)
                : z.zoneType === arg.zoneType;
        const cond2: (z: Zone) => boolean = (z) =>
            arg.owner === undefined
                ? true
                : Array.isArray(arg.owner)
                ? z.owner !== undefined && arg.owner.includes(z.owner)
                : z.owner === arg.owner;
        return this.#zones.filter((z) => cond1(z) && cond2(z));
    }
    /** 領域を追加 */
    addZone(zone: Zone) {
        this.#zones.push(zone);
    }
    /** 戦場 */
    get battlefield(): Zone[] {
        return this.getZone({ zoneType: Battlefield });
    }
    /** スタック */
    get stack(): Zone[] {
        return this.getZone({ zoneType: Stack });
    }
    /** 追放 */
    get exile(): Zone[] {
        return this.getZone({ zoneType: Exile });
    }
    /** 手札（人数分） */
    get hand(): Zone[] {
        return this.getZone({ zoneType: Hand });
    }
    /** ライブラリー（人数分） */
    get library(): Zone[] {
        return this.getZone({ zoneType: Library });
    }
    /** 墓地（人数分） */
    get graveyard(): Zone[] {
        return this.getZone({ zoneType: Graveyard });
    }
    /** 統率（人数分） */
    get command(): Zone[] {
        return this.getZone({ zoneType: Command });
    }

    /* ========================================================== */
    // MARK: ターン・フェイズ
    /* ========================================================== */
    /** 現在のターン */
    #turn: Turn | undefined;
    /** 現在のフェイズ */
    #phase: Phase | undefined;
    /** 現在のステップ */
    #step: Step | undefined;

    getTurn(): Turn | undefined {
        return this.#turn;
    }
    setTurn(turn: Turn) {
        this.#turn = turn;
    }
    getPhase(): Phase | undefined {
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
    /** 優先権を連続でパスしたプレイヤーの数 */
    #passCount: number = 0;
    /** 優先権を連続でパスしたプレイヤーの数 */
    get passCount(): number {
        return this.#passCount;
    }
    /** クリンナップをもう一度行うかどうか。
     * クリンナップの間に状況起因処理か能力の誘発があった場合、
     * そのクリンナップでは優先権が発生するとともに、追加のクリンナップが発生する。 */
    #cleanupAgain = false;
    /** クリンナップをもう一度行うかどうか。
     * クリンナップの間に状況起因処理か能力の誘発があった場合、
     * そのクリンナップでは優先権が発生するとともに、追加のクリンナップが発生する。 */
    get cleanupAgain(): boolean {
        return this.#cleanupAgain;
    }
    /** アクティブプレイヤー */
    #activePlayerIndex: number | undefined;
    /** アクティブプレイヤー */
    get activePlayerIndex(): number | undefined {
        return this.#activePlayerIndex;
    }
    set activePlayerIndex(index: number | undefined) {
        this.#activePlayerIndex = index;
    }
    /** 現在優先権を持っているプレイヤーの、 turn_order でのインデックス。 */
    #priorityPlayerIndex?: number | undefined;
    /** 優先権を持つプレイヤー */
    get playerWithPriority(): number | undefined {
        return this.#priorityPlayerIndex;
    }
    set playerWithPriority(index: number | undefined) {
        this.#priorityPlayerIndex = index;
    }
    /** 最後に通常のターンを行ったプレイヤーの、 turn_order でのインデックス。 */
    #currentTurnOrderIndex?: number | undefined;
    /** 最後に通常のターンを行ったプレイヤーのインデックス。 */
    get currentTurnOrder(): number | undefined {
        return this.#currentTurnOrderIndex;
    }
    set currentTurnOrder(index: number | undefined) {
        this.#currentTurnOrderIndex = index;
    }
    /** プレイヤーをAPNAP順で返す。 */
    getPlayersByAPNAPOrder(): Player[] {
        const activePlayer = this.getTurn()?.active_player;
        if (activePlayer === undefined) {
            throw new Error("No Active Player");
        } else {
            const activePlayerIndex = this.getTurnOrder().findIndex((pl) =>
                pl.equals(activePlayer)
            );
            return this.getTurnOrder(activePlayerIndex);
        }
    }

    // ==================================================================
    // MARK: その他
    // ==================================================================
    /** ディープコピー */
    deepcopy(): GameState {
        return new GameState(); // TODO:
    }
    getCharacteristics(): Map<number, Characteristics> {
        const appliedSource = [];
        // 第1a種
        const effects_1a: ModifyingLayer1a[] = this.getGameObjects().filter(
            (ef) => ef instanceof ModifyingLayer1a
        );
        // 特性定義能力を適用
        // 1a種すべてをすべての順序で適用してみて依存をチェック
        // 依存があってループしているならタイムスタンプ順で適用、ループしていないなら依存順で適用、依存がないならタイムスタンプ順で適用
        // - 適用順は１つ適用する事に再計算する

        // 第1b種
        // 第2種
        // 第3種
        // 第4種
        // 能力無効チェック (その能力からの継続的効果をすでに適用しているならそのまま適用し、していないならもうその能力からの効果は適用しない)
        // 第5種
        // 第6種
        // 能力無効チェック (その能力からの継続的効果をすでに適用しているならそのまま適用し、していないならもうその能力からの効果は適用しない)
        // 第7a種
        // 第7b種
        // 第7c種
        // 第7d種

        // TODO: 領域や唱え方、代替の特性などに影響される
        // 1. 特性定義能力を適用
        // 2. LayerInstanceの参照をすべて解決してすべての順序で適用してみて、依存をチェック
        // 3. 依存があってループしているならタイムスタンプ順で適用、ループしていないなら依存順で適用、依存がないならタイムスタンプ順で適用
        // - 適用順は１つ適用する事に再計算する
    }
}

export class Timestamp {
    id: number;
    static latestId = -1;

    constructor() {
        this.id = ++Timestamp.latestId;
    }

    equals(other: Timestamp): boolean {
        return this.compareTo(other) === 0;
    }
    compareTo(other: Timestamp): number {
        return this.id < other.id ? -1 : this.id === other.id ? 0 : 1;
    }
}
