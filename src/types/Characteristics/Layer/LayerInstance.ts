import type { Player } from "../../GameObject/Player.js";
import type { Ability, StaticAbility } from "../../GameObject/Ability.js";
import type { StackedAbility } from "../../GameObject/StackedAbility.js";
import type { Color } from "../Color.js";
import type { CardType } from "../CardType.js";
import type { Subtype } from "../Subtype.js";
import type { Supertype } from "../Supertype.js";
import { LayerType } from "./LayerType.js";
import type { SingleSpec, MultiSpec } from "../../Turn/Reference.js";
import type { Spell } from "../../GameObject/Card/Spell.js";

/** 特性変更 */
export abstract class LayerInstance {
    layer: LayerType;
    source: Spell | StackedAbility | StaticAbility | undefined;

    constructor(layer: LayerType, option?: LayerOptions) {
        this.layer = layer;
        this.source = option?.source;
    }
}

type LayerOptions = {
    source: Spell | StackedAbility | StaticAbility | undefined;
};

/** 1a: コピー可能な値の変更（コピー、変容） */
export class ModifyingLayer1a extends LayerInstance {
    // TODO: コピー可能な値
}

/** 1b: 裏向きであることによるコピー可能な値の変更 */
export class ModifyingLayer1b extends LayerInstance {
    // TODO: コピー可能な値
}

/** 2: コントローラー変更 */
export class ModifyingLayer2 extends LayerInstance {
    controller: SingleSpec<Player>;

    constructor(controller: SingleSpec<Player>, option?: LayerOptions) {
        super(LayerType.Layer2, option);
        this.controller = controller;
    }
}

/** 3: 文章変更 */
export class ModifyingLayer3 extends LayerInstance {
    // TODO: めんどくさそう
}

/** 4: カードタイプ・サブタイプ・特殊タイプ変更 */
export class ModifyingLayer4 extends LayerInstance {
    delete: MultiSpec<CardType | Subtype | Supertype> | undefined;
    additinal: MultiSpec<CardType | Subtype | Supertype> | undefined;

    constructor(
        args: {
            delete?: MultiSpec<CardType | Subtype | Supertype>;
            additinal?: MultiSpec<CardType | Subtype | Supertype>;
        },
        option?: LayerOptions
    ) {
        super(LayerType.Layer4, option);
        this.delete = args.delete;
        this.additinal = args.additinal;
    }
}

/** 5: 色変更 */
export class ModifyingLayer5 extends LayerInstance {
    colors: MultiSpec<Color>;

    constructor(colors: MultiSpec<Color>, option?: LayerOptions) {
        super(LayerType.Layer5, option);
        this.colors = colors;
    }
}

/** 6: 能力の追加/除去、能力を持つことの禁止 */
export class ModifyingLayer6 extends LayerInstance {
    abilities: MultiSpec<Ability>;

    constructor(abilities: MultiSpec<Ability>, option?: LayerOptions) {
        super(LayerType.Layer6, option);
        this.abilities = abilities;
    }
}

/** 7a: PTを定義する特性定義能力 */
export class ModifyingLayer7a extends LayerInstance {
    power_definition: SingleSpec<number>;
    toughness_definition: SingleSpec<number>;

    constructor(
        power_definition: SingleSpec<number>,
        toughness_definition: SingleSpec<number>,
        option?: LayerOptions
    ) {
        super(LayerType.Layer7a, option);
        this.power_definition = power_definition;
        this.toughness_definition = toughness_definition;
    }
}

/** 7b: 基本のPT */
export class ModifyingLayer7b extends LayerInstance {
    power: SingleSpec<number>;
    toughness: SingleSpec<number>;

    constructor(
        power: SingleSpec<number>,
        toughness: SingleSpec<number>,
        option: LayerOptions
    ) {
        super(LayerType.Layer7b, option);
        this.power = power;
        this.toughness = toughness;
    }
}

/** 7c: PT修整 */
export class ModifyingLayer7c extends LayerInstance {
    power_offset: SingleSpec<number>;
    toughness_offset: SingleSpec<number>;

    constructor(
        power_offset: SingleSpec<number>,
        toughness_offset: SingleSpec<number>,
        option?: LayerOptions
    ) {
        super(LayerType.Layer7c, option);
        this.power_offset = power_offset;
        this.toughness_offset = toughness_offset;
    }
}

/** 7d: PT入れ替え */
export class ModifyingLayer7d extends LayerInstance {
    constructor(option?: LayerOptions) {
        super(LayerType.Layer7d, option);
    }
}
