/** ゲーム内のオブジェクト
 * カード、スタック上の能力、継続的効果、遅延誘発型能力、置換効果
 */
"use strict";

import { Zone } from "./Game";
import { Ability, SpellAbility, TriggeredAbility } from "./Ability";
import { Characteristics } from "./Characteristic";
import { Instruction, Resolve } from "./Instruction";
import { MultiRef, ReferenceParam, SingleSpec } from "./Reference";
import { Phase, Step, Turn } from "./Turn";

export {
    GameObject,
    Card,
    Spell,
    is_spell,
    Status,
    StackedAbility,
    GeneratedEffect,
    ContinuousEffect,
    ReplacementEffect,
    AdditionalEffect,
    AdditionalTurnEffect,
    AdditionalPhaseEffect,
    AdditionalStepEffect,
    Player,
    Counter,
};

// =================================================================

// MARK: GameObject
/** ゲーム内のオブジェクト。
 * ルール上の「オブジェクト」の他に、継続的効果や遅延誘発型能力など、
 * 「ゲームの状態」に含まれるもの全般。 */
abstract class GameObject {
    id: number;
    owner: Player;
    controller: Player;
}

// =================================================================
// MARK: カード
/** カード */
class Card extends GameObject {
    constructor(spec) {
        super();
    }

    // ====印刷されている値 ====
    /** 特性のレイアウト */
    layout: Layout;

    // ==== ゲーム中に取る値 ====
    /** 現在の特性 */
    characteristics(): Characteristics {
        // TODO: 領域や唱え方、代替の特性などに影響される
    }

    // 領域
    zone: Zone;

    /** 位相 */
    status: Status = {
        tapped: false,
        flipped: false,
        is_face_down: false,
        is_phase_out: false,
    };
    /** トークンであるか */
    is_token: boolean = false;
    /** 乗っているカウンター */
    counters: Map<string, number> = new Map();
    /** マーカー全般 */
    mark: Map<string, boolean> = new Map();

    // /** 貼られているステッカー */
    // stickers;
    /** クラスエンチャントのレベル。LvUpカードはLvカウンターなので関係ない */
    level: number = 0;
}

/** レイアウト */
type Layout = Characteristics | DoubleFaced | Split | Adventurer;
type DoubleFaced = {
    front: Exclude<Layout, DoubleFaced>;
    back: Exclude<Layout, DoubleFaced>;
};
type Split = {
    right: Exclude<Layout, DoubleFaced>;
    left: Exclude<Layout, DoubleFaced>;
};
type Adventurer = {
    body: Exclude<Layout, DoubleFaced>;
    adventure: Exclude<Layout, DoubleFaced>;
};

/** パーマネントの位相 */
type Status = {
    tapped: boolean;
    flipped: boolean;
    is_face_down: boolean;
    is_phase_out: boolean;
};

/** 呪文としての特性 */
type SpellCharacteristic = {
    // 2. 呪文の選択
    is_modal: boolean;
    modes;
    chosen_mode;
    /* TODO: 連繋 */
    /* TODO: 追加コスト・代替コスト・マナシンボルの支払い方の宣言 */

    // 3. 対象の選択
    target: GameObject[];
    // 4. 割り振りの選択
    distribution: Map<GameObject, number>;
    // 8. コストの支払い
    paid_cost;

    // 何によって唱えたか
    cast_by;

    // 解決処理
    resolve: Resolve;
};

type Spell = Card & SpellCharacteristic;

function is_spell(card: Card): card is Spell {
    // TODO: card instanceof SpellCharacteristic
    return true;
}

// =================================================================
// MARK: スタック上の能力
/** スタック上の能力 */
class StackedAbility extends GameObject {
    /** 発生源となった能力 */
    ability: Ability;
    /** 能力の発生源オブジェクト */
    source?: GameObject;

    /** 能力の種類。起動型、誘発型 */
    get ability_type() {
        return this.ability.type;
    }

    //
    is_modal: boolean;
    modes;
    chosen_mode;
    // TODO: いろいろ
    target: GameObject[];
    distribution: Map<GameObject, number>;
    paid_cost;
    resolve: Resolve;

    constructor(ability: Ability, controller: Player, source?: GameObject) {
        super();
        this.ability = ability;
        this.controller = controller;
        this.source = source;
    }
}

// =================================================================
// MARK: 継続的効果と置換効果
class GeneratedEffect extends GameObject {}

/** 継続的効果
 * 1. 特性や値を変更する効果
 * 2. 手続きを修整する効果
 */

class ContinuousEffect extends GeneratedEffect {
    // 1. 期間
}

// /** Instructionの実行が特定の条件を満たすかどうかを判定する関数を表す型 */
// type InstructionChecker = (args: {
//     instruction: Instruction;
//     state: GameState;
//     history: GameHistory;
//     performer: GameObject | Player;
// }) => boolean;

// /** Instructionを別の1つ以上のInstructionに置き換える関数を表す型 */
// type InstructionReplacer = (instruction: Instruction) => Instruction[];

// /** 値や特性を変更する継続的効果 */
// class ValueAlteringContinousEffect extends ContinuousEffect {
//     /** 影響を及ぼすオブジェクト */
//     affected_objects: GameObject[] | MultiRef[];
// }

// /** 手続きを変更する継続的効果 */
// class ProcessAlteringContinousEffect extends ContinuousEffect {
//     /** 変更対象の手続きに該当するかどうかをチェックする関数 */
//     check: InstructionChecker;
//     /** 変更後の処理 */
//     replace: InstructionReplacer;

//     constructor(
//         /** 変更判定関数 */
//         check: InstructionChecker,
//         /** 変更後の処理 */
//         replace: Instruction | Instruction[] | InstructionReplacer
//     ) {
//         super();
//         this.check = check;
//         if (typeof replace === "function") {
//             this.replace = replace;
//         } else if (Array.isArray(replace)) {
//             this.replace = (instruction) => replace;
//         } else {
//             this.replace = (instruction) => [replace];
//         }
//     }
// }

// /** 処理を禁止する継続的効果 */
// class ProcessForbiddingContinousEffect extends ContinuousEffect {
//     /** 禁止対象の手続きに該当するかどうかをチェックする関数 */
//     check: InstructionChecker;

//     constructor(check: InstructionChecker) {
//         super();
//         this.check = check;
//     }
// }

/** 置換効果 */
class ReplacementEffect extends GeneratedEffect {
    // /** 置換対象の手続きに該当するかどうかをチェックする関数 */
    // check: InstructionChecker;
    // /** 置換後の処理 */
    // replace: InstructionReplacer;
    // constructor(
    //     check: InstructionChecker,
    //     replace: Instruction | Instruction[] | InstructionReplacer
    // ) {
    //     super();
    //     this.check = check;
    //     if (typeof replace === "function") {
    //         this.replace = replace;
    //     } else if (Array.isArray(replace)) {
    //         this.replace = (instruction) => replace;
    //     } else {
    //         this.replace = (instruction) => [replace];
    //     }
    // }
}

// =================================================================
// MARK: 追加ターン
/** ターンを追加する効果 */
class AdditionalTurnEffect extends GameObject {
    /** ターンを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするターンを生成する */
    generate_turn: (params: ReferenceParam) => Turn;
}

/** フェイズを追加する効果 */
class AdditionalPhaseEffect extends GameObject {
    /** フェイズを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするフェイズを生成する */
    generate_phase: (params: ReferenceParam) => Phase;
}

/** ステップを追加する効果 */
class AdditionalStepEffect extends GameObject {
    /** ステップを追加する条件 */
    condition: SingleSpec<boolean>;
    /** 追加しようとするステップを生成する */
    generate_step: (params: ReferenceParam) => Step;

    constructor(generate_step: (params: ReferenceParam) => Step) {
        super();
        this.generate_step = generate_step;
    }
}
// ターンを追加する
// フェイズ、ステップを追加する
// ターンを追加するが、その追加ターンのステップを飛ばす（瞬間の味わい）
// 次のターンをコントロールし、そのターンの後にターンを追加する（終末エムラ）
// 現在がメインフェイズならこの後にフェイズを追加する（連続突撃）
// ターンを追加するが、そのターンの終了ステップに敗北
// 開始フェイズと、N個のアップキープを追加する（オベカ）

/** 追加のターン、フェイズ、ステップ */
type AdditionalEffect =
    | AdditionalTurnEffect
    | AdditionalPhaseEffect
    | AdditionalStepEffect;

// ==================================================================
// MARK: プレイヤー
/** プレイヤー */
class Player extends GameObject {
    name?: string;
    life: number;
    counters: Counter[];
    abilities: Ability[];
    /** 既に敗北しているかどうか */
    is_losed: boolean = false;

    equals(player: Player): boolean {
        return this.id === player.id;
    }
}

// =================================================================
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
