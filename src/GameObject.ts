"use strict";

import { Ability, SpellAbility, TriggeredAbility } from "./Ability";
import {
    CardType,
    ColorIndicator,
    ManaSymbol,
    Subtype,
    Supertype,
} from "./Characteristic";
import { GameHistory, GameState } from "./Game";
import { Instruction } from "./Instruction";
import { Reference } from "./Reference";

/** ゲーム内のオブジェクト
 * カード、スタック上の能力、継続的効果、遅延誘発型能力、置換効果
 */

// ==== ゲーム内オブジェクト ======================================
/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
// TODO
// - オブジェクト
//   - カード　☑
//   - スタック上の能力
//   - 継続的効果
//   - 遅延誘発型能力
export abstract class GameObject {
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

/** カード */
export class Card extends GameObject {
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
    is_copy: boolean;
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

export class StackedAbilityType {
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
export class StackedAbility extends GameObject {
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

// ==================================================================
/** 継続的効果
 * 1. 特性や値を変更する効果
 * 2. 手続きを修整する効果
 */
export class ContinousEffectType {
    type: "AltarValue" | "AlterProcess" | "ForbidProcess";
}

export class ContinuousEffect extends GameObject {
    // TODO
    // 1. 期間
}

/** Instructionの実行が特定の条件を満たすかどうかを判定する関数を表す型 */
export type InstructionChecker = (args: {
    instruction: Instruction;
    state: GameState;
    history: GameHistory;
    performer: GameObject | Player;
}) => boolean;

/** Instructionを別の1つ以上のInstructionに置き換える関数を表す型 */
export type InstructionReplacer = (instruction: Instruction) => Instruction[];

// TODO
/** 値や特性を変更する継続的効果 */
export class ValueAlteringContinousEffect extends ContinuousEffect {
    /** 影響を及ぼすオブジェクト */
    affected_objects: GameObject[] | Reference[];
}

// OK
/** 手続きを変更する継続的効果 */
export class ProcessAlteringContinousEffect extends ContinuousEffect {
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

// OK
/** 処理を禁止する継続的効果 */
export class ProcessForbiddingContinousEffect extends ContinuousEffect {
    /** 禁止対象の手続きに該当するかどうかをチェックする関数 */
    check: InstructionChecker;

    constructor(check: InstructionChecker) {
        super();
        this.check = check;
    }
}

// ==================================================================
// OK
/** 置換効果 */
export class ReplacementEffect extends GameObject {
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

// OK 多分
/** 遅延誘発型能力 */
export class DelayedTriggeredAbility extends GameObject {
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

// ==================================================================
// TODO
/** 追加のターン、フェイズ、ステップ */
class Additional extends GameObject {
    /** 開始する条件 */
    condition;
}

class AdditionalTurn extends Additional {}

class AdditionalPhase extends Additional {}

class AdditionalStep extends Additional {}

// ==================================================================
/** 特性の指定 */
type CharacteristicsSpec = {
    name?: string[];
    mana_cost?: ManaSymbol[];
    color_indicator?: ColorIndicator;
    card_types?: CardType[];
    subtypes?: Subtype[];
    supertypes?: Supertype[];
    abilities?: Ability[] | (() => Ability[]);
    text?: string;
    power?: number | string;
    toughness?: number | string;
    loyalty?: number | string;
    defense?: number | string;
    hand_modifier?: number | string;
    life_modifier?: number | string;
};

/** 特性 */
export class Characteristics {
    name?: string;
    mana_cost?: ManaSymbol[];
    color_indicator?: ColorIndicator;
    card_types?: CardType[];
    subtypes?: Subtype[];
    supertypes?: Supertype[];
    abilities?: Ability[];
    text?: string;
    power?: number | string;
    toughness?: number | string;
    loyalty?: number | string;
    defense?: number | string;
    hand_modifier?: number | string;
    life_modifier?: number | string;
    constructor(characteristicsSpec: CharacteristicsSpec) {
        this.name = characteristicsSpec.name;
        this.mana_cost = characteristicsSpec.mana_cost;
        this.color_indicator = characteristicsSpec.color_indicator;
        this.card_types = characteristicsSpec.card_types;
        this.subtypes = characteristicsSpec.subtypes;
        this.supertypes = characteristicsSpec.supertypes;
        this.abilities = characteristicsSpec.abilities;
        this.text = characteristicsSpec.text;
        this.power = characteristicsSpec.power;
        this.toughness = characteristicsSpec.toughness;
        this.loyalty = characteristicsSpec.loyalty;
        this.defense = characteristicsSpec.defense;
        this.hand_modifier = characteristicsSpec.hand_modifier;
        this.life_modifier = characteristicsSpec.life_modifier;
    }
}

// ==================================================================
/** 位相 */
export class Status {
    tapped: boolean;
    flipped: boolean;
    is_face_down: boolean;
    is_phase_out: boolean;
}

/** プレイヤー */
export class Player {
    id: number;
    name?: string;
    life: number;
    counters: Counter[];
    abilities: Ability[];
}

/** 領域の種別 OK */
export class ZoneType {
    /** 領域の名前 */
    name: string;
    /** オーナーを持つかどうか。 */
    has_owner: boolean;
    /** この領域に置かれているオブジェクトが順序を持つかどうか。 */
    has_order: boolean;

    /**
     *
     * @param name 領域の名前
     * @param has_owner オーナーを持つかどうか。
     * @param has_order この領域に置かれているオブジェクトが順序を持つかどうか。
     */
    constructor(name: string, has_owner: boolean, has_order: boolean) {
        this.name = name;
        this.has_owner = has_owner;
        this.has_order = has_order;
    }

    /** 戦場 */
    static Battlefield = new ZoneType("battlefield", false, false);
    /** 手札 */
    static Hand = new ZoneType("hand", true, false);
    /** ライブラリー */
    static Library = new ZoneType("library", true, true);
    /** 墓地 */
    static Graveyard = new ZoneType("graveyard", true, true);
    /** 追放 */
    static Exile = new ZoneType("exile", false, false);
    /** 統率 */
    static Command = new ZoneType("command", true, false);
}

/** 領域 */
export class Zone {
    /** 領域の種別 */
    zonetype: ZoneType;
    /** 領域のオーナー */
    owner?: Player;
    /** この領域にあるオブジェクト */
    objects: GameObject[] = [];

    /**
     * @param zonetype 領域の種別
     * @param owner 領域のオーナー
     */
    constructor(zonetype: ZoneType, owner?: Player) {
        if (zonetype.has_owner) {
            if (owner !== undefined) {
                this.zonetype = zonetype;
                this.owner = owner;
            } else {
                throw new Error("owner of zone is undefined");
            }
        } else {
            this.zonetype = zonetype;
        }
    }
}

export class Counter {
    name: string;
    instructions?: Instruction[];

    constructor(name: string, instructions?: Instruction[]) {
        this.name = name;
        this.instructions = instructions;
    }

    static "+1/+1" = new Counter("+1/+1"); // FIXME
    static "-1/-1" = new Counter("-1/-1"); // FIXME
}
