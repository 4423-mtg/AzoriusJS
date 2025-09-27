import type { Ability } from "../../Ability.js";
import type { Color } from "../../Characteristic.js";
import type { Player } from "../../GameObject.js";
import type { MultiRef, SingleRef } from "../../Reference.js";
import { Layer } from "./layer.js";

/** 継続的効果 */
export class ContinuousEffect {
    source: any;
    effects: ModifyingCharacteristics[] = [];
}

/** 特性変更 */
export type ModifyingCharacteristics = {
    layer: Layer;
};

/** 1a: コピー可能な値の変更（コピー、変容） */
export class ModifyingLayer1a {
    readonly layer = Layer.Layer1a;
}

/** 1b: 裏向きであることによるコピー可能な値の変更 */
export class ModifyingLayer1b {
    readonly layer = Layer.Layer1b;
}

/** 2: コントローラー変更 */
export class ModifyingLayer2 {
    readonly layer = Layer.Layer2;

    controller: SingleRef<Player>;

    constructor(controller: SingleRef<Player>) {
        this.controller = controller;
    }
}

/** 3: 文章変更 */
export class ModifyingLayer3 {
    readonly layer = Layer.Layer3;
    // TODO: めんどくさそう
}

/** 4: カードタイプ・サブタイプ・特殊タイプ変更 */
export class ModifyingLayer4 {
    readonly layer = Layer.Layer4;
    // TODO:
}

/** 5: 色変更 */
export class ModifyingLayer5 {
    readonly layer = Layer.Layer5;
    colors: MultiRef<Color>;

    constructor(colors: MultiRef<Color>) {
        this.colors = colors;
    }
}

/** 6: 能力の追加/除去、能力を持つことの禁止 */
export class ModifyingLayer6 {
    readonly layer = Layer.Layer6;

    abilities: MultiRef<Ability>;

    constructor(abilities: MultiRef<Ability>) {
        this.abilities = abilities;
    }
}

/** 7a: PTを定義する特性定義能力 */
export class ModifyingLayer7a {
    readonly layer = Layer.Layer7a;

    power_definition: SingleRef<number>;
    toughness_definition: SingleRef<number>;
    constructor(
        power_definition: SingleRef<number>,
        toughness_definition: SingleRef<number>
    ) {
        this.power_definition = power_definition;
        this.toughness_definition = toughness_definition;
    }
}

/** 7b: 基本のPT */
export class ModifyingLayer7b {
    readonly layer = Layer.Layer7b;
    // 基本のPTの変更
    power: SingleRef<number>;
    toughness: SingleRef<number>;

    constructor(power: SingleRef<number>, toughness: SingleRef<number>) {
        this.power = power;
        this.toughness = toughness;
    }
}

/** 7c: PT修整 */
export class ModifyingLayer7c {
    readonly layer = Layer.Layer7c;
    // PT修整
    power_offset: SingleRef<number>;
    toughness_offset: SingleRef<number>;

    constructor(
        power_offset: SingleRef<number>,
        toughness_offset: SingleRef<number>
    ) {
        this.power_offset = power_offset;
        this.toughness_offset = toughness_offset;
    }
}

/** 7d: PT入れ替え */
export class ModifyingLayer7d {
    readonly layer = Layer.Layer7d;
}

// TODO: 型ガード
