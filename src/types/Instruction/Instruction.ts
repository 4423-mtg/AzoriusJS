/** 効果やルールによってゲーム中に行われる指示。 */
import type { Game } from "../GameState/Game.js";
import type { GameState } from "../GameState/GameState.js";
import type { Zone } from "../GameState/Zone.js";
import type { GameObject } from "../GameObject/GameObject.js";
import type { Card } from "../GameObject/Card/Card.js";
import type { Player } from "../GameObject/Player.js";
import type { StackedAbility } from "../GameObject/StackedAbility.js";
import type {
    PhaseParameters,
    StepParameters,
    TurnParameters,
} from "../Turn.js";
import type { MultiSpec, SingleSpec } from "../Query.js";
import type { Counter } from "../GameObject/Counter.js";

/** 処理。 */
export type Instruction = {
    instructor: SingleSpec<Player>;
    performer: SingleSpec<Player>;
    type: string; // FIXME:
};

// - Instruction は入れ子になることがある。
//   - どのような入れ子になるかは各 Instruction が各自定義する。
// - 種類の異なる Instruction が同時に実行されることがある。

// MARK: 基本 ************************************************
/** 領域の移動 */
export type Move = Instruction & {
    objects: MultiSpec<GameObject>;
    destination: (
        object: GameObject,
        source: GameObject
    ) => SingleSpec<Zone | undefined>;
};

/** 誘発する */
// class Triggering extends Instruction {}

/** 呪文や能力を解決する。マナ能力を含む */
class Resolve extends Instruction {
    resolved_object: Card | StackedAbility;

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {};
}

/** 支払う */
class Paying extends Instruction {
    costs: Instruction[];
    // 任意の処理がコストになりうる（例：炎の編み込み）

    constructor(costs: Instruction[]) {
        super();
        this.costs = costs;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        // TODO: 複数のコストは好きな順番で支払える
        // return this.costs.reduce((p: ReferenceParam, current: Instruction) => {
        //     let _p = p;
        //     _p.state = current.perform(_p);
        //     return _p;
        // }, params).state;
    };
}

/** カードを引く */
class Drawing extends Instruction {
    number: SingleSpec<number>;
    player: MultiSpec<Player>;

    constructor(number: SingleSpec<number>, player: MultiSpec<Player>) {
        // FIXME: 追加の変数があるものはプレイヤーごとに変数が違う場合があるため、
        // FIXME: 引数定義の仕方を変える必要がある
        super();
        this.number = number;
        this.player = player;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {};

    // perform = (new_state: GameState, params: ReferenceParam) => {
    //     /** 「カードを1枚引く」をN個作る */
    //     // const number_of_cards =
    //     //     typeof this.number === "number"
    //     //         ? this.number
    //     //         : this.number.execute(args);
    //     // let instructions: Instruction[] = [];
    //     // for (let i = 0; i < number_of_cards; i++) {
    //     //     instructions.push(
    //     //         new MoveZone(
    //     //             [top_of_library(this.performer)],
    //     //             args.state.get_zone("Hand", this.performer) // 領域をどうやってとる？
    //     //         )
    //     //     );
    //     // }
    //     // return Instruction.performArray(instructions, args);
    // };
}
// 托鉢するものは置換処理の方で特別扱いする

/** 新しいターンを開始する */
export type BeginNewTurn = Instruction & {
    type: "BeginNewTurn";
    params: SingleSpec<TurnParameters>;
};

/** 新しいフェイズとステップを開始する */
export type BeginNewPhaseStep = Instruction & {
    type: "BeginNewPhaseStep";
    phase: SingleSpec<PhaseParameters>;
    step?: SingleSpec<StepParameters>;
};

/** 新しいステップを開始する */
export type BeginNewStep = Instruction & {
    type: "BeginNewStep";
    step: SingleSpec<StepParameters>;
};

// MARK: 非キーワード ********************************
/** ダメージを与える */ // FIXME:
class DealingDamage extends Instruction {
    /** ダメージを与える先のオブジェクト */
    objectives: MultiSpec<Card | Player>;
    /** ダメージの量 */
    amount: undefined;
    /** ダメージの発生源であるオブジェクト */
    source: SingleSpec<Card>;

    constructor(
        objectives: MultiSpec<Card | Player>,
        amount: undefined,
        source: SingleSpec<Card>
    ) {
        super();
        this.objectives = objectives;
        this.amount = amount;
        this.source = source;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {};
    // 参照の解決
    // let objs: (GameObject | Player)[] = this.objectives.flatMap((o) => {
    //     return o instanceof GameObject || o instanceof Player
    //         ? o
    //         : o.execute(args);
    // });
    // // 個数のチェック
    // if (objs.length >= 2) {
    //     const each_dealings = new DoingSimultaneously(
    //         objs.map(
    //             (o) => new DealingDamage([o], this.amount, this.source)
    //         )
    //     );
    //     // それぞれに同時にダメージ
    //     return each_dealings.perform(args);
    // } else {
    //     const new_state = args.state.deepcopy();
    //     // ダメージ処理。パーマネントはダメージ、プレイヤーはライフ減少
    //     // 絆魂 --> 回復Instruction
    //     // 最後の情報
    //     if (objs[0] instanceof Player) {
    //         // ライフ減少　感染は毒カウンター --> カウンター配置Instruction
    //     } else if (objs[0] instanceof GameObject) {
    //         // ダメージを負う　感染は-1/-1カウンター
    //     }
    //     return new_state;
    // }
}

/** ライフを得る */
export type GainLife = Instruction & {
    amount: (player: Player) => SingleSpec<number>;
};

/** カウンターを置く・得る */
export type PutCounter = Instruction & {
    object: MultiSpec<GameObject>;
    counter: (object: GameObject) => MultiSpec<Counter>;
};

/** 見る */
/** 束に分ける */
/** 値を選ぶ・宣言する */

/** 裏向きにする・表向きにする */

// test ok
// const Evacuation = new MoveZone(
//     this.controller,
//     [
//         {
//             moved: new MultiRef((params) => {
//                 return params.game.current
//                     .permanents()
//                     .filter((c) =>
//                         c
//                             .characteristics()
//                             .card_types?.includes(CardType.Creature)
//                     );
//             }),
//             dest: (obj) =>
//                 new SingleRef<Zone>((params) => {
//                     return params.game.current.zones(
//                         [ZoneType.Hand],
//                         [obj.owner]
//                     )[0];
//                 }),
//         },
//     ],
//     this.performer
// );
