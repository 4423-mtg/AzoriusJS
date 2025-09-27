/** 種類別レイヤー */
export class Layer {
    layer: (typeof _layer)[number];
    sublayer: (typeof _sublayer)[number];

    private constructor(
        layer: (typeof _layer)[number],
        sublayer?: (typeof _sublayer)[number]
    ) {
        if (
            _layerLiteral.filter(
                (l) => l.layer === layer && l.sublayer === sublayer
            ).length > 0
        ) {
            (this.layer = layer), (this.sublayer = sublayer);
        } else {
            throw new TypeError("Layer class constructer");
        }
    }

    isEqual(obj: Layer) {
        return this.layer === obj.layer && this.sublayer === obj.sublayer;
    }

    static readonly Layer1a = new Layer("1", "a");
    static readonly Layer1b = new Layer("1", "b");
    static readonly Layer2 = new Layer("2");
    static readonly Layer3 = new Layer("3");
    static readonly Layer4 = new Layer("4");
    static readonly Layer5 = new Layer("5");
    static readonly Layer6 = new Layer("6");
    static readonly Layer7a = new Layer("7", "a");
    static readonly Layer7b = new Layer("7", "b");
    static readonly Layer7c = new Layer("7", "c");
    static readonly Layer7d = new Layer("7", "d");
}

const _layer = ["1", "2", "3", "4", "5", "6", "7"] as const;
const _sublayer = ["a", "b", "c", "d", undefined] as const;
const _layerLiteral: readonly {
    layer: string;
    sublayer: string | undefined;
}[] = [
    { layer: "1", sublayer: "a" },
    { layer: "1", sublayer: "b" },
    { layer: "2", sublayer: undefined },
    { layer: "3", sublayer: undefined },
    { layer: "4", sublayer: undefined },
    { layer: "5", sublayer: undefined },
    { layer: "6", sublayer: undefined },
    { layer: "7", sublayer: "a" },
    { layer: "7", sublayer: "b" },
    { layer: "7", sublayer: "c" },
    { layer: "7", sublayer: "d" },
];
