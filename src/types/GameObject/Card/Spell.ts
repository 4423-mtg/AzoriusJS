/** 呪文としての特性 */
export type SpellCharacteristic = {
    // 2. 呪文の選択
    is_modal: boolean;
    modes;
    chosen_mode;
    /* TODO: 連繋 */
    /* TODO: 追加コスト・代替コスト・マナシンボルの支払い方の宣言 */

    // 3. 対象の選択
    target: GameObject[];
    // 4. 割り振りの選択
    distribution: Map<GameObject, number>;
    // 8. コストの支払い
    paid_cost;

    // 何によって唱えたか
    cast_by;

    // 解決処理
    resolve: Resolve;
};
