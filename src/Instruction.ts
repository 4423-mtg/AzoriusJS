"use strict";
/** 効果やルールによってゲーム中に行われる指示。
 */

import { Game, GameHistory, GameState, Zone, ZoneType } from "./Game";
import { GameObject, Card, Player } from "./GameObject";
import {
    ReferenceParam,
    SingleRef,
    SingleSpec,
    MultiSpec,
    Spec,
    resolve_single_spec,
} from "./Reference";

export {
    Instruction,
    Cast,
    Paying,
    MoveZone,
    Drawing,
    DealingDamage,
    GainingLife,
    Tapping,
    Exile,
    Sacrifice,
    Discarding,
    Countering,
    Milling,
};

/** `Instruction`の実行関数`perform()`の引数 */
type PerformArgs = {
    /** 実行前の状態 */
    state: GameState;
    /** 履歴 */
    history: GameHistory;
    // /** 対象物 */
    // objective?: GameObject[];
};

/** 処理指示を表すクラス。効果やターン起因処理、状況起因処理などの行う指示
 * ゲーム中に実行されるときに`Reference`を通じて実際のゲーム内の情報を注入される
 */
abstract class Instruction {
    /** 生成済みのインスタンスの数 */
    static instance_count = 0;
    /** InstructionのID (0始まり) */
    readonly id: number;

    /** このInstructionを指示したオブジェクト。実際の実行者とは別 */
    instructor?: SingleSpec<GameObject>;

    constructor(args: { instructor?: SingleSpec<GameObject> }) {
        this.id = Instruction.instance_count;
        Instruction.instance_count += 1;
        this.instructor = args.instructor;
    }

    abstract perform: (params: ReferenceParam) => GameState;
}

// MARK:ルール上の処理 ************************************************

// MARK: 唱える関連 ********************************
/** 唱える */
class Cast extends Instruction {
    casted: SingleSpec<GameObject>;

    constructor(
        args: ConstructorParameters<typeof Instruction>[0] & {
            object: GameObject;
        }
    ) {
        super(args);
        this.casted = args.object;
    }

    perform: (params: ReferenceParam) => GameState = (params) => {
        // 1. スタックに移動させる
        const state1 = new MoveZone({
            instructor: this.instructor,
            movespecs: [
                {
                    moved: resolve_single_spec(this.casted, params),
                    dest: params.state.get_zone(ZoneType.Stack),
                },
            ],
        }).perform(params);
        // 2. モードやコストの支払い方を選ぶ
        // 3. 対象を選ぶ
        // 4. 適正チェック
        // 5. 総コスト決定
        // 6. マナ能力起動
        // 7. コストの支払い
        return params.state; // TODO:
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

    constructor(
        args: ConstructorParameters<typeof Instruction>[0] & {
            costs: Instruction[];
        }
    ) {
        super(args);
        this.costs = args.costs;
    }

    perform: (params: ReferenceParam) => GameState = (params) => {
        // TODO: 複数のコストは好きな順番で支払える

        return this.costs.reduce((p: ReferenceParam, current: Instruction) => {
            let _p = p;
            _p.state = current.perform(_p);
            return _p;
        }, params).state;
    };
}

// MARK:キーワードでない処理 ********************************
/** 領域を移動させる */
class MoveZone extends Instruction {
    /** 移動させるオブジェクトと、移動先領域の組。 */
    movespecs: {
        /** 移動させるオブジェクト */
        moved: SingleSpec<GameObject>;
        /** 移動先の領域 */
        dest: SingleSpec<Zone>;
    }[];

    constructor(
        args: ConstructorParameters<typeof Instruction>[0] & {
            /** 移動指定の組 */
            movespecs: {
                /** 移動させるオブジェクト */
                moved: SingleSpec<GameObject>;
                /** 移動先の領域 */
                dest: SingleSpec<Zone>;
            }[];
        }
    ) {
        super(args);
        this.movespecs = args.movespecs;
    }

    perform = (params: ReferenceParam) => {
        const new_state = params.state.deepcopy();
        const new_params = { ...params, state: new_state };
        // 各 spec について
        this.movespecs.forEach((each_spec) => {
            // object_specを解決
            const obj = resolve_single_spec(each_spec.moved, new_params);
            const zone = resolve_single_spec(each_spec.dest, new_params);
            obj.zone = zone;
        });
        return new_state;
    };
}

/** カードを引く */
class Drawing extends Instruction {
    number: number | ValueReference;

    constructor(number: number | ValueReference, player: Player) {
        super();
        this.number = number;
        this.performer = player;
    }

    perform(args: Required<ReferenceParam>): GameState {
        /** 「カードを1枚引く」をN個作る */
        const number_of_cards =
            typeof this.number === "number"
                ? this.number
                : this.number.execute(args);

        let instructions: Instruction[] = [];
        for (let i = 0; i < number_of_cards; i++) {
            instructions.push(
                new MoveZone(
                    [top_of_library(this.performer)],
                    args.state.get_zone("Hand", this.performer) // 領域をどうやってとる？
                )
            );
        }

        return Instruction.performArray(instructions, args);
    }
}
// 托鉢するものは置換処理の方で特別扱いする

/** ダメージを与える */
class DealingDamage extends Instruction {
    /** ダメージを与える先のオブジェクト */
    objectives: (GameObject | Player | ObjectReference)[];
    /** ダメージの量 */
    amount: ValueReference;
    /** ダメージの発生源であるオブジェクト */
    source: ObjectReference;

    constructor(
        objectives: (GameObject | Player | ObjectReference)[],
        amount: ValueReference,
        source: ObjectReference
    ) {
        super();
        this.objectives = objectives;
        this.amount = amount;
        this.source = source;
    }

    perform(args: Required<ReferenceParam>): GameState {
        // 参照の解決
        let objs: (GameObject | Player)[] = this.objectives.flatMap((o) => {
            return o instanceof GameObject || o instanceof Player
                ? o
                : o.execute(args);
        });
        // 個数のチェック
        if (objs.length >= 2) {
            const each_dealings = new DoingSimultaneously(
                objs.map(
                    (o) => new DealingDamage([o], this.amount, this.source)
                )
            );
            // それぞれに同時にダメージ
            return each_dealings.perform(args);
        } else {
            const new_state = args.state.deepcopy();
            // ダメージ処理。パーマネントはダメージ、プレイヤーはライフ減少
            // 絆魂 --> 回復Instruction
            // 最後の情報
            if (objs[0] instanceof Player) {
                // ライフ減少　感染は毒カウンター --> カウンター配置Instruction
            } else if (objs[0] instanceof GameObject) {
                // ダメージを負う　感染は-1/-1カウンター
            }
            return new_state;
        }
    }
}

/** ライフを得る */
class GainingLife extends Instruction {
    specs: { player: MultiSpec<Player>; amount_spec: SingleSpec<number> }[];

    constructor(args: {
        instructor: SingleSpec<GameObject>;
        specs: {
            player: MultiSpec<Player>;
            amount_spec: SingleSpec<number>;
        }[];
    }) {
        super(args);
        this.specs = args.specs;
    }

    perform(params: Required<ReferenceParam>): GameState {
        const new_state = params.state.deepcopy();
        const new_params = { ...params, state: new_state };
        this.specs.forEach((each_spec) => {
            const player = resolve_multiple_spec<Player>(
                each_spec.player,
                new_params
            );
        });

        const am =
            this.amount_spec instanceof ValueReference
                ? this.amount_spec.execute(params)
                : this.amount_spec;
        if (this.perform instanceof Player) {
            const new_state = params.state.deepcopy();
            // new_stateのperformerどうやってとる？
            // (this.performer as Player).life += am;
            return new_state;
        } else {
            throw Error("player undefined");
        }
    }
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
    refs_objects: MultiSpec<GameObject>[];
    performer?: MultiSpec<Player>;
    constructor(permanents: ObjectReference[], performer?: Player) {
        super();
        this.refs_objects = permanents;
        this.performer = performer;
    }

    perform(params: Required<ReferenceParam>): GameState {
        // まずstateをコピーする。このstateを変更して返す
        const new_state = params.state.deepcopy();
        this.refs_objects.forEach((ref) => {
            // コピーしたstateを渡して参照を解決する
            const objects = ref({ ...params, state: new_state });
            // stateを変更する
            objects.forEach((obj) => {
                // パーマネントであればタップする
                if (obj.is_permanent()) {
                    obj.status.tapped = true;
                } else {
                    throw Error("Referenced object is not a permanent.");
                }
            });
        });
        // 変更した新しいstateを返す
        return new_state;
    }
}

/** アンタップ */
// class Untapping extends Instruction {
//     permanents: ValueReference[];
// }

/** 破壊する */
// class Destroying extends Instruction {
//     refs_objects = [];
// }

/** 追放する */
class Exile extends MoveZone {
    constructor(
        args: ConstructorParameters<typeof Instruction>[number] & {
            exiled: Spec<GameObject>;
        }
    ) {
        super(args);
        this.movespecs = this.movespecs.map((spec) => ({
            moved: spec.moved,
            dest: new SingleRef<Zone>((param: { state: GameState }) =>
                param.state.get_zone(ZoneType.Exile)
            ),
        }));
    }
}

/** 生け贄に捧げる */ // TODO
class Sacrifice extends MoveZone {
    constructor(args: ConstructorParameters<typeof MoveZone>[number]) {
        // FIXME そもそも移動先を指定する必要がないので MoveZoneの使い回しではいけない
        super(args);
        this.movespecs = this.movespecs.map((spec) => ({
            moved: spec.moved,
            dest: new SingleRef<Zone>((param: { state: GameState }) =>
                param.state.get_zone(ZoneType.Graveyard, spec.moved.owner)
            ),
        }));
    }
}

/** 探す */
// class Searching extends Instruction {
//     searched_objects = [];
// }

/** 切り直す */
// class Shuffling extends Instruction {}

/** 捨てる */
class Discarding extends MoveZone {
    discarded_cards = [];
}

/** 公開する */
// class Revealing extends Instruction {
//     revealed_objects = [];
// }

/** 打ち消す */
class Countering extends MoveZone {}

/** 生成する */
// class Creating extends Instruction {}

/** つける */
// class Attaching extends Instruction {}
/** はずす */
// class Unattaching extends Instruction {}
/** 格闘を行う */
// class Fighting extends Instruction {}
/** 切削する */
class Milling extends MoveZone {}
/** 占術を行う */
// class Scrying extends Instruction {}
/** 倍にする */
// class Doubling extends Instruction {}
/** 交換する */
// class Exchanging extends Instruction {}

/** 変身する */
// class Transforming extends Instruction {}

/** 再生する */
// class Regenerating extends Instruction {}

/** 諜報を行う */
// class Surveiling extends Instruction {}

// ================================================
// function CastAsInstructionReplacer(
//     arg: Instruction | Instruction[] | InstructionReplacer
// ) {
//     if (typeof arg === "function") {
//         return arg;
//     } else if (Array.isArray(arg)) {
//         return () => arg;
//     } else {
//         return () => [arg];
//     }
// }
