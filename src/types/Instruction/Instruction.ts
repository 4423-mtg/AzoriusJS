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
import {
    resolveSingleSpec,
    resolveSpec,
    type MultiSpec,
    type QueryArgument,
    type SingleQuery,
    type SingleSpec,
    type Spec,
} from "../Query.js";

/** 処理。 */
export type Instruction = {
    instructor: SingleSpec<Player>;
    performer: SingleSpec<Player>;
    type: string; // FIXME:
};

// - Instruction は入れ子になることがある。
//   - どのような入れ子になるかは各 Instruction が各自定義する。
// - 種類の異なる Instruction が同時に実行されることがある。

// MARK:ルール上の処理 ************************************************
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
        dest: (_: Card | StackedAbility) => SingleQuery<Zone>,
        params: QueryArgument
    ) => {
        // 移動後のオブジェクトを取得する
        // FIXME: IDが同じなら型も同じであることを明示できるようにする
        const obj_new = new_state.game_objects().find((o) => o.id === obj.id);
        // 領域を変更する
        if (obj_new instanceof Card || obj_new instanceof StackedAbility) {
            obj_new.zone = resolveSingleSpec(dest(obj_new), params);
        }
    };

    perform = (
        new_state: GameState,
        self: GameObject | undefined,
        game: Game
    ) => {
        const params: QueryArgument = { game: game, self: self };
        // 各 spec について
        this.object_specs.forEach((movespec) => {
            // 移動されるオブジェクトを解決し、それぞれについて移動操作を行う
            const moved_obj = ([] as (Card | StackedAbility)[]).concat(
                resolveSpec<Card | StackedAbility>(movespec.moved, params)
            );

            moved_obj.forEach((o) =>
                this.#move(o, new_state, movespec.dest, params)
            );
        });
        return new_state;
    };
}

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
