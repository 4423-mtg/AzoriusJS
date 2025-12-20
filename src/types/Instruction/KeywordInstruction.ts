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
