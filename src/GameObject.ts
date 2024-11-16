/** ゲーム内のオブジェクト
 * カード、スタック上の能力、継続的効果、遅延誘発型能力、置換効果
 */
"use strict";

import { GameHistory, GameState, Zone } from "./Game";
import { Ability, SpellAbility, TriggeredAbility } from "./Ability";
import { CardType } from "./Characteristic";
import { Instruction } from "./Instruction";
import { MultiRef, ReferenceParam, SingleSpec } from "./Reference";
import { Phase, Step, Turn } from "./Turn";

export {
    GameObject,
    Card,
    Status,
    StackedAbility,
    ContinuousEffect,
    ReplacementEffect,
    DelayedTriggeredAbility,
    Additional,
    Player,
    Counter,
};

/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
abstract class GameObject {
    id: number;
    zone: Zone;
    owner: Player;
    controller: Player;

    // ----物理的特性----
    is_double_faced: boolean;

    // ----スタック上で取る特性----
    chosen_mode;
    x: number;
    target?: (GameObject | Player)[];
    distributing;
    paid_cost;
    // どんな効果によって唱えたかは記憶する？
    alternative_cost; // 支払った追加コスト

    // ----- ダメージ -----
    damage: number = 0;

    // 判定関数 ==========================
    /**
     * カードかどうか
     * @returns
     */
    is_card(): this is Card {
        return this instanceof Card;
    }

    /**
     * パーマネントかどうか。
     * typesを指定した場合はそのカードタイプすべてを持つパーマネントであるかどうか。
     * 指定しない場合は、単にパーマネントであるかどうか。
     * @param type カードタイプ
     * @returns
     */
    is_permanent(types?: CardType[]): this is Card {
        return (
            this instanceof Card &&
            this.zone.zonetype === ZoneType.Battlefield &&
            types?.every((t) =>
                this.characteristics.card_types?.includes(t)
            ) === true
        );
    }
}

// MARK: カード
/** カード */
class Card extends GameObject {
    constructor(spec: CharacteristicsSpec) {
        super();
        this.characteristics_sets.push(new Characteristics(spec));
    }

    // ====印刷されている値 ====
    /** 印刷されている特性の組（分割や出来事などを含む） */
    characteristics_sets: Characteristics[] = [];
    /** レイアウト */ // TODO 必要？
    layout;
    /** その時取っている特性組 */
    get characteristics() {
        return this.characteristics_sets[0]; // FIXME
    }

    // ==== ゲーム中に取る値 ====
    /** 位相 */
    status: Status;
    /** トークンやコピーであるか */
    is_copy: boolean = false;
    /** 乗っているカウンター */
    counters;
    /** 貼られているステッカー */
    stickers;
    /** クラスエンチャントのレベル。LvUpカードはLvカウンターなので関係ない */
    level;
    // ----マーカー類----
    /** 怪物的 */
    is_monstrous: boolean;
    is_renowned: boolean;
    is_goaded: boolean;
    is_suspected: boolean;

    // 解決
    resolve_as_spell(game_state: GameState, game_history: GameHistory): void {
        for (const spell_ability of this.characteristics.abilities.filter(
            (a: Ability) => a instanceof SpellAbility
        )) {
            (spell_ability as SpellAbility).perform(
                game_state,
                game_history,
                this
            );
        }
    }
}

/** 位相 */
class Status {
    tapped: boolean;
    flipped: boolean;
    is_face_down: boolean;
    is_phase_out: boolean;
}

// MARK: スタック上の能力
/** スタック上の能力 */
class StackedAbilityType {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    static Activated = new StackedAbilityType("activated");
    static Triggered = new StackedAbilityType("triggered");
    static DelayedTriggered = new StackedAbilityType("delayedTriggered");
    static ReflexiveTriggered = new StackedAbilityType("reflexiveTriggered");
}

/** スタック上の能力 */
class StackedAbility extends GameObject {
    /** 能力の種類。起動型、誘発型、遅延誘発型、再帰誘発型 */
    type: StackedAbilityType;
    /** 中身の能力 */
    ability: Ability;
    /** コントローラー */
    controller: Player;
    /** 能力の発生源 */
    source?: GameObject;

    constructor(
        type: StackedAbilityType,
        ability: Ability,
        controller: Player,
        source?: GameObject
    ) {
        super();
        this.type = type;
        this.ability = ability;
        this.controller = controller;
        this.source = source;
    }
}

// MARK: 継続的効果
/** 継続的効果
 * 1. 特性や値を変更する効果
 * 2. 手続きを修整する効果
 */
class ContinousEffectType {
    type: "AltarValue" | "AlterProcess" | "ForbidProcess";
}

class ContinuousEffect extends GameObject {
    // 1. 期間
}

/** Instructionの実行が特定の条件を満たすかどうかを判定する関数を表す型 */
type InstructionChecker = (args: {
    instruction: Instruction;
    state: GameState;
    history: GameHistory;
    performer: GameObject | Player;
}) => boolean;

/** Instructionを別の1つ以上のInstructionに置き換える関数を表す型 */
type InstructionReplacer = (instruction: Instruction) => Instruction[];

/** 値や特性を変更する継続的効果 */
class ValueAlteringContinousEffect extends ContinuousEffect {
    /** 影響を及ぼすオブジェクト */
    affected_objects: GameObject[] | MultiRef[];
}

/** 手続きを変更する継続的効果 */
class ProcessAlteringContinousEffect extends ContinuousEffect {
    /** 変更対象の手続きに該当するかどうかをチェックする関数 */
    check: InstructionChecker;
    /** 変更後の処理 */
    replace: InstructionReplacer;

    constructor(
        /** 変更判定関数 */
        check: InstructionChecker,
        /** 変更後の処理 */
        replace: Instruction | Instruction[] | InstructionReplacer
    ) {
        super();
        this.check = check;
        if (typeof replace === "function") {
            this.replace = replace;
        } else if (Array.isArray(replace)) {
            this.replace = (instruction) => replace;
        } else {
            this.replace = (instruction) => [replace];
        }
    }
}

/** 処理を禁止する継続的効果 */
class ProcessForbiddingContinousEffect extends ContinuousEffect {
    /** 禁止対象の手続きに該当するかどうかをチェックする関数 */
    check: InstructionChecker;

    constructor(check: InstructionChecker) {
        super();
        this.check = check;
    }
}

// MARK: 置換効果
/** 置換効果 */
class ReplacementEffect extends GameObject {
    /** 置換対象の手続きに該当するかどうかをチェックする関数 */
    check: InstructionChecker;
    /** 置換後の処理 */
    replace: InstructionReplacer;

    constructor(
        check: InstructionChecker,
        replace: Instruction | Instruction[] | InstructionReplacer
    ) {
        super();
        this.check = check;
        if (typeof replace === "function") {
            this.replace = replace;
        } else if (Array.isArray(replace)) {
            this.replace = (instruction) => replace;
        } else {
            this.replace = (instruction) => [replace];
        }
    }
}

// MARK: 遅延誘発型能力
/** 遅延誘発型能力 */
class DelayedTriggeredAbility extends GameObject {
    // 誘発型能力のラップ
    /** 誘発する能力 */
    ability: TriggeredAbility;

    constructor(triggered_ability: TriggeredAbility) {
        super();
        this.ability = triggered_ability;
    }

    copy() {
        return new DelayedTriggeredAbility(this.ability);
    }
}

// MARK: ターン、フェイズ、ステップを追加する効果
/** 追加のターン、フェイズ、ステップ */
abstract class Additional extends GameObject {
    /** 開始する条件 */
    // NOTE: 「ターン開始タイミング」(Time Valutタイミング)で追加ターンが
    // 適用されるかどうかの判定が行われる。
    // 判定には以下のものを追加で使う
    // - 始まろうとしているターン
    // - この効果が生成されてからの履歴
    condition: boolean | ((params: ReferenceParam, next?: Turn) => boolean);
    // ターンスキップは置換効果なので、ターン追加はInstructionである
    instruction: Instruction;

    create(params: ReferenceParam): any {
        // FIXME: instructionだが戻り値は GameStateではない！
        return this.instruction.perform(params);
    }
}
// ターンを追加する
// フェイズ、ステップを追加する
// ターンを追加するが、その追加ターンのステップを飛ばす（瞬間の味わい）
// 次のターンをコントロールし、そのターンの後にターンを追加する（終末エムラ）
// 現在がメインフェイズならこの後にフェイズを追加する（連続突撃）
// ターンを追加するが、そのターンの終了ステップに敗北
// 開始フェイズと、N個のアップキープを追加する（オベカ）

class AdditionalTurn extends Additional {
    create(params: ReferenceParam): Turn {}
}
class AdditionalPhase extends Additional {
    create(params: ReferenceParam): Phase {}
}
class AdditionalStep extends Additional {
    create(params: ReferenceParam): Step {}
}

// ==================================================================
// MARK: プレイヤー
/** プレイヤー */
class Player {
    id: number;
    name?: string;
    life: number;
    counters: Counter[];
    abilities: Ability[];
    /** 既に敗北しているかどうか */
    losed: boolean = false;

    equals(player: Player): boolean {
        return this.id === player.id;
    }
}

// MARK: カウンター
class Counter {
    name: string;
    instructions?: Instruction[];

    constructor(name: string, instructions?: Instruction[]) {
        this.name = name;
        this.instructions = instructions;
    }

    static "+1/+1" = new Counter("+1/+1"); // FIXME
    static "-1/-1" = new Counter("-1/-1"); // FIXME
}
