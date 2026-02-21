import type { CharacteristicsAlteringEffect } from "../../GameObject/GeneratedEffect/ContinuousEffect.js";
import type { Game } from "../../GameState/Game.js";
import { compareTimestamp } from "../../GameState/Timestamp.js";

import { type QueryParameter } from "../../Query/QueryParameter.js";
import type { Layer, LayerCategory } from "./Layer.js";

// =================================================================
// MARK: レイヤーの解決
export function applyLayerEffect() {
    // FIXME:
}

type EffectAndLayer<T extends LayerCategory, U extends QueryParameter> = {
    effect: CharacteristicsAlteringEffect<U>;
    layer: Layer<T, U>;
};

/** レイヤーの適用順を決定する。 */ // TODO: 実装
export function sortLayers<T extends LayerCategory, U extends QueryParameter>(
    args: EffectAndLayer<T, U>[],
    game: Game,
): typeof args {
    // - すべての継続的効果をすべての順序で適用してみて、依存をチェックする
    //   - 適用順を決めるに当たってはそれ以前のレイヤーの影響がある
    // - 依存があってループしているならタイムスタンプ順で適用、ループしていないなら依存順で適用する。依存がないものはタイムスタンプ順で適用する
    //   - 適用順は1つ適用するごとに計算し直す

    // - Aを適用することによってBの影響が変わる場合、BはAに依存している。
    //   CがAやBに直接依存していないがA->Bと適用することによってCの影響が変わる場合、Cは何に依存しているのか？
    // - A:銀白の突然変異(対象のパーマネントはアーティファクトである)、B:機械の行進(アーティファクトはクリーチャーである)、C:秘技の順応(クリーチャーは指定したタイプである)
    //   - BはAに依存している。ほかはどれも依存していない
    //   - Aを適用
    //   - Cは(アーティファクトがある場合のみ)Bに依存する

    const stack: EffectAndLayer<T, U>[] = []; // 適用順
    let latestStacked: EffectAndLayer<T, U>[] = [];
    while (stack.length < args.length) {
        // まだ適用順の決定していないもの
        const unstacked = args.filter((_a) => !stack.includes(_a));
        // FIXME: どれから適用するかは任意ではなく、直前に適用した効果に依存しているものを優先的に適用を試みる。それがまだ他の効果にも依存していることもある
        // 例: A<-B, A<-C で、A適用によりB<-Cが依存するようになるケースはある
        // アーティファクトがない状況
        // A: あるパーマネントをアーティファクト化
        // B: すべてのアーティファクトをクリーチャー化
        // C: すべてのクリーチャーでないアーティファクトをエンチャント化し、すべてのアーティファクト・クリーチャーを土地化

        // 1. 依存性のループを取得し、ループしている場合はそれらをタイムスタンプ順で適用する。
        // ある効果が複数のループに関与している場合は、それらのループすべてに含まれるすべての効果をタイムスタンプ順で適用する
        const loops: EffectAndLayer<T, U>[][] = _getDependencyLoops(
            unstacked,
            game,
        ); // FIXME: gameにstack内のレイヤーを仮適用した状態での依存関係を見る
        if (loops.length > 0) {
            const loop1 = loops.at(0) as EffectAndLayer<T, U>[];
            // そのループ自身およびそのループと同じ要素を持つすべてのループからすべての要素を取り出し、重複を削除する
            const effects: EffectAndLayer<T, U>[] = new Set<
                EffectAndLayer<T, U>
            >([
                ...loop1,
                ...loops
                    .slice(1)
                    .filter((_loop) => _includesSameObject(loop1, _loop))
                    .flat(),
            ])
                .values()
                .toArray();
            // タイムスタンプ順でスタックに入れる
            effects
                .toSorted((e1, e2) =>
                    compareTimestamp(e1.effect.timestamp, e2.effect.timestamp),
                )
                .forEach((e) => stack.push(e));

            // 2. それらの効果にループではない依存をしている効果を直後に適用する。
            // このときに適用される効果が複数あるなら、それらはタイムスタンプに従う
            _getDependencies(unstacked, game) // FIXME: gameにstack内のレイヤーを仮適用した状態での依存関係を見る
                .filter(
                    ({ depending, depended }) =>
                        effects.includes(depended) &&
                        !effects.includes(depending),
                )
                .map(({ depending }) => depending)
                .toSorted((e1, e2) =>
                    compareTimestamp(e1.effect.timestamp, e2.effect.timestamp),
                );

            continue;
        }

        // 3. 依存していないものを適用する。
        // TODO:
    }

    return stack;
    // 複数のオブジェクトが同時に領域に入る場合、コントローラーがそれらの相対的なタイムスタンプ順を自由に決定する
}

function _includesSameObject<T>(array1: T[], array2: T[]) {
    return array1.some((t1) => array2.some((t2) => t1 === t2));
}

function _getDependencyLoops<T extends LayerCategory, U extends QueryParameter>(
    args: EffectAndLayer<T, U>[],
    game: Game,
): EffectAndLayer<T, U>[][] {
    // FIXME: getDependencies を使って書き直す
    // 再帰的に探索する
    function _step(
        arg: EffectAndLayer<T, U>, // 探索起点
        args: EffectAndLayer<T, U>[], // 探索範囲
        _stack: EffectAndLayer<T, U>[],
    ): EffectAndLayer<T, U>[][] {
        return args
            .filter((_a) => isDependingOn(arg, _a, game))
            .map((_a): EffectAndLayer<T, U>[][] => {
                if (_stack.filter((_a2) => _a2 === _a).length > 0) {
                    return [[_a]];
                } else {
                    return _step(_a, args, [..._stack, _a]);
                }
            })
            .flat()
            .map((_array) => [arg, ..._array]);
    }

    // 全効果を起点として探索し、ループになっているものを返す
    return args
        .flatMap((_a) => _step(_a, args, [_a]))
        .filter((_array) => _array.at(0) === _array.at(-1));
}

export function isDependingOn<
    T extends LayerCategory,
    U extends QueryParameter,
>(
    layer1: { effect: CharacteristicsAlteringEffect<U>; layer: Layer<T, U> },
    layer2: { effect: CharacteristicsAlteringEffect<U>; layer: Layer<T, U> },
    game: Game,
): boolean {
    if (layer1 === layer2) {
        return false;
    } else {
        // TODO:

        return false;
    }
}

function _getDependencies<T extends LayerCategory, U extends QueryParameter>(
    layers: EffectAndLayer<T, U>[],
    game: Game,
): { depending: EffectAndLayer<T, U>; depended: EffectAndLayer<T, U> }[] {
    return layers.flatMap((_a1) =>
        layers
            .filter((_a2) => isDependingOn(_a1, _a2, game))
            .map((_a2) => ({ depending: _a1, depended: _a2 })),
    );
}
