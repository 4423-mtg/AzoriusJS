import { isNonbasicLand } from "./types/Characteristics/Characteristic.js";
import {
    type ContinuousEffect,
    createCharacteristicsAltering,
} from "./types/GameObject/GeneratedEffect/ContinuousEffect.js";
import {
    getAllCharacteristics,
    type GameState,
} from "./types/GameState/GameState.js";
import { createTimestamp } from "./types/GameState/Timestamp.js";
import {
    addCardType,
    overwriteType,
    permanentQuery,
} from "./types/Query/QueryFunction.js";

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

const ts = createTimestamp();
const urborg = createCharacteristicsAltering({
    source: "Urborg, Tomb of Yawgmoth",
    timestamp: ts,
    layer4: {
        type: "4",
        affected: permanentQuery(
            (chara) => chara.card_types?.includes("Land") ?? false,
        ),
        typeAltering: addCardType({ cardType: ["Land"] }),
    },
});
const bloodMoon = createCharacteristicsAltering({
    source: "Blood Moon",
    timestamp: ts,
    layer4: {
        type: "4",
        affected: permanentQuery(isNonbasicLand),
        typeAltering: overwriteType({ subtype: ["Mountain"] }),
    },
});

const state1: GameState = {
    timestamp: ts,
    players: [],
    turnOrder: [],
    zones: [],
    currentTurn: undefined,
    currentPhase: undefined,
    currentStep: undefined,
    currentPriorityPlayerIndex: undefined,
    numberOfPassedPlayers: 0,
    latestActionPlayerIndex: 0,
    cleanupAgainFlag: false,
    objects: [urborg, bloodMoon],
};

const charas = getAllCharacteristics(state1);

const effects2: ContinuousEffect[] = [
    createCharacteristicsAltering({ source: "Rusted Relic" }),
    createCharacteristicsAltering({ source: "One with the Stars" }),
];
const effects3: ContinuousEffect[] = [
    createCharacteristicsAltering({ source: "Sutured Ghoul" }),
    createCharacteristicsAltering({ source: "Maro" }),
];
