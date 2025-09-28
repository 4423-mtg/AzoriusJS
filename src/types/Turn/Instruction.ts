import { CardType } from "./Characteristic";
/** 効果やルールによってゲーム中に行われる指示。
 */

import { Game, GameState, Zone, ZoneType } from "./Game";
import { GameObject, Card, Player, StackedAbility } from "./GameObject";
import {
    ReferenceParam,
    SingleRef,
    SingleSpec,
    MultiSpec,
    Spec,
    resolve_single_spec,
    resolve_multi_spec,
    resolve_spec,
    resolve_spec_apply,
    MultiRef,
} from "./Reference.js";
import { Phase, Step, Turn } from "./Turn";

export {
    Instruction,
    BeginNewTurn,
    BeginNewPhaseAndStep,
    BeginNewStep,
    Resolve,
    Cast,
    Paying,
    MoveZone,
    Drawing,
    DealingDamage,
    GainLife as GainingLife,
    Tapping,
    Exile,
    Sacrifice,
    Discarding,
    Countering,
    Milling,
};

/** 処理指示を表すクラス。効果やターン起因処理、状況起因処理などの行う指示
 * ゲーム中に実行されるときに`Reference`を通じて実際のゲーム内の情報を注入される
 */
abstract class Instruction {
    /** InstructionのID (0始まり) */
    id: number;
    controller: SingleSpec<Player>;
    performer: Spec<Player>;

    constructor(controller: SingleSpec<Player>, performer?: Spec<Player>) {
        this.controller = controller;
        this.performer = performer ?? controller;
    }

    /** 指示を実際に実行する。引数として渡された`GameState`を単に変更するだけでよい。 */
    abstract perform: (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => void;
}

// - Instruction は入れ子になることがある。
//   - どのような入れ子になるかは各 Instruction が各自定義する。
// - 種類の異なる Instruction が同時に実行されることがある。

// MARK:ルール上の処理 ************************************************
/** 新しいターンを開始する */ // OK:
class BeginNewTurn extends Instruction {
    turn: Turn;

    constructor(p: [...ConstructorParameters<typeof Instruction>, turn: Turn]) {
        const [controller, performer, turn] = p;
        super(controller, performer);
        this.turn = turn;
    }
    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        new_state.set_turn(this.turn);
    };
}

/** 新しいフェイズとステップを開始する */ // OK:
class BeginNewPhaseAndStep extends Instruction {
    phase: Phase;
    step: Step | undefined;

    constructor(phase: Phase, step: Step | undefined) {
        super();
        this.phase = phase;
        this.step = step;
    }
    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        new_state.set_phase(this.phase);
        new_state.set_step(this.step);
    };
}

/** 新しいステップを開始する */ // OK:
class BeginNewStep extends Instruction {
    step: Step | undefined;
    constructor(step: Step | undefined) {
        super();
        this.step = step;
    }
    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        new_state.set_step(this.step);
    };
}

/** 呪文や能力を解決する。マナ能力を含む */
class Resolve extends Instruction {
    resolved_object: Card | StackedAbility;

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {};
}

// MARK: 唱える関連 ********************************
/** 唱える */
class Cast extends Instruction {
    casted: SingleSpec<GameObject>;

    constructor(object: GameObject) {
        super();
        this.casted = object;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        // 1. スタックに移動させる
        // 2. モードやコストの支払い方を選ぶ
        // 3. 対象を選ぶ
        // 4. 適正チェック
        // 5. 総コスト決定
        // 6. マナ能力起動
        // 7. コストの支払い
    };
}

/** 起動する */

/** 誘発する */
// class Triggering extends Instruction {}

/** プレイする */

/** 呪文や能力を解決する */
// class Resolving extends Instruction {}

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

// MARK: 非キーワード ********************************
type MoveSpec = {
    moved: Spec<Card | StackedAbility>;
    dest: SingleSpec<Zone> | ((obj: Card | StackedAbility) => SingleSpec<Zone>);
};
/** 領域を移動させる */ // OK:
class MoveZone extends Instruction {
    /** 移動させるオブジェクトと、移動先領域の組。 */
    object_specs: MoveSpec[];

    constructor(
        controller: SingleSpec<Player>,
        /** 移動させるオブジェクトと、移動先領域の組。 */
        movespecs: MoveSpec[],
        performer?: Spec<Player>
    ) {
        super(controller, performer);
        this.object_specs = movespecs;
    }

    /** 単一のオブジェクトを移動する操作 */
    #move = (
        obj: Card | StackedAbility,
        new_state: GameState,
        dest: (_: Card | StackedAbility) => SingleRef<Zone>,
        params: ReferenceParam
    ) => {
        // 移動後のオブジェクトを取得する
        // FIXME: IDが同じなら型も同じであることを明示できるようにする
        const obj_new = new_state.game_objects().find((o) => o.id === obj.id);
        // 領域を変更する
        if (obj_new instanceof Card || obj_new instanceof StackedAbility) {
            obj_new.zone = resolve_single_spec(dest(obj_new), params);
        }
    };

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        const params: ReferenceParam = { game: game, self: self };
        // 各 spec について
        this.object_specs.forEach((movespec) => {
            // 移動されるオブジェクトを解決し、それぞれについて移動操作を行う
            const moved_obj = ([] as (Card | StackedAbility)[]).concat(
                resolve_spec<Card | StackedAbility>(movespec.moved, params)
            );

            moved_obj.forEach((o) =>
                this.#move(o, new_state, movespec.dest, params)
            );
        });
        return new_state;
    };
}

// test ok
const Evacuation = new MoveZone(
    this.controller,
    [
        {
            moved: new MultiRef((params) => {
                return params.game.current
                    .permanents()
                    .filter((c) =>
                        c
                            .characteristics()
                            .card_types?.includes(CardType.Creature)
                    );
            }),
            dest: (obj) =>
                new SingleRef<Zone>((params) => {
                    return params.game.current.zones(
                        [ZoneType.Hand],
                        [obj.owner]
                    )[0];
                }),
        },
    ],
    this.performer
);

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
class GainLife extends Instruction {
    specs: { player: MultiSpec<Player>; amount_spec: SingleSpec<number> }[];

    constructor(
        controller: SingleSpec<Player>,
        specs: {
            player: MultiSpec<Player>;
            amount_spec: SingleSpec<number>;
        }[]
    ) {
        super();
        this.specs = specs;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {};
    // const new_params = { ...params, state: new_state };
    // this.specs.forEach((each_spec) => {
    //     const player = resolve_multi_spec<Player>(
    //         each_spec.player,
    //         new_params
    //     );
    // });
    // const am =
    //     this.amount_spec instanceof ValueReference
    //         ? this.amount_spec.execute(params)
    //         : this.amount_spec;
    // if (this.perform instanceof Player) {
    //     const new_state = params.state.deepcopy();
    //     // new_stateのperformerどうやってとる？
    //     // (this.performer as Player).life += am;
    //     return new_state;
    // } else {
    //     throw Error("player undefined");
    // }
}

/** カウンターを置く・得る */
// class PuttingCounter extends Instruction {
//     counters: Counter[];

//     constructor(counters: Counter[]) {
//         super();
//         this.counters = counters;
//     }

//     perform(args: Required<ReferenceParam>): GameState {}
// }

/** 見る */
/** 束に分ける */
/** 値を選ぶ・宣言する */
// class DeclaringValue extends Instruction {}

/** 裏向きにする・表向きにする */

// MARK: 常盤木 *****************************************
/** タップ */
class Tapping extends Instruction {
    tapped: MultiSpec<GameObject>; // TODO: ここも再考を要する

    constructor(
        controller: SingleSpec<Player>,
        permanents: MultiSpec<GameObject>,
        performer?: Spec<Player>
    ) {
        super(controller, performer);
        this.tapped = permanents;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {};
    // // まずstateをコピーする。このstateを変更して返す
    // this.refs_objects.forEach((ref) => {
    //     // コピーしたstateを渡して参照を解決する
    //     const objects = ref({ ...params, state: new_state });
    //     // stateを変更する
    //     objects.forEach((obj) => {
    //         // パーマネントであればタップする
    //         if (obj.is_permanent()) {
    //             obj.status.tapped = true;
    //         } else {
    //             throw Error("Referenced object is not a permanent.");
    //         }
    //     });
    // });
    // // 変更した新しいstateを返す
    // return new_state;
}

/** アンタップ */
// class Untapping extends Instruction {
//     permanents: ValueReference[];
// }

/** 追放する */ // OK:
class Exile extends MoveZone {
    constructor(
        controller: SingleSpec<Player>,
        exiled: Spec<Card | StackedAbility>[],
        performer: Spec<Player>
    ) {
        // destが追放領域固定のMoveZone
        super(
            controller,
            exiled.map((ex) => ({
                moved: ex,
                dest: new SingleRef<Zone>((params: ReferenceParam) =>
                    params.game.current.exile()
                ),
            })),
            performer
        );
    }
}

/** 破壊する */ // OK:
class Destroy extends Instruction {
    destroyed: Spec<Card>[];

    constructor(
        controller: SingleSpec<Player>,
        destroyed: Spec<Card>[],
        performer?: Spec<Player>
    ) {
        super(controller, performer);
        this.destroyed = destroyed;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        // 移動先が墓地の MoveZone を生成して perform する
        const movezone = new MoveZone(
            this.controller,
            this.destroyed.map((sac) => ({
                moved: sac,
                dest: (obj) =>
                    new SingleRef<Zone>(
                        (params: ReferenceParam) =>
                            params.game.current.zones(
                                [ZoneType.Graveyard],
                                [obj.owner]
                            )[0]
                    ),
            })),
            this.performer
        );
        movezone.perform(new_state, self, game);
    };
}

/** 打ち消す */ // OK:
class Countering extends Instruction {
    countered: Spec<Card | StackedAbility>[];

    constructor(
        controller: SingleSpec<Player>,
        countered: Spec<Card | StackedAbility>[],
        performer: Spec<Player>
    ) {
        super(controller, performer);
        this.countered = countered;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        // 移動先が墓地の MoveZone を生成して perform する
        const movezone = new MoveZone(
            this.controller,
            this.countered.map((sac) => ({
                moved: sac,
                dest: (obj) =>
                    new SingleRef<Zone>(
                        (params: ReferenceParam) =>
                            params.game.current.zones(
                                [ZoneType.Graveyard],
                                [obj.owner]
                            )[0]
                    ),
            })),
            this.performer
        );
        movezone.perform(new_state, self, game);
    };
}

/** 生け贄に捧げる */ // OK:
class Sacrifice extends Instruction {
    sacrificed: Spec<Card>[];

    constructor(
        controller: SingleSpec<Player>,
        sacrificed: Spec<Card>[],
        performer?: Spec<Player>
    ) {
        super(controller, performer);
        this.sacrificed = sacrificed;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        // 移動先が墓地の MoveZone を生成して perform する
        const movezone = new MoveZone(
            this.controller,
            this.sacrificed.map((sac) => ({
                moved: sac,
                dest: (obj) =>
                    new SingleRef<Zone>(
                        (params: ReferenceParam) =>
                            params.game.current.zones(
                                [ZoneType.Graveyard],
                                [obj.owner]
                            )[0]
                    ),
            })),
            this.performer
        );
        movezone.perform(new_state, self, game);
    };
}

/** 捨てる */ // OK:
class Discarding extends Instruction {
    discarded: Spec<Card>;

    constructor(
        controller: SingleSpec<Player>,
        discarded: Spec<Card>,
        performer?: Spec<Player>
    ) {
        super(controller, performer);
        this.discarded = discarded;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        // 移動先が墓地の MoveZone を生成して perform する
        const movezone = new MoveZone(
            this.controller,
            [
                {
                    moved: this.discarded,
                    dest: (obj) =>
                        new SingleRef<Zone>(
                            (params: ReferenceParam) =>
                                params.game.current.zones(
                                    [ZoneType.Graveyard],
                                    [obj.owner]
                                )[0]
                        ),
                },
            ],
            this.performer
        );
        movezone.perform(new_state, self, game);
    };
}

/** 切削する */ // OK:
class Milling extends Instruction {
    n: SingleSpec<number>;

    constructor(
        controller: SingleSpec<Player>,
        n: SingleSpec<number>,
        performer?: Spec<Player>
    ) {
        super(controller, performer);
        this.n = n;
    }

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        const movezone = new MoveZone(
            this.controller,
            [
                {
                    moved: new MultiRef<Card>(
                        (param: ReferenceParam) =>
                            param.game.current.game_objects() // FIXME: 上からN枚
                    ),
                    dest: (obj) =>
                        new SingleRef<Zone>(
                            (params: ReferenceParam) =>
                                params.game.current.zones(
                                    [ZoneType.Graveyard],
                                    [obj.owner]
                                )[0]
                        ),
                },
            ],
            this.performer
        );
        movezone.perform(new_state, self, game);
    };
}

/** 探す */
// class Searching extends Instruction {
//     searched_objects = [];
// }

/** 切り直す */
// class Shuffling extends Instruction {}

/** 公開する */
// class Revealing extends Instruction {
//     revealed_objects = [];
// }

/** 生成する */
// class Creating extends Instruction {}

/** つける */
// class Attaching extends Instruction {}
/** はずす */
// class Unattaching extends Instruction {}
/** 格闘を行う */
// class Fighting extends Instruction {}

/** 占術を行う */
// class Scrying extends Instruction {}
/** 諜報を行う */
// class Surveiling extends Instruction {}
/** 倍にする */
// class Doubling extends Instruction {}
/** 交換する */
// class Exchanging extends Instruction {}

/** 変身する */
// class Transforming extends Instruction {}

/** 再生する */
// class Regenerating extends Instruction {}
