import { GameObject } from "../GameObject.js";
import { Player } from "../Player.js";
import type { Zone } from "../../GameState/Game.js";
import type {
    Characteristics,
    Printed,
} from "../../Characteristics/Characteristic.js";
import type { Sticker } from "../Sticker.js";

/** カード */
export class Card extends GameObject {
    constructor(owner: Player, face: Face) {
        super(owner);
        this.face = face;
        // TODO: controller
    }

    /** カードの面 */
    face: Face;
    /** トークンであるか */
    isToken: boolean = false;

    // ==== ゲーム中に取る値 ====
    /** 領域 */
    zone: Zone | undefined = undefined;

    /** 位相 */
    status: Status = {
        tapped: false,
        flipped: false,
        isFaceDown: false,
        isPhaseOut: false,
    };
    /** 乗っているカウンター */
    counters: Map<string, number> = new Map();
    /** マーカー全般 */
    mark: Map<string, boolean> = new Map();

    /** 貼られているステッカー */
    stickers: Sticker[] = []; // FIXME:
    /** クラスエンチャントのレベル。LvUpカードはLvカウンターなので関係ない */
    classLevel: number = 0;

    getCharacteristics(): Characteristics {
        // TODO: 領域や唱え方、代替の特性などに影響される
        // 継続的効果を種類別順に解決する

        // ContinuousEffect > レイヤー順で適用
        // 各レイヤーごとに
        // 1. 特性定義能力を適用
        // 2. LayerInstanceの参照をすべて解決してすべての順序で適用してみて、依存をチェック
        // 3. 依存があってループしているならタイムスタンプ順で適用、ループしていないなら依存順で適用、依存がないならタイムスタンプ順で適用
        // - 適用順は１つ適用する事に再計算する
        // - 第4種・第6種は能力を失わせるので、第5種・第7種の適用開始時に発生源の能力が失われていないかチェックする。
        //   その能力からの継続的効果をすでに適用しているならそのまま適用し、していないならもうその能力からの効果は適用しない
        return {};
    }
}

/** レイアウト */
type Layout = "normal" | "split" | "flip" | "double-faced" | "adventurer";

// card > face > layout > face > layout > ... > NormalLayoutFace
type Face = { layout: Layout } & (
    | NormalLayoutFace
    | SplitLayoutFace
    | FlipLayoutFace
    | DoubleFacedLayoutFace
    | AdventurerLayoutFace
);
type NormalLayoutFace = {
    layout: "normal";
    printed: Printed;
};
type SplitLayoutFace = {
    layout: "split";
    faces: Face[];
};
type FlipLayoutFace = {
    layout: "flip";
    faces: { top: Face; bottom: Face };
};
type DoubleFacedLayoutFace = {
    layout: "double-faced";
    faces: { front: Face; back: Face };
};
type AdventurerLayoutFace = {
    layout: "adventurer";
    faces: { main: Face; adventure: Face };
};

/** パーマネントの位相 */
type Status = {
    tapped: boolean;
    flipped: boolean;
    isFaceDown: boolean;
    isPhaseOut: boolean;
};
