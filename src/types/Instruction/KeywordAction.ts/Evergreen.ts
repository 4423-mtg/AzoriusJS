// 701.2 起動する activate
// 701.3 つける attach
// はずす
// 701.4 後見を受ける behold
// 701.5 唱える cast
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

// 701.6 打ち消す counter
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

// 701.7 生成する create
// 701.8 破壊する destroy
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

// 701.9 捨てる discard
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

// 701.10 倍にする double
// 701.11 3倍にする triple
// 701.12 交換する exchange
// 701.13 追放する exile
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

// 701.14 格闘を行う fight
// 701.15 使嗾する goad
// 701.16 調査を行う investigate
// 701.17 切削する mill
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

// 701.18 プレイする play
// 701.19 再生する regenerate

// 701.20 公開する reveal
// 701.21 生贄に捧げる sacrifice
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

// 701.22 占術を行う scry
// 701.23 探す search
// 701.24 切り直す shuffle
// 701.25 諜報を行う surveil
// 701.26 タップする tap
// アンタップする untap
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

// 701.27 変身させる transform

// 701.28 トランスフォームする convert
