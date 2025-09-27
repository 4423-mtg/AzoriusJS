import { Layer } from "./layer.js";

/** 継続的効果 */
export class ContinuousEffect {
    source: any;
    effects: ModifyingCharacteristics[] = []; // 1つの継続的効果が複数の効果を持つ？
}

/** 特性変更 */
export class ModifyingCharacteristics {
    layer: Layer;

    constructor(layer: Layer) {
        this.layer = layer;
    }
}

export class ModifyingLayer1a {
    public get layer(): Layer {
        return Layer.Layer1a;
    }
}
