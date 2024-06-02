export class Color {
    name: string;
    alias?: string;

    constructor(name: string, alias?: string) {
        this.name = name;
        this.alias = alias;
    }

    static White = new Color("white", "W");
    static Blue = new Color("blue", "U");
    static Black = new Color("black", "B");
    static Red = new Color("red", "R");
    static Green = new Color("green", "G");
}

export class ColorIndicator {
    colors: Color[];

    constructor(colors: Color[]) {
        this.colors = colors;
    }

    // TODO 色指標の全組み合わせ
    // 単色:5
    White = new ColorIndicator([Color.White]);
    Blue = new ColorIndicator([Color.Blue]);
    Black = new ColorIndicator([Color.Black]);
    Red = new ColorIndicator([Color.Red]);
    Green = new ColorIndicator([Color.Green]);
    // 2色:10
    WU = new ColorIndicator([Color.White, Color.Blue]);
    UB = new ColorIndicator([Color.Blue, Color.Black]);
    BR = new ColorIndicator([Color.Black, Color.Red]);
    RG = new ColorIndicator([Color.Red, Color.Green]);
    GW = new ColorIndicator([Color.Green, Color.White]);
    WB = new ColorIndicator([Color.White, Color.Black]);
    UR = new ColorIndicator([Color.Blue, Color.Red]);
    BG = new ColorIndicator([Color.Black, Color.Green]);
    RW = new ColorIndicator([Color.Red, Color.White]);
    GU = new ColorIndicator([Color.Green, Color.Blue]);
    // 3色:10
    WUB = new ColorIndicator([Color.White, Color.Blue, Color.Black]);
    UBR = new ColorIndicator([Color.Blue, Color.Black, Color.Red]);
    BRG = new ColorIndicator([Color.Black, Color.Red, Color.Green]);
    RGW = new ColorIndicator([Color.Red, Color.Green, Color.White]);
    GWU = new ColorIndicator([Color.Green, Color.White, Color.Blue]);
    WBG = new ColorIndicator([Color.White, Color.Black, Color.Green]);
    URW = new ColorIndicator([Color.Blue, Color.Red, Color.White]);
    BGU = new ColorIndicator([Color.Black, Color.Green, Color.Blue]);
    RWB = new ColorIndicator([Color.Red, Color.White, Color.Black]);
    GUR = new ColorIndicator([Color.Green, Color.Blue, Color.Red]);
    // 4色:5
    WUBR = new ColorIndicator([
        Color.White,
        Color.Blue,
        Color.Black,
        Color.Red,
    ]);
    UBRG = new ColorIndicator([
        Color.Blue,
        Color.Black,
        Color.Red,
        Color.Green,
    ]);
    BRGW = new ColorIndicator([
        Color.Black,
        Color.Red,
        Color.Green,
        Color.White,
    ]);
    RGWU = new ColorIndicator([
        Color.Red,
        Color.Green,
        Color.White,
        Color.Blue,
    ]);
    GWUB = new ColorIndicator([
        Color.Green,
        Color.White,
        Color.Blue,
        Color.Black,
    ]);
    // 5色:1
    WUBRG = new ColorIndicator([
        Color.White,
        Color.Blue,
        Color.Black,
        Color.Red,
        Color.Green,
    ]);
}

export class CardType {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    static Sorcery = new CardType("Sorcery");
    static Artifact = new CardType("Artifact");
    static Enchantment = new CardType("Enchantment");
    static Creature = new CardType("Creature");
    static Land = new CardType("Land");
    static Instant = new CardType("Instant");
    static Planeswalker = new CardType("Planeswalker");
    static Tribal = new CardType("Tribal"); // TODO Tribal -> Kindred
    static Battle = new CardType("Battle");
    static Dungeon = new CardType("Dungeon");
    static Plane = new CardType("Plane");
    static Conspiracy = new CardType("Conspiracy");
}

export class Subtype {
    // TODO
}

export class Supertype {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    static Basic = new CardType("Basic");
    static Legendary = new CardType("Legendary");
    static World = new CardType("World");
    static Snow = new CardType("Snow");
    static Ongoing = new CardType("Ongoing");
}

/** コストシンボル。マナ以外のもの（エネルギーなど）も含む */
export class CostSymbol {}

/** 色マナシンボル */
class ColoredManaSymbol extends CostSymbol {
    color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }
}

/** 不特定マナシンボル */
class GenericManaSymbol extends CostSymbol {
    value: number | string;

    constructor(value: number | string) {
        super();
        this.value = value;
    }
}

/** ファイレクシア・マナ・シンボル */
class PhyrexiaManaSymbol extends CostSymbol {
    color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }

    static White = new PhyrexiaManaSymbol(Color.White);
    static Blue = new PhyrexiaManaSymbol(Color.Blue);
    static Black = new PhyrexiaManaSymbol(Color.Black);
    static Red = new PhyrexiaManaSymbol(Color.Red);
    static Green = new PhyrexiaManaSymbol(Color.Green);
}

/** 氷雪マナ・シンボル */
class SnowManaSymbol extends CostSymbol {
    // TODO
}

/** 混成シンボル */
class HybridSymbol extends CostSymbol {
    parts: CostSymbol[];

    constructor(parts: CostSymbol[]) {
        super();
        this.parts = parts;
    }
}

/** マナ・シンボル */
export class ManaSymbol extends CostSymbol {
    // constructor(spec: Color | number | "X" | "Y" | "Z") {
    //     super();
    //     if (typeof spec === "number") {
    //         return new GenericManaSymbol(spec);
    //     } else if (spec === "X" || spec === "Y" || spec === "Z") {
    //         return new GenericManaSymbol(spec);
    //     } else {
    //         return new ColoredManaSymbol(spec);
    //     }
    // }
    /** - Don't use this. Use static properties instead. */
    constructor() {
        super();
        throw Error();
    }

    // 色マナ
    static White = new ColoredManaSymbol(Color.White);
    static Blue = new ColoredManaSymbol(Color.Blue);
    static Black = new ColoredManaSymbol(Color.Black);
    static Red = new ColoredManaSymbol(Color.Red);
    static Green = new ColoredManaSymbol(Color.Green);
    // 不特定マナ
    static One = new GenericManaSymbol(1);
    static Two = new GenericManaSymbol(2);
    static Three = new GenericManaSymbol(3);
    static Four = new GenericManaSymbol(4);
    static Five = new GenericManaSymbol(5);
    static Six = new GenericManaSymbol(6);
    static Seven = new GenericManaSymbol(7);
    static Eight = new GenericManaSymbol(8);
    static Nine = new GenericManaSymbol(9);
    static Ten = new GenericManaSymbol(10);
    static Eleven = new GenericManaSymbol(11);
    static Twelve = new GenericManaSymbol(12);
    static Thirteen = new GenericManaSymbol(13);
    static Fourteen = new GenericManaSymbol(14);
    static Fifteen = new GenericManaSymbol(15);
    static X = new GenericManaSymbol("X");
    static Y = new GenericManaSymbol("Y");
    static Z = new GenericManaSymbol("Z");
    // ファイレクシアマナ
    static PhyWhite = new PhyrexiaManaSymbol(Color.White);
    static PhyBlue = new PhyrexiaManaSymbol(Color.Blue);
    static PhyBlack = new PhyrexiaManaSymbol(Color.Black);
    static PhyRed = new PhyrexiaManaSymbol(Color.Red);
    static PhyGreen = new PhyrexiaManaSymbol(Color.Green);
    // 氷雪マナシンボル
    static Snow = new SnowManaSymbol();
    // 2色混成マナシンボル
    static WU = new HybridSymbol([ManaSymbol.White, ManaSymbol.Blue]);
    static UB = new HybridSymbol([ManaSymbol.Blue, ManaSymbol.Black]);
    static BR = new HybridSymbol([ManaSymbol.Black, ManaSymbol.Red]);
    static RG = new HybridSymbol([ManaSymbol.Red, ManaSymbol.Green]);
    static GW = new HybridSymbol([ManaSymbol.Green, ManaSymbol.White]);
    static WB = new HybridSymbol([ManaSymbol.White, ManaSymbol.Black]);
    static UR = new HybridSymbol([ManaSymbol.Blue, ManaSymbol.Red]);
    static BG = new HybridSymbol([ManaSymbol.Black, ManaSymbol.Green]);
    static RW = new HybridSymbol([ManaSymbol.Red, ManaSymbol.White]);
    static GU = new HybridSymbol([ManaSymbol.Green, ManaSymbol.Blue]);
    // 単色混成マナシンボル
    static TwoOrWhite = new HybridSymbol([ManaSymbol.Two, ManaSymbol.White]);
    static TwoOrBlue = new HybridSymbol([ManaSymbol.Two, ManaSymbol.Blue]);
    static TwoOrBlack = new HybridSymbol([ManaSymbol.Two, ManaSymbol.Black]);
    static TwoOrRed = new HybridSymbol([ManaSymbol.Two, ManaSymbol.Red]);
    static TwoOrGreen = new HybridSymbol([ManaSymbol.Two, ManaSymbol.Green]);
    // 混成ファイレクシアマナシンボル
    static PhyRG = new HybridSymbol([ManaSymbol.PhyRed, ManaSymbol.PhyGreen]);
    static PhyGW = new HybridSymbol([ManaSymbol.PhyGreen, ManaSymbol.PhyWhite]);
    static PhyRW = new HybridSymbol([ManaSymbol.PhyRed, ManaSymbol.PhyWhite]);
    static PhyGU = new HybridSymbol([ManaSymbol.PhyGreen, ManaSymbol.PhyBlue]);
}

export function ManaSymbols(glyphs: string): ManaSymbol[] {
    // FIXME テキストからマナ・コストを生成する
    let x: ManaSymbol[] = [];
    return x;
}
