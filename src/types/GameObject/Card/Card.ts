import type { Zone } from "../../GameState/Game.js";
import type { Characteristics } from "../Characteristics/Characteristic.js";
import { GameObject } from "../GameObject.js";

/** カード */
export class Card extends GameObject {
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
