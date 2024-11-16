"use strict";
import { Card } from "./GameObject";

/** 特性の指定 */
type CharacteristicsSpec = {
    name?: string[];
    mana_cost?: ManaSymbol[];
    color_indicator?: ColorIndicator;
    card_types?: CardType[];
    subtypes?: Subtype[];
    supertypes?: Supertype[];
    abilities?: Ability[] | (() => Ability[]);
    text?: string;
    power?: number | string;
    toughness?: number | string;
    loyalty?: number | string;
    defense?: number | string;
    hand_modifier?: number | string;
    life_modifier?: number | string;
};

/** 特性 */
export class Characteristics {
    name?: string;
    mana_cost?: ManaSymbol[];
    color_indicator?: ColorIndicator;
    card_types?: CardType[];
    subtypes?: Subtype[];
    supertypes?: Supertype[];
    abilities?: Ability[];
    text?: string;
    power?: number | string;
    toughness?: number | string;
    loyalty?: number | string;
    defense?: number | string;
    hand_modifier?: number | string;
    life_modifier?: number | string;
    constructor(characteristicsSpec: CharacteristicsSpec) {
        this.name = characteristicsSpec.name;
        this.mana_cost = characteristicsSpec.mana_cost;
        this.color_indicator = characteristicsSpec.color_indicator;
        this.card_types = characteristicsSpec.card_types;
        this.subtypes = characteristicsSpec.subtypes;
        this.supertypes = characteristicsSpec.supertypes;
        this.abilities = characteristicsSpec.abilities;
        this.text = characteristicsSpec.text;
        this.power = characteristicsSpec.power;
        this.toughness = characteristicsSpec.toughness;
        this.loyalty = characteristicsSpec.loyalty;
        this.defense = characteristicsSpec.defense;
        this.hand_modifier = characteristicsSpec.hand_modifier;
        this.life_modifier = characteristicsSpec.life_modifier;
    }
}

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
    name: string;
    parent_type: CardType[];

    constructor(name: string, parent_type: CardType[]) {
        this.name = name;
        this.parent_type = parent_type;
    }
}

export class CreatureType extends Subtype {
    static Advisor = new CreatureType("Advisor", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Aetherborn = new CreatureType("Aetherborn", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Alien = new CreatureType("Alien", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ally = new CreatureType("Ally", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Angel = new CreatureType("Angel", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Antelope = new CreatureType("Antelope", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ape = new CreatureType("Ape", [CardType.Creature, CardType.Tribal]);
    static Archer = new CreatureType("Archer", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Archon = new CreatureType("Archon", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Armadillo = new CreatureType("Armadillo", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Army = new CreatureType("Army", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Artificer = new CreatureType("Artificer", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Assassin = new CreatureType("Assassin", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static AssemblyWorker = new CreatureType("Assembly-Worker", [
        CardType.Creature,
    ]);
    static Astartes = new CreatureType("Astartes", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Atog = new CreatureType("Atog", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Aurochs = new CreatureType("Aurochs", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Avatar = new CreatureType("Avatar", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Azra = new CreatureType("Azra", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Badger = new CreatureType("Badger", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Balloon = new CreatureType("Balloon", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Barbarian = new CreatureType("Barbarian", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Bard = new CreatureType("Bard", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Basilisk = new CreatureType("Basilisk", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Bat = new CreatureType("Bat", [CardType.Creature, CardType.Tribal]);
    static Bear = new CreatureType("Bear", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Beast = new CreatureType("Beast", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Beaver = new CreatureType("Beaver", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Beeble = new CreatureType("Beeble", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Beholder = new CreatureType("Beholder", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Berserker = new CreatureType("Berserker", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Bird = new CreatureType("Bird", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Blinkmoth = new CreatureType("Blinkmoth", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Boar = new CreatureType("Boar", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Bringer = new CreatureType("Bringer", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Brushwagg = new CreatureType("Brushwagg", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Camarid = new CreatureType("Camarid", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Camel = new CreatureType("Camel", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Capybara = new CreatureType("Capybara", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Caribou = new CreatureType("Caribou", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Carrier = new CreatureType("Carrier", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Cat = new CreatureType("Cat", [CardType.Creature, CardType.Tribal]);
    static Centaur = new CreatureType("Centaur", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Cephalid = new CreatureType("Cephalid", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Child = new CreatureType("Child", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Chimera = new CreatureType("Chimera", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Citizen = new CreatureType("Citizen", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Cleric = new CreatureType("Cleric", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Clown = new CreatureType("Clown", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Cockatrice = new CreatureType("Cockatrice", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Construct = new CreatureType("Construct", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Coward = new CreatureType("Coward", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Coyote = new CreatureType("Coyote", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Crab = new CreatureType("Crab", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Crocodile = new CreatureType("Crocodile", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ctan = new CreatureType("C’tan", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Custodes = new CreatureType("Custodes", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Cyberman = new CreatureType("Cyberman", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Cyclops = new CreatureType("Cyclops", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Dalek = new CreatureType("Dalek", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Dauthi = new CreatureType("Dauthi", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Demigod = new CreatureType("Demigod", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Demon = new CreatureType("Demon", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Deserter = new CreatureType("Deserter", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Detective = new CreatureType("Detective", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Devil = new CreatureType("Devil", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Dinosaur = new CreatureType("Dinosaur", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Djinn = new CreatureType("Djinn", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Doctor = new CreatureType("Doctor", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Dog = new CreatureType("Dog", [CardType.Creature, CardType.Tribal]);
    static Dragon = new CreatureType("Dragon", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Drake = new CreatureType("Drake", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Dreadnought = new CreatureType("Dreadnought", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Drone = new CreatureType("Drone", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Druid = new CreatureType("Druid", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Dryad = new CreatureType("Dryad", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Dwarf = new CreatureType("Dwarf", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Efreet = new CreatureType("Efreet", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Egg = new CreatureType("Egg", [CardType.Creature, CardType.Tribal]);
    static Elder = new CreatureType("Elder", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Eldrazi = new CreatureType("Eldrazi", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Elemental = new CreatureType("Elemental", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Elephant = new CreatureType("Elephant", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Elf = new CreatureType("Elf", [CardType.Creature, CardType.Tribal]);
    static Elk = new CreatureType("Elk", [CardType.Creature, CardType.Tribal]);
    static Employee = new CreatureType("Employee", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Eye = new CreatureType("Eye", [CardType.Creature, CardType.Tribal]);
    static Faerie = new CreatureType("Faerie", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ferret = new CreatureType("Ferret", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Fish = new CreatureType("Fish", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Flagbearer = new CreatureType("Flagbearer", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Fox = new CreatureType("Fox", [CardType.Creature, CardType.Tribal]);
    static Fractal = new CreatureType("Fractal", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Frog = new CreatureType("Frog", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Fungus = new CreatureType("Fungus", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Gamer = new CreatureType("Gamer", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Gargoyle = new CreatureType("Gargoyle", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Germ = new CreatureType("Germ", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Giant = new CreatureType("Giant", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Gith = new CreatureType("Gith", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Gnoll = new CreatureType("Gnoll", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Gnome = new CreatureType("Gnome", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Goat = new CreatureType("Goat", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Goblin = new CreatureType("Goblin", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static God = new CreatureType("God", [CardType.Creature, CardType.Tribal]);
    static Golem = new CreatureType("Golem", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Gorgon = new CreatureType("Gorgon", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Graveborn = new CreatureType("Graveborn", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Gremlin = new CreatureType("Gremlin", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Griffin = new CreatureType("Griffin", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Guest = new CreatureType("Guest", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Hag = new CreatureType("Hag", [CardType.Creature, CardType.Tribal]);
    static Halfling = new CreatureType("Halfling", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Hamster = new CreatureType("Hamster", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Harpy = new CreatureType("Harpy", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Hellion = new CreatureType("Hellion", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Hippo = new CreatureType("Hippo", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Hippogriff = new CreatureType("Hippogriff", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Homarid = new CreatureType("Homarid", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Homunculus = new CreatureType("Homunculus", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Horror = new CreatureType("Horror", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Horse = new CreatureType("Horse", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Human = new CreatureType("Human", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Hydra = new CreatureType("Hydra", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Hyena = new CreatureType("Hyena", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Illusion = new CreatureType("Illusion", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Imp = new CreatureType("Imp", [CardType.Creature, CardType.Tribal]);
    static Incarnation = new CreatureType("Incarnation", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Inkling = new CreatureType("Inkling", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Inquisitor = new CreatureType("Inquisitor", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Insect = new CreatureType("Insect", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Jackal = new CreatureType("Jackal", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Jellyfish = new CreatureType("Jellyfish", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Juggernaut = new CreatureType("Juggernaut", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Kavu = new CreatureType("Kavu", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Kirin = new CreatureType("Kirin", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Kithkin = new CreatureType("Kithkin", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Knight = new CreatureType("Knight", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Kobold = new CreatureType("Kobold", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Kor = new CreatureType("Kor", [CardType.Creature, CardType.Tribal]);
    static Kraken = new CreatureType("Kraken", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Llama = new CreatureType("Llama", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Lamia = new CreatureType("Lamia", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Lammasu = new CreatureType("Lammasu", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Leech = new CreatureType("Leech", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Leviathan = new CreatureType("Leviathan", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Lhurgoyf = new CreatureType("Lhurgoyf", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Licid = new CreatureType("Licid", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Lizard = new CreatureType("Lizard", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Manticore = new CreatureType("Manticore", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Masticore = new CreatureType("Masticore", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Mercenary = new CreatureType("Mercenary", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Merfolk = new CreatureType("Merfolk", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Metathran = new CreatureType("Metathran", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Minion = new CreatureType("Minion", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Minotaur = new CreatureType("Minotaur", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Mite = new CreatureType("Mite", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Mole = new CreatureType("Mole", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Monger = new CreatureType("Monger", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Mongoose = new CreatureType("Mongoose", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Monk = new CreatureType("Monk", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Monkey = new CreatureType("Monkey", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Moonfolk = new CreatureType("Moonfolk", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Mount = new CreatureType("Mount", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Mouse = new CreatureType("Mouse", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Mutant = new CreatureType("Mutant", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Myr = new CreatureType("Myr", [CardType.Creature, CardType.Tribal]);
    static Mystic = new CreatureType("Mystic", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Naga = new CreatureType("Naga", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Nautilus = new CreatureType("Nautilus", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Necron = new CreatureType("Necron", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Nephilim = new CreatureType("Nephilim", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Nightmare = new CreatureType("Nightmare", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Nightstalker = new CreatureType("Nightstalker", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ninja = new CreatureType("Ninja", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Noble = new CreatureType("Noble", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Noggle = new CreatureType("Noggle", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Nomad = new CreatureType("Nomad", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Nymph = new CreatureType("Nymph", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Octopus = new CreatureType("Octopus", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ogre = new CreatureType("Ogre", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ooze = new CreatureType("Ooze", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Orb = new CreatureType("Orb", [CardType.Creature, CardType.Tribal]);
    static Orc = new CreatureType("Orc", [CardType.Creature, CardType.Tribal]);
    static Orgg = new CreatureType("Orgg", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Otter = new CreatureType("Otter", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ouphe = new CreatureType("Ouphe", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ox = new CreatureType("Ox", [CardType.Creature, CardType.Tribal]);
    static Oyster = new CreatureType("Oyster", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Pangolin = new CreatureType("Pangolin", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Peasant = new CreatureType("Peasant", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Pegasus = new CreatureType("Pegasus", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Pentavite = new CreatureType("Pentavite", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Performer = new CreatureType("Performer", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Pest = new CreatureType("Pest", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Phelddagrif = new CreatureType("Phelddagrif", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Phoenix = new CreatureType("Phoenix", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Phyrexian = new CreatureType("Phyrexian", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Pilot = new CreatureType("Pilot", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Pincher = new CreatureType("Pincher", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Pirate = new CreatureType("Pirate", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Plant = new CreatureType("Plant", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Porcupine = new CreatureType("Porcupine", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Possum = new CreatureType("Possum", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Praetor = new CreatureType("Praetor", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Primarch = new CreatureType("Primarch", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Prism = new CreatureType("Prism", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Processor = new CreatureType("Processor", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Rabbit = new CreatureType("Rabbit", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Raccoon = new CreatureType("Raccoon", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Ranger = new CreatureType("Ranger", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Rat = new CreatureType("Rat", [CardType.Creature, CardType.Tribal]);
    static Rebel = new CreatureType("Rebel", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Reflection = new CreatureType("Reflection", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Rhino = new CreatureType("Rhino", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Rigger = new CreatureType("Rigger", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Robot = new CreatureType("Robot", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Rogue = new CreatureType("Rogue", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Sable = new CreatureType("Sable", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Salamander = new CreatureType("Salamander", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Samurai = new CreatureType("Samurai", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Sand = new CreatureType("Sand", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Saproling = new CreatureType("Saproling", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Satyr = new CreatureType("Satyr", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Scarecrow = new CreatureType("Scarecrow", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Scientist = new CreatureType("Scientist", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Scion = new CreatureType("Scion", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Scorpion = new CreatureType("Scorpion", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Scout = new CreatureType("Scout", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Sculpture = new CreatureType("Sculpture", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Serf = new CreatureType("Serf", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Serpent = new CreatureType("Serpent", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Servo = new CreatureType("Servo", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Shade = new CreatureType("Shade", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Shaman = new CreatureType("Shaman", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Shapeshifter = new CreatureType("Shapeshifter", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Shark = new CreatureType("Shark", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Sheep = new CreatureType("Sheep", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Siren = new CreatureType("Siren", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Skeleton = new CreatureType("Skeleton", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Slith = new CreatureType("Slith", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Sliver = new CreatureType("Sliver", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Sloth = new CreatureType("Sloth", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Slug = new CreatureType("Slug", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Snail = new CreatureType("Snail", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Snake = new CreatureType("Snake", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Soldier = new CreatureType("Soldier", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Soltari = new CreatureType("Soltari", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Spawn = new CreatureType("Spawn", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Specter = new CreatureType("Specter", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Spellshaper = new CreatureType("Spellshaper", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Sphinx = new CreatureType("Sphinx", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Spider = new CreatureType("Spider", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Spike = new CreatureType("Spike", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Spirit = new CreatureType("Spirit", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Splinter = new CreatureType("Splinter", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Sponge = new CreatureType("Sponge", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Squid = new CreatureType("Squid", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Squirrel = new CreatureType("Squirrel", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Starfish = new CreatureType("Starfish", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Surrakar = new CreatureType("Surrakar", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Survivor = new CreatureType("Survivor", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Synth = new CreatureType("Synth", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Tentacle = new CreatureType("Tentacle", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Tetravite = new CreatureType("Tetravite", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Thalakos = new CreatureType("Thalakos", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Thopter = new CreatureType("Thopter", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Thrull = new CreatureType("Thrull", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Tiefling = new CreatureType("Tiefling", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static TimeLord = new CreatureType("Time Lord", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Treefolk = new CreatureType("Treefolk", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Trilobite = new CreatureType("Trilobite", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Triskelavite = new CreatureType("Triskelavite", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Troll = new CreatureType("Troll", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Turtle = new CreatureType("Turtle", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Tyranid = new CreatureType("Tyranid", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Unicorn = new CreatureType("Unicorn", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Vampire = new CreatureType("Vampire", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Varmint = new CreatureType("Varmint", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Vedalken = new CreatureType("Vedalken", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Viashino = new CreatureType("Viashino", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Volver = new CreatureType("Volver", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Wall = new CreatureType("Wall", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Walrus = new CreatureType("Walrus", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Warlock = new CreatureType("Warlock", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Warrior = new CreatureType("Warrior", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Weird = new CreatureType("Weird", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Werewolf = new CreatureType("Werewolf", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Whale = new CreatureType("Whale", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Wizard = new CreatureType("Wizard", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Wolf = new CreatureType("Wolf", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Wolverine = new CreatureType("Wolverine", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Wombat = new CreatureType("Wombat", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Worm = new CreatureType("Worm", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Wraith = new CreatureType("Wraith", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Wurm = new CreatureType("Wurm", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Yeti = new CreatureType("Yeti", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Zombie = new CreatureType("Zombie", [
        CardType.Creature,
        CardType.Tribal,
    ]);
    static Zubera = new CreatureType("Zubera", [
        CardType.Creature,
        CardType.Tribal,
    ]);
}

// 土地タイプ
/** 土地タイプ */
export class LandType extends Subtype {
    static Plains = new LandType("Plains", [CardType.Land]);
    static Island = new LandType("Island", [CardType.Land]);
    static Swamp = new LandType("Swamp", [CardType.Land]);
    static Mountain = new LandType("Mountain", [CardType.Land]);
    static Forest = new LandType("Forest", [CardType.Land]);
    static Urzas = new LandType("Urza's", [CardType.Land]);
    static Mine = new LandType("Mine", [CardType.Land]);
    static PowerPlant = new LandType("Power-Plant", [CardType.Land]);
    static Tower = new LandType("Tower", [CardType.Land]);
    static Lair = new LandType("Lair", [CardType.Land]);
    static Desert = new LandType("Desert", [CardType.Land]);
    static Locus = new LandType("Locus", [CardType.Land]);
    static Gate = new LandType("Gate", [CardType.Land]);
    static Sphere = new LandType("Sphere", [CardType.Land]);
    static Cave = new LandType("Cave", [CardType.Land]);
}
// 呪文タイプ
export class SpellType extends Subtype {
    static Adventure = new SpellType("Adventure", [
        CardType.Instant,
        CardType.Sorcery,
    ]);
    static Arcane = new SpellType("Arcane", [
        CardType.Instant,
        CardType.Sorcery,
    ]);
    static Lesson = new SpellType("Lesson", [
        CardType.Instant,
        CardType.Sorcery,
    ]);
    static Trap = new SpellType("Trap", [CardType.Instant, CardType.Sorcery]);
}
// アーティファクト・タイプ
export class ArtifactType extends Subtype {
    static Attraction = new ArtifactType("Attraction", [CardType.Artifact]);
    static Blood = new ArtifactType("Blood", [CardType.Artifact]);
    static Bobblehead = new ArtifactType("Bobblehead", [CardType.Artifact]);
    static Clue = new ArtifactType("Clue", [CardType.Artifact]);
    static Contraption = new ArtifactType("Contraption", [CardType.Artifact]);
    static Equipment = new ArtifactType("Equipment", [CardType.Artifact]);
    static Food = new ArtifactType("Food", [CardType.Artifact]);
    static Fortification = new ArtifactType("Fortification", [
        CardType.Artifact,
    ]);
    static Gold = new ArtifactType("Gold", [CardType.Artifact]);
    static Incubator = new ArtifactType("Incubator", [CardType.Artifact]);
    static Junk = new ArtifactType("Junk", [CardType.Artifact]);
    static Map = new ArtifactType("Map", [CardType.Artifact]);
    static Powerstone = new ArtifactType("Powerstone", [CardType.Artifact]);
    static Treasure = new ArtifactType("Treasure", [CardType.Artifact]);
    static Vehicle = new ArtifactType("Vehicle", [CardType.Artifact]);
}
// エンチャント・タイプ
export class EnchantmentType extends Subtype {
    static Aura = new EnchantmentType("Aura", [CardType.Enchantment]);
    static Background = new EnchantmentType("Background", [
        CardType.Enchantment,
    ]);
    static Cartouche = new EnchantmentType("Cartouche", [CardType.Enchantment]);
    static Case = new EnchantmentType("Case", [CardType.Enchantment]);
    static Class = new EnchantmentType("Class", [CardType.Enchantment]);
    static Curse = new EnchantmentType("Curse", [CardType.Enchantment]);
    static Role = new EnchantmentType("Role", [CardType.Enchantment]);
    static Rune = new EnchantmentType("Rune", [CardType.Enchantment]);
    static Saga = new EnchantmentType("Saga", [CardType.Enchantment]);
    static Shard = new EnchantmentType("Shard", [CardType.Enchantment]);
    static Shrine = new EnchantmentType("Shrine", [CardType.Enchantment]);
}
// プレインズウォーカー・タイプ
export class PlaneswalkerType extends Subtype {
    static Ajani = new PlaneswalkerType("Ajani", [CardType.Planeswalker]);
    static Aminatou = new PlaneswalkerType("Aminatou", [CardType.Planeswalker]);
    static Angrath = new PlaneswalkerType("Angrath", [CardType.Planeswalker]);
    static Arlinn = new PlaneswalkerType("Arlinn", [CardType.Planeswalker]);
    static Ashiok = new PlaneswalkerType("Ashiok", [CardType.Planeswalker]);
    static Bahamut = new PlaneswalkerType("Bahamut", [CardType.Planeswalker]);
    static Basri = new PlaneswalkerType("Basri", [CardType.Planeswalker]);
    static Bolas = new PlaneswalkerType("Bolas", [CardType.Planeswalker]);
    static Calix = new PlaneswalkerType("Calix", [CardType.Planeswalker]);
    static Chandra = new PlaneswalkerType("Chandra", [CardType.Planeswalker]);
    static Comet = new PlaneswalkerType("Comet", [CardType.Planeswalker]);
    static Dack = new PlaneswalkerType("Dack", [CardType.Planeswalker]);
    static Dakkon = new PlaneswalkerType("Dakkon", [CardType.Planeswalker]);
    static Daretti = new PlaneswalkerType("Daretti", [CardType.Planeswalker]);
    static Davriel = new PlaneswalkerType("Davriel", [CardType.Planeswalker]);
    static Dihada = new PlaneswalkerType("Dihada", [CardType.Planeswalker]);
    static Domri = new PlaneswalkerType("Domri", [CardType.Planeswalker]);
    static Dovin = new PlaneswalkerType("Dovin", [CardType.Planeswalker]);
    static Ellywick = new PlaneswalkerType("Ellywick", [CardType.Planeswalker]);
    static Elminster = new PlaneswalkerType("Elminster", [
        CardType.Planeswalker,
    ]);
    static Elspeth = new PlaneswalkerType("Elspeth", [CardType.Planeswalker]);
    static Estrid = new PlaneswalkerType("Estrid", [CardType.Planeswalker]);
    static Freyalise = new PlaneswalkerType("Freyalise", [
        CardType.Planeswalker,
    ]);
    static Garruk = new PlaneswalkerType("Garruk", [CardType.Planeswalker]);
    static Gideon = new PlaneswalkerType("Gideon", [CardType.Planeswalker]);
    static Grist = new PlaneswalkerType("Grist", [CardType.Planeswalker]);
    static Guff = new PlaneswalkerType("Guff", [CardType.Planeswalker]);
    static Huatli = new PlaneswalkerType("Huatli", [CardType.Planeswalker]);
    static Jace = new PlaneswalkerType("Jace", [CardType.Planeswalker]);
    static Jared = new PlaneswalkerType("Jared", [CardType.Planeswalker]);
    static Jaya = new PlaneswalkerType("Jaya", [CardType.Planeswalker]);
    static Jeska = new PlaneswalkerType("Jeska", [CardType.Planeswalker]);
    static Kaito = new PlaneswalkerType("Kaito", [CardType.Planeswalker]);
    static Karn = new PlaneswalkerType("Karn", [CardType.Planeswalker]);
    static Kasmina = new PlaneswalkerType("Kasmina", [CardType.Planeswalker]);
    static Kaya = new PlaneswalkerType("Kaya", [CardType.Planeswalker]);
    static Kiora = new PlaneswalkerType("Kiora", [CardType.Planeswalker]);
    static Koth = new PlaneswalkerType("Koth", [CardType.Planeswalker]);
    static Liliana = new PlaneswalkerType("Liliana", [CardType.Planeswalker]);
    static Lolth = new PlaneswalkerType("Lolth", [CardType.Planeswalker]);
    static Lukka = new PlaneswalkerType("Lukka", [CardType.Planeswalker]);
    static Minsc = new PlaneswalkerType("Minsc", [CardType.Planeswalker]);
    static Mordenkainen = new PlaneswalkerType("Mordenkainen", [
        CardType.Planeswalker,
    ]);
    static Nahiri = new PlaneswalkerType("Nahiri", [CardType.Planeswalker]);
    static Narset = new PlaneswalkerType("Narset", [CardType.Planeswalker]);
    static Niko = new PlaneswalkerType("Niko", [CardType.Planeswalker]);
    static Nissa = new PlaneswalkerType("Nissa", [CardType.Planeswalker]);
    static Nixilis = new PlaneswalkerType("Nixilis", [CardType.Planeswalker]);
    static Oko = new PlaneswalkerType("Oko", [CardType.Planeswalker]);
    static Quintorius = new PlaneswalkerType("Quintorius", [
        CardType.Planeswalker,
    ]);
    static Ral = new PlaneswalkerType("Ral", [CardType.Planeswalker]);
    static Rowan = new PlaneswalkerType("Rowan", [CardType.Planeswalker]);
    static Saheeli = new PlaneswalkerType("Saheeli", [CardType.Planeswalker]);
    static Samut = new PlaneswalkerType("Samut", [CardType.Planeswalker]);
    static Sarkhan = new PlaneswalkerType("Sarkhan", [CardType.Planeswalker]);
    static Serra = new PlaneswalkerType("Serra", [CardType.Planeswalker]);
    static Sivitri = new PlaneswalkerType("Sivitri", [CardType.Planeswalker]);
    static Sorin = new PlaneswalkerType("Sorin", [CardType.Planeswalker]);
    static Szat = new PlaneswalkerType("Szat", [CardType.Planeswalker]);
    static Tamiyo = new PlaneswalkerType("Tamiyo", [CardType.Planeswalker]);
    static Tasha = new PlaneswalkerType("Tasha", [CardType.Planeswalker]);
    static Teferi = new PlaneswalkerType("Teferi", [CardType.Planeswalker]);
    static Teyo = new PlaneswalkerType("Teyo", [CardType.Planeswalker]);
    static Tezzeret = new PlaneswalkerType("Tezzeret", [CardType.Planeswalker]);
    static Tibalt = new PlaneswalkerType("Tibalt", [CardType.Planeswalker]);
    static Tyvar = new PlaneswalkerType("Tyvar", [CardType.Planeswalker]);
    static Ugin = new PlaneswalkerType("Ugin", [CardType.Planeswalker]);
    static Urza = new PlaneswalkerType("Urza", [CardType.Planeswalker]);
    static Venser = new PlaneswalkerType("Venser", [CardType.Planeswalker]);
    static Vivien = new PlaneswalkerType("Vivien", [CardType.Planeswalker]);
    static Vraska = new PlaneswalkerType("Vraska", [CardType.Planeswalker]);
    static Vronos = new PlaneswalkerType("Vronos", [CardType.Planeswalker]);
    static Will = new PlaneswalkerType("Will", [CardType.Planeswalker]);
    static Windgrace = new PlaneswalkerType("Windgrace", [
        CardType.Planeswalker,
    ]);
    static Wrenn = new PlaneswalkerType("Wrenn", [CardType.Planeswalker]);
    static Xenagos = new PlaneswalkerType("Xenagos", [CardType.Planeswalker]);
    static Yanggu = new PlaneswalkerType("Yanggu", [CardType.Planeswalker]);
    static Yanling = new PlaneswalkerType("Yanling", [CardType.Planeswalker]);
    static Zariel = new PlaneswalkerType("Zariel", [CardType.Planeswalker]);
}

// バトル・タイプ
export class BattleType extends Subtype {
    static Siege = new BattleType("Siege", [CardType.Battle]);
}
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
