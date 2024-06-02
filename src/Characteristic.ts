export class Color {
    name: string;
    alias: string;

    constructor(name: string, alias: string) {
        this.name = name;
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

export class Subtype {}

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

export class CostSymbol {}
export class HybridSymbol extends CostSymbol {}
export class PhyrexiaManaSymbol extends CostSymbol {}
