import { Card } from "./GameObject";

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

export abstract class Subtype {
    // TODO
}

export class CreatureType extends Subtype {
    name: string;
    parent_type: CardType;

    constructor(name: string, parent_type: CardType) {
        super();
        this.name = name;
        this.parent_type = parent_type;
    }

    static Advisor = new CreatureType("Advisor", CardType.Creature);
    static = new CreatureType("", CardType.Creature);
    static Aetherborn = new CreatureType("Aetherborn", CardType.Creature);
    static Alien = new CreatureType("Alien", CardType.Creature);
    static Ally = new CreatureType("Ally", CardType.Creature);
    static Angel = new CreatureType("Angel", CardType.Creature);
    static Antelope = new CreatureType("Antelope", CardType.Creature);
    static Ape = new CreatureType("Ape", CardType.Creature);
    static Archer = new CreatureType("Archer", CardType.Creature);
    static Archon = new CreatureType("Archon", CardType.Creature);
    static Armadillo = new CreatureType("Armadillo", CardType.Creature);
    static Army = new CreatureType("Army", CardType.Creature);
    static Artificer = new CreatureType("Artificer", CardType.Creature);
    static Assassin = new CreatureType("Assassin", CardType.Creature);
    static AssemblyWorker = new CreatureType(
        "Assembly-Worker",
        CardType.Creature
    );
    static Astartes = new CreatureType("Astartes", CardType.Creature);
    static Atog = new CreatureType("Atog", CardType.Creature);
    static Aurochs = new CreatureType("Aurochs", CardType.Creature);
    static Avatar = new CreatureType("Avatar", CardType.Creature);
    static Azra = new CreatureType("Azra", CardType.Creature);
    static Badger = new CreatureType("Badger", CardType.Creature);
    static Balloon = new CreatureType("Balloon", CardType.Creature);
    static Barbarian = new CreatureType("Barbarian", CardType.Creature);
    static Bard = new CreatureType("Bard", CardType.Creature);
    static Basilisk = new CreatureType("Basilisk", CardType.Creature);
    static Bat = new CreatureType("Bat", CardType.Creature);
    static Bear = new CreatureType("Bear", CardType.Creature);
    static Beast = new CreatureType("Beast", CardType.Creature);
    static Beaver = new CreatureType("Beaver", CardType.Creature);
    static Beeble = new CreatureType("Beeble", CardType.Creature);
    static Beholder = new CreatureType("Beholder", CardType.Creature);
    static Berserker = new CreatureType("Berserker", CardType.Creature);
    static Bird = new CreatureType("Bird", CardType.Creature);
    static Blinkmoth = new CreatureType("Blinkmoth", CardType.Creature);
    static Boar = new CreatureType("Boar", CardType.Creature);
    static Bringer = new CreatureType("Bringer", CardType.Creature);
    static Brushwagg = new CreatureType("Brushwagg", CardType.Creature);
    static Camarid = new CreatureType("Camarid", CardType.Creature);
    static Camel = new CreatureType("Camel", CardType.Creature);
    static Capybara = new CreatureType("Capybara", CardType.Creature);
    static Caribou = new CreatureType("Caribou", CardType.Creature);
    static Carrier = new CreatureType("Carrier", CardType.Creature);
    static Cat = new CreatureType("Cat", CardType.Creature);
    static Centaur = new CreatureType("Centaur", CardType.Creature);
    static Cephalid = new CreatureType("Cephalid", CardType.Creature);
    static Child = new CreatureType("Child", CardType.Creature);
    static Chimera = new CreatureType("Chimera", CardType.Creature);
    static Citizen = new CreatureType("Citizen", CardType.Creature);
    static Cleric = new CreatureType("Cleric", CardType.Creature);
    static Clown = new CreatureType("Clown", CardType.Creature);
    static Cockatrice = new CreatureType("Cockatrice", CardType.Creature);
    static Construct = new CreatureType("Construct", CardType.Creature);
    static Coward = new CreatureType("Coward", CardType.Creature);
    static Coyote = new CreatureType("Coyote", CardType.Creature);
    static Crab = new CreatureType("Crab", CardType.Creature);
    static Crocodile = new CreatureType("Crocodile", CardType.Creature);
    static Ctan = new CreatureType("C’tan", CardType.Creature);
    static Custodes = new CreatureType("Custodes", CardType.Creature);
    static Cyberman = new CreatureType("Cyberman", CardType.Creature);
    static Cyclops = new CreatureType("Cyclops", CardType.Creature);
    static Dalek = new CreatureType("Dalek", CardType.Creature);
    static Dauthi = new CreatureType("Dauthi", CardType.Creature);
    static Demigod = new CreatureType("Demigod", CardType.Creature);
    static Demon = new CreatureType("Demon", CardType.Creature);
    static Deserter = new CreatureType("Deserter", CardType.Creature);
    static Detective = new CreatureType("Detective", CardType.Creature);
    static Devil = new CreatureType("Devil", CardType.Creature);
    static Dinosaur = new CreatureType("Dinosaur", CardType.Creature);
    static Djinn = new CreatureType("Djinn", CardType.Creature);
    static Doctor = new CreatureType("Doctor", CardType.Creature);
    static Dog = new CreatureType("Dog", CardType.Creature);
    static Dragon = new CreatureType("Dragon", CardType.Creature);
    static Drake = new CreatureType("Drake", CardType.Creature);
    static Dreadnought = new CreatureType("Dreadnought", CardType.Creature);
    static Drone = new CreatureType("Drone", CardType.Creature);
    static Druid = new CreatureType("Druid", CardType.Creature);
    static Dryad = new CreatureType("Dryad", CardType.Creature);
    static Dwarf = new CreatureType("Dwarf", CardType.Creature);
    static Efreet = new CreatureType("Efreet", CardType.Creature);
    static Egg = new CreatureType("Egg", CardType.Creature);
    static Elder = new CreatureType("Elder", CardType.Creature);
    static Eldrazi = new CreatureType("Eldrazi", CardType.Creature);
    static Elemental = new CreatureType("Elemental", CardType.Creature);
    static Elephant = new CreatureType("Elephant", CardType.Creature);
    static Elf = new CreatureType("Elf", CardType.Creature);
    static Elk = new CreatureType("Elk", CardType.Creature);
    static Employee = new CreatureType("Employee", CardType.Creature);
    static Eye = new CreatureType("Eye", CardType.Creature);
    static Faerie = new CreatureType("Faerie", CardType.Creature);
    static Ferret = new CreatureType("Ferret", CardType.Creature);
    static Fish = new CreatureType("Fish", CardType.Creature);
    static Flagbearer = new CreatureType("Flagbearer", CardType.Creature);
    static Fox = new CreatureType("Fox", CardType.Creature);
    static Fractal = new CreatureType("Fractal", CardType.Creature);
    static Frog = new CreatureType("Frog", CardType.Creature);
    static Fungus = new CreatureType("Fungus", CardType.Creature);
    static Gamer = new CreatureType("Gamer", CardType.Creature);
    static Gargoyle = new CreatureType("Gargoyle", CardType.Creature);
    static Germ = new CreatureType("Germ", CardType.Creature);
    static Giant = new CreatureType("Giant", CardType.Creature);
    static Gith = new CreatureType("Gith", CardType.Creature);
    static Gnoll = new CreatureType("Gnoll", CardType.Creature);
    static Gnome = new CreatureType("Gnome", CardType.Creature);
    static Goat = new CreatureType("Goat", CardType.Creature);
    static Goblin = new CreatureType("Goblin", CardType.Creature);
    static God = new CreatureType("God", CardType.Creature);
    static Golem = new CreatureType("Golem", CardType.Creature);
    static Gorgon = new CreatureType("Gorgon", CardType.Creature);
    static Graveborn = new CreatureType("Graveborn", CardType.Creature);
    static Gremlin = new CreatureType("Gremlin", CardType.Creature);
    static Griffin = new CreatureType("Griffin", CardType.Creature);
    static Guest = new CreatureType("Guest", CardType.Creature);
    static Hag = new CreatureType("Hag", CardType.Creature);
    static Halfling = new CreatureType("Halfling", CardType.Creature);
    static Hamster = new CreatureType("Hamster", CardType.Creature);
    static Harpy = new CreatureType("Harpy", CardType.Creature);
    static Hellion = new CreatureType("Hellion", CardType.Creature);
    static Hippo = new CreatureType("Hippo", CardType.Creature);
    static Hippogriff = new CreatureType("Hippogriff", CardType.Creature);
    static Homarid = new CreatureType("Homarid", CardType.Creature);
    static Homunculus = new CreatureType("Homunculus", CardType.Creature);
    static Horror = new CreatureType("Horror", CardType.Creature);
    static Horse = new CreatureType("Horse", CardType.Creature);
    static Human = new CreatureType("Human", CardType.Creature);
    static Hydra = new CreatureType("Hydra", CardType.Creature);
    static Hyena = new CreatureType("Hyena", CardType.Creature);
    static Illusion = new CreatureType("Illusion", CardType.Creature);
    static Imp = new CreatureType("Imp", CardType.Creature);
    static Incarnation = new CreatureType("Incarnation", CardType.Creature);
    static Inkling = new CreatureType("Inkling", CardType.Creature);
    static Inquisitor = new CreatureType("Inquisitor", CardType.Creature);
    static Insect = new CreatureType("Insect", CardType.Creature);
    static Jackal = new CreatureType("Jackal", CardType.Creature);
    static Jellyfish = new CreatureType("Jellyfish", CardType.Creature);
    static Juggernaut = new CreatureType("Juggernaut", CardType.Creature);
    static Kavu = new CreatureType("Kavu", CardType.Creature);
    static Kirin = new CreatureType("Kirin", CardType.Creature);
    static Kithkin = new CreatureType("Kithkin", CardType.Creature);
    static Knight = new CreatureType("Knight", CardType.Creature);
    static Kobold = new CreatureType("Kobold", CardType.Creature);
    static Kor = new CreatureType("Kor", CardType.Creature);
    static Kraken = new CreatureType("Kraken", CardType.Creature);
    static Llama = new CreatureType("Llama", CardType.Creature);
    static Lamia = new CreatureType("Lamia", CardType.Creature);
    static Lammasu = new CreatureType("Lammasu", CardType.Creature);
    static Leech = new CreatureType("Leech", CardType.Creature);
    static Leviathan = new CreatureType("Leviathan", CardType.Creature);
    static Lhurgoyf = new CreatureType("Lhurgoyf", CardType.Creature);
    static Licid = new CreatureType("Licid", CardType.Creature);
    static Lizard = new CreatureType("Lizard", CardType.Creature);
    static Manticore = new CreatureType("Manticore", CardType.Creature);
    static Masticore = new CreatureType("Masticore", CardType.Creature);
    static Mercenary = new CreatureType("Mercenary", CardType.Creature);
    static Merfolk = new CreatureType("Merfolk", CardType.Creature);
    static Metathran = new CreatureType("Metathran", CardType.Creature);
    static Minion = new CreatureType("Minion", CardType.Creature);
    static Minotaur = new CreatureType("Minotaur", CardType.Creature);
    static Mite = new CreatureType("Mite", CardType.Creature);
    static Mole = new CreatureType("Mole", CardType.Creature);
    static Monger = new CreatureType("Monger", CardType.Creature);
    static Mongoose = new CreatureType("Mongoose", CardType.Creature);
    static Monk = new CreatureType("Monk", CardType.Creature);
    static Monkey = new CreatureType("Monkey", CardType.Creature);
    static Moonfolk = new CreatureType("Moonfolk", CardType.Creature);
    static Mount = new CreatureType("Mount", CardType.Creature);
    static Mouse = new CreatureType("Mouse", CardType.Creature);
    static Mutant = new CreatureType("Mutant", CardType.Creature);
    static Myr = new CreatureType("Myr", CardType.Creature);
    static Mystic = new CreatureType("Mystic", CardType.Creature);
    static Naga = new CreatureType("Naga", CardType.Creature);
    static Nautilus = new CreatureType("Nautilus", CardType.Creature);
    static Necron = new CreatureType("Necron", CardType.Creature);
    static Nephilim = new CreatureType("Nephilim", CardType.Creature);
    static Nightmare = new CreatureType("Nightmare", CardType.Creature);
    static Nightstalker = new CreatureType("Nightstalker", CardType.Creature);
    static Ninja = new CreatureType("Ninja", CardType.Creature);
    static Noble = new CreatureType("Noble", CardType.Creature);
    static Noggle = new CreatureType("Noggle", CardType.Creature);
    static Nomad = new CreatureType("Nomad", CardType.Creature);
    static Nymph = new CreatureType("Nymph", CardType.Creature);
    static Octopus = new CreatureType("Octopus", CardType.Creature);
    static Ogre = new CreatureType("Ogre", CardType.Creature);
    static Ooze = new CreatureType("Ooze", CardType.Creature);
    static Orb = new CreatureType("Orb", CardType.Creature);
    static Orc = new CreatureType("Orc", CardType.Creature);
    static Orgg = new CreatureType("Orgg", CardType.Creature);
    static Otter = new CreatureType("Otter", CardType.Creature);
    static Ouphe = new CreatureType("Ouphe", CardType.Creature);
    static Ox = new CreatureType("Ox", CardType.Creature);
    static Oyster = new CreatureType("Oyster", CardType.Creature);
    static Pangolin = new CreatureType("Pangolin", CardType.Creature);
    static Peasant = new CreatureType("Peasant", CardType.Creature);
    static Pegasus = new CreatureType("Pegasus", CardType.Creature);
    static Pentavite = new CreatureType("Pentavite", CardType.Creature);
    static Performer = new CreatureType("Performer", CardType.Creature);
    static Pest = new CreatureType("Pest", CardType.Creature);
    static Phelddagrif = new CreatureType("Phelddagrif", CardType.Creature);
    static Phoenix = new CreatureType("Phoenix", CardType.Creature);
    static Phyrexian = new CreatureType("Phyrexian", CardType.Creature);
    static Pilot = new CreatureType("Pilot", CardType.Creature);
    static Pincher = new CreatureType("Pincher", CardType.Creature);
    static Pirate = new CreatureType("Pirate", CardType.Creature);
    static Plant = new CreatureType("Plant", CardType.Creature);
    static Porcupine = new CreatureType("Porcupine", CardType.Creature);
    static Possum = new CreatureType("Possum", CardType.Creature);
    static Praetor = new CreatureType("Praetor", CardType.Creature);
    static Primarch = new CreatureType("Primarch", CardType.Creature);
    static Prism = new CreatureType("Prism", CardType.Creature);
    static Processor = new CreatureType("Processor", CardType.Creature);
    static Rabbit = new CreatureType("Rabbit", CardType.Creature);
    static Raccoon = new CreatureType("Raccoon", CardType.Creature);
    static Ranger = new CreatureType("Ranger", CardType.Creature);
    static Rat = new CreatureType("Rat", CardType.Creature);
    static Rebel = new CreatureType("Rebel", CardType.Creature);
    static Reflection = new CreatureType("Reflection", CardType.Creature);
    static Rhino = new CreatureType("Rhino", CardType.Creature);
    static Rigger = new CreatureType("Rigger", CardType.Creature);
    static Robot = new CreatureType("Robot", CardType.Creature);
    static Rogue = new CreatureType("Rogue", CardType.Creature);
    static Sable = new CreatureType("Sable", CardType.Creature);
    static Salamander = new CreatureType("Salamander", CardType.Creature);
    static Samurai = new CreatureType("Samurai", CardType.Creature);
    static Sand = new CreatureType("Sand", CardType.Creature);
    static Saproling = new CreatureType("Saproling", CardType.Creature);
    static Satyr = new CreatureType("Satyr", CardType.Creature);
    static Scarecrow = new CreatureType("Scarecrow", CardType.Creature);
    static Scientist = new CreatureType("Scientist", CardType.Creature);
    static Scion = new CreatureType("Scion", CardType.Creature);
    static Scorpion = new CreatureType("Scorpion", CardType.Creature);
    static Scout = new CreatureType("Scout", CardType.Creature);
    static Sculpture = new CreatureType("Sculpture", CardType.Creature);
    static Serf = new CreatureType("Serf", CardType.Creature);
    static Serpent = new CreatureType("Serpent", CardType.Creature);
    static Servo = new CreatureType("Servo", CardType.Creature);
    static Shade = new CreatureType("Shade", CardType.Creature);
    static Shaman = new CreatureType("Shaman", CardType.Creature);
    static Shapeshifter = new CreatureType("Shapeshifter", CardType.Creature);
    static Shark = new CreatureType("Shark", CardType.Creature);
    static Sheep = new CreatureType("Sheep", CardType.Creature);
    static Siren = new CreatureType("Siren", CardType.Creature);
    static Skeleton = new CreatureType("Skeleton", CardType.Creature);
    static Slith = new CreatureType("Slith", CardType.Creature);
    static Sliver = new CreatureType("Sliver", CardType.Creature);
    static Sloth = new CreatureType("Sloth", CardType.Creature);
    static Slug = new CreatureType("Slug", CardType.Creature);
    static Snail = new CreatureType("Snail", CardType.Creature);
    static Snake = new CreatureType("Snake", CardType.Creature);
    static Soldier = new CreatureType("Soldier", CardType.Creature);
    static Soltari = new CreatureType("Soltari", CardType.Creature);
    static Spawn = new CreatureType("Spawn", CardType.Creature);
    static Specter = new CreatureType("Specter", CardType.Creature);
    static Spellshaper = new CreatureType("Spellshaper", CardType.Creature);
    static Sphinx = new CreatureType("Sphinx", CardType.Creature);
    static Spider = new CreatureType("Spider", CardType.Creature);
    static Spike = new CreatureType("Spike", CardType.Creature);
    static Spirit = new CreatureType("Spirit", CardType.Creature);
    static Splinter = new CreatureType("Splinter", CardType.Creature);
    static Sponge = new CreatureType("Sponge", CardType.Creature);
    static Squid = new CreatureType("Squid", CardType.Creature);
    static Squirrel = new CreatureType("Squirrel", CardType.Creature);
    static Starfish = new CreatureType("Starfish", CardType.Creature);
    static Surrakar = new CreatureType("Surrakar", CardType.Creature);
    static Survivor = new CreatureType("Survivor", CardType.Creature);
    static Synth = new CreatureType("Synth", CardType.Creature);
    static Tentacle = new CreatureType("Tentacle", CardType.Creature);
    static Tetravite = new CreatureType("Tetravite", CardType.Creature);
    static Thalakos = new CreatureType("Thalakos", CardType.Creature);
    static Thopter = new CreatureType("Thopter", CardType.Creature);
    static Thrull = new CreatureType("Thrull", CardType.Creature);
    static Tiefling = new CreatureType("Tiefling", CardType.Creature);
    static TimeLord = new CreatureType("Time Lord", CardType.Creature);
    static Treefolk = new CreatureType("Treefolk", CardType.Creature);
    static Trilobite = new CreatureType("Trilobite", CardType.Creature);
    static Triskelavite = new CreatureType("Triskelavite", CardType.Creature);
    static Troll = new CreatureType("Troll", CardType.Creature);
    static Turtle = new CreatureType("Turtle", CardType.Creature);
    static Tyranid = new CreatureType("Tyranid", CardType.Creature);
    static Unicorn = new CreatureType("Unicorn", CardType.Creature);
    static Vampire = new CreatureType("Vampire", CardType.Creature);
    static Varmint = new CreatureType("Varmint", CardType.Creature);
    static Vedalken = new CreatureType("Vedalken", CardType.Creature);
    static Viashino = new CreatureType("Viashino", CardType.Creature);
    static Volver = new CreatureType("Volver", CardType.Creature);
    static Wall = new CreatureType("Wall", CardType.Creature);
    static Walrus = new CreatureType("Walrus", CardType.Creature);
    static Warlock = new CreatureType("Warlock", CardType.Creature);
    static Warrior = new CreatureType("Warrior", CardType.Creature);
    static Weird = new CreatureType("Weird", CardType.Creature);
    static Werewolf = new CreatureType("Werewolf", CardType.Creature);
    static Whale = new CreatureType("Whale", CardType.Creature);
    static Wizard = new CreatureType("Wizard", CardType.Creature);
    static Wolf = new CreatureType("Wolf", CardType.Creature);
    static Wolverine = new CreatureType("Wolverine", CardType.Creature);
    static Wombat = new CreatureType("Wombat", CardType.Creature);
    static Worm = new CreatureType("Worm", CardType.Creature);
    static Wraith = new CreatureType("Wraith", CardType.Creature);
    static Wurm = new CreatureType("Wurm", CardType.Creature);
    static Yeti = new CreatureType("Yeti", CardType.Creature);
    static Zombie = new CreatureType("Zombie", CardType.Creature);
    static Zubera = new CreatureType("Zubera", CardType.Creature);
}

// 土地タイプ
// 呪文タイプ
// アーティファクト・タイプ
// エンチャント・タイプ
// プレインズウォーカー・タイプ
// バトル・タイプ
// 次元タイプ
// ダンジョン・タイプ

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
