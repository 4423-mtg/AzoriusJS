// MARK: 型定義: 1a
import type { GameObject } from "../../GameObject/GameObject.js";
import type { Game } from "../../GameState/Game.js";
import type { MultiSpec, SingleSpec } from "../../Query/QueryFunction.js";
import type { Characteristics, CopiableValue } from "../Characteristic.js";

/** コピー可能な効果の適用 */ // FIXME: シリアライズ可能にする必要あり
export type Layer1a = {
    type: "1a";
    affected: MultiSpec<GameObject>;
    spec: AlterCopyableValueSpec; // TODO: タグ化処理
};
export function isLayer1a(arg: unknown): arg is Layer1a {
    // return isLayer(arg, "1a");
    // FIXME: 実装
}
function applyLayer1a(
    layer: Layer1a,
    game: Game,
): { object: GameObject; characteristics: Characteristics }[] {
    // TODO:
    return [];
}

type AlterCopyableValueSpec = { type: "" };
type AlterCopyableValue = () => SingleSpec<CopiableValue>;

// MARK: 型定義: 1b
/** 裏向きによる特性変更 */
export type Layer1b = {
    type: "1b";
    affected: MultiSpec<GameObject>;
    copyableValueAltering: (
        current: Characteristics,
        source?: GameObject,
    ) => SingleSpec<CopiableValue>;
};
export function isLayer1b(arg: unknown): arg is Layer1b {
    // return isLayer(arg, "1b");
    // FIXME: 実装
}
