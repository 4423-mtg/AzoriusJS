"use strict";

import { Ability, SpellAbility, TriggeredAbility } from "./Ability";
import { GameHistory, GameState } from "./Game";
import { CheckingStateTriggers, Instruction } from "./Instruction";
import { Reference } from "./Reference";
import { Zone } from "./Zone";

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
export class GameObject {
    id: number;
    zone: Zone;
    owner: Player;
    controller: Player;

    // ----物理的特性----
    is_double_faced: boolean;

    // ----スタック上で取る特性----
    chosen_mode;
    x: number;
    target: GameObject;
    distributing;
    paid_cost;
    // どんな効果によって唱えたかは記憶する？
    alternative_cost; // 支払った追加コスト
}

/** カード */
export class Card extends GameObject {
    constructor(characteristics: Characteristics) {
        // FIXME
        super();
        if (Array.isArray(characteristics)) {
            this.characteristics_sets = characteristics;
        } else {
            this.characteristics_sets.push(characteristics);
        }
    }

    // ====印刷されている値 ====
    /** 印刷されている特性の組（分割や出来事などを含む） */
    characteristics_sets: Characteristics[] = [];
    /** レイアウト */ // TODO 必要？
    layout;
    /** その時取っている特性組 */
    get characteristics() {
        return this.characteristics_sets[0];
    } // FIXME

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

/** スタック上の能力 */
export class StackedAbility extends GameObject {
    /** 能力の種類。起動型、誘発型、遅延誘発型、再帰誘発型 */
    ability_type;
    /** 能力の発生源 */
    source: GameObject;
}

/** 継続的効果
 * 1. 特性や値を変更する効果
 * 2. 手続きを修整する効果
 */
export class ContinuousEffect extends GameObject {
    // 1. 期間
}

type Checker = ({
    instruction,
    state,
    history,
    performer,
}: {
    instruction?: Instruction;
    state?: GameState;
    history?: GameHistory;
    performer?: GameObject | Player | undefined;
}) => boolean;

type x = ({ a }: { a: number }) => boolean;

type Replacer<T> = (arg0: T) => T[];

/** 値や特性を変更する継続的効果 */
export class ValueAlteringContinousEffect extends ContinuousEffect {
    /** 影響を及ぼすオブジェクト */
    affected_objects: GameObject[] | Reference[];
}

/** 手続きを変更する継続的効果 */
export class ProcessAlteringContinousEffect extends ContinuousEffect {
    /** 変更対象の手続きに該当するかどうかをチェックする関数 */
    check: Checker;
    /** 変更後の処理 */
    replace: Replacer<Instruction>;

    constructor(
        check: Checker,
        replace: Instruction | Instruction[] | Replacer<Instruction>
    ) {
        super();
        this.check = check;
        if (replace instanceof Instruction) {
            this.replace = (arg0) => {
                return [replace];
            };
        } else if (
            Array.isArray(replace) &&
            replace.every((e) => e instanceof Instruction)
        ) {
            this.replace = (arg0) => {
                return replace;
            };
        } else if (typeof replace === "function") {
            this.replace = replace;
        }
    }
}

/** 処理を禁止する継続的効果 */
export class ForbidingContinousEffect extends ContinuousEffect {
    /** 禁止対象の手続きに該当するかどうかをチェックする関数 */
    check: Checker;

    constructor(check: Checker) {
        super();
        this.check = check;
    }
}

/** 置換効果 */
export class ReplacementEffect extends GameObject {
    /** 置換対象の手続きに該当するかどうかをチェックする関数 */
    check: Checker;
    /** 置換後の処理 */
    replace: Replacer<Instruction>;

    constructor(check: Checker, replace: Replacer<Instruction>) {
        super();
        this.check = check;
        this.replace = replace;
    }
}

/** 遅延誘発型能力 */
export class DelayedTriggeredAbility extends GameObject {
    // 誘発型能力のラップ

    /** 誘発する能力 */
    ability: TriggeredAbility;
}

/** 追加のターン、フェイズ、ステップ */
class Additional extends GameObject {
    /** 開始する条件 */
    condition;
}

class AdditionalTurn extends Additional {}

class AdditionalPhase extends Additional {}

class AdditionalStep extends Additional {}

// ==========================================
type CharacteristicsSpec = {
    name?: string;
    mana_cost?;
    color_indicator?;
    card_types?;
    subtypes?;
    supertypes?;
    abilities?: Ability | Ability[];
    text?: string;
    power?;
    toughness?;
    loyalty?;
    defense?;
    hand_modifier?;
    life_modifier?;
};

/** 特性 */
export class Characteristics {
    constructor({
        name,
        mana_cost,
        color_indicator,
        card_types,
        subtypes,
        supertypes,
        abilities,
        text,
        power,
        toughness,
        loyalty,
        defense,
        hand_modifier,
        life_modifier,
    }: CharacteristicsSpec) {
        this.name = name;
        this.mana_cost = mana_cost;
        this.color_indicator = color_indicator;
        this.card_types = card_types;
        this.subtypes = subtypes;
        this.supertypes = supertypes;
        this.abilities = abilities;
        this.text = text;
        this.power = power;
        this.toughness = toughness;
        this.loyalty = loyalty;
        this.defense = defense;
        this.hand_modifier = hand_modifier;
        this.life_modifier = life_modifier;
    }
    name: string;
    mana_cost;
    color_indicator;
    card_types;
    subtypes;
    supertypes;
    abilities: Ability[];
    text: string;
    power: number | string;
    toughness: number | string;
    loyalty: number | string;
    defense: number;
    hand_modifier: number;
    life_modifier: number;
}

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
    name: string;
}
