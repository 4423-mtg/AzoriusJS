import type { ContinuousEffect } from "./ContinuousEffect.js";
import type { ReplacementEffect } from "./ReplacementEffect.js";
import type { AdditionalTurnEffect } from "./AdditionalTurnEffect.js";

// 呪文や能力などの発生源 ┬ 継続的効果 ┬ 特性変更
//                      │           ├ ルール変更
//                      │           └ 処理禁止
//                      ├ 置換効果
//                      └ ターン・フェイズ・ステップの追加

export type GeneratedEffect =
    | ContinuousEffect
    | ReplacementEffect
    | AdditionalTurnEffect;
