import type { LayerInstance } from "./LayerInstance.js";

/** 継続的効果 */
export class ContinuousEffect {
    source: any;
    effects: LayerInstance[] = [];
}
