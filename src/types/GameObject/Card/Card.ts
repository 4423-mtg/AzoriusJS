import type { Printed } from "../../Characteristics/Characteristic.js";
import type { GameObject } from "../GameObject.js";
import type { Player } from "../Player.js";

export type Card = GameObject & {
    owner: Player;
    controller: Player;
    isToken: boolean;
    faces: Face[];
    status: Status;
    // TODO: 第1面/第2面は？
};
// ダンジョンはCardではないことにする

/** 位相。カードの置き方で表現できる状態。
 * - フェイズアウトは置き方で表現できないがこれはルール通り。 */
export type Status = {
    tapped: boolean;
    flipped: boolean;
    isFaceDown: boolean;
    isPhasedOut: boolean;
};

/** レイアウト */
export type Layout =
    | "normal"
    | "split"
    | "flip"
    | "double-faced"
    | "adventurer";

// card > face > face > ... > NormalLayoutFace
export type Face =
    | NormalLayoutFace
    | SplitLayoutFace
    | FlipLayoutFace
    | DoubleFacedLayoutFace
    | AdventurerLayoutFace;

/** 通常レイアウトの面 */
export type NormalLayoutFace = {
    layout: "normal";
    printed: Printed;
};
/** 分割レイアウトの面 */
export type SplitLayoutFace = {
    layout: "split";
    faces: Face[];
};
/** 反転レイアウトの面 */
export type FlipLayoutFace = {
    layout: "flip";
    faces: { top: Face; bottom: Face };
};
/** 両面レイアウトの面 */
export type DoubleFacedLayoutFace = {
    layout: "double-faced";
    faces: { front: Face; back: Face };
};
/** 当事者レイアウトの面 */
export type AdventurerLayoutFace = {
    layout: "adventurer";
    faces: { main: Face; adventure: Face };
};
