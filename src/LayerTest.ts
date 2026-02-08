import { createCharacteristicsAlteringEffect } from "./types/GameObject/GeneratedEffect/ContinuousEffect.js";
import { createTimestamp } from "./types/GameState/Timestamp.js";
import type { CardQuery, GameObjectQuery } from "./types/Query/ArrayQuery.js";

// 特性を変更する継続的効果の適用順は
// - オブジェクト単位では決まらず、存在するすべてのオブジェクト（戦場以外も含む）を俯瞰したうえで決まる。
// - 最初にすべての順序を決定してから適用するのではなく、各レイヤーごとに「決定→適用」を繰り返す。
//   1. まず特性定義能力を適用する。
//     1. 各効果が他の各効果に依存しているかをチェックする。
//     2. 依存関係に基づいて適用する。
//   2. 特性定義能力でない能力について同様に行う。
//     1. 各効果が他の各効果に依存しているかをチェックする。
//       - 効果Aが効果Bに依存しているかどうかは、効果ABそれ自体だけでは決まらず、効果Aに依存を引き起こすようなオブジェクトが存在するかどうかによって決まる。
//       - 効果Aが効果Bに依存しているかどうかは、オブジェクトごとに別々に決めるのではなく、効果ABについて決まり、すべてのオブジェクトについて同一である。
//     2. ほかの効果から依存されているものを適用する。依存がループしている能力についてはタイムスタンプ順で適用する。
//     3. 依存されていないものをタイムスタンプ順で適用する。
// - 適用の過程で、ある能力が失われても、その能力からの継続的効果がすでに1つ以上の種類別で適用されているなら、他の各種類別でも適用を続ける。

// 依存
// - 3種の効果を受けて効果の内容が変わるケース。
// - 4種および6種の効果を受けて能力が消失するケース。
//   - アーボーグ → 血染めの月
// - 継続的効果自体の発生する条件や、継続的効果の適用先オブジェクトの条件や、継続的効果の内容が、同じ種類別の性質を参照しているケース。
//   - 4種 : 錆びた秘宝（金属術でクリーチャーになる）機械の行進（アーティファクトはクリーチャーになる）
//   - 6種 : 逃亡した多相の戦士（対戦相手のクリーチャーが飛行を持つなら飛行を持つ）
//   - 7種 : 縫合グール（追放したクリーチャーのP/Tを持つ）

// const effects2: ContinuousEffect[] = [
//     createCharacteristicsAlteringEffect({ source: "Rusted Relic" }),
//     createCharacteristicsAlteringEffect({ source: "One with the Stars" }),
// ];
// const effects3: ContinuousEffect[] = [
//     createCharacteristicsAlteringEffect({ source: "Sutured Ghoul" }),
//     createCharacteristicsAlteringEffect({ source: "Maro" }),
// ];

// 茨の吟遊詩人、ベロ/Bello, Bard of the Brambles
// あなたのターンの間、あなたがコントロールしていてマナ総量が４以上であり
// 装備品でない各アーティファクトやあなたがコントロールしていて
// マナ総量が４以上でありオーラでない各エンチャントはそれぞれ、
// 他のタイプに加えて4/4のエレメンタル・クリーチャーであり、
// 破壊不能と速攻と「このクリーチャーがプレイヤー１人に戦闘ダメージを与えるたび、
// あなたはカード１枚を引く。」を持つ。
type param = {
    this: { type: "card" };
};
const bello = createCharacteristicsAlteringEffect<param>({
    source: "Bello",
    timestamp: createTimestamp(),
    affected: {
        zone: {
            type: "Battlefield",
        },
        manaValue: { type: "greaterEqual", number: 4 },
        controller: {
            type: "controller",
            object: { argument: "this" },
        },
        characteristics: {
            operation: "or",
            operand: [
                {
                    operation: "and",
                    operand: [
                        {
                            operation: "not",
                            operand: { subtype: "Equipment" },
                        },
                        { cardType: "Artifact" },
                    ],
                },
                {
                    operation: "and",
                    operand: [
                        {
                            operation: "not",
                            operand: { subtype: "Aura" },
                        },
                        { cardType: "Enchantment" },
                    ],
                },
            ],
        },
    } satisfies GameObjectQuery<param> & CardQuery<param>,
    layer4: {
        type: "4",
        types: [{ action: "append", typeQuery: ["Elemental", "Creature"] }],
    },
    layer6: { type: "6", ability: [] }, // FIXME:
    layer7b: {
        type: "7b",
        power: 4,
        toughness: 4,
    },
});
