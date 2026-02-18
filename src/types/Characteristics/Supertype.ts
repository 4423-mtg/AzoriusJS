export type Supertype = (typeof supertypes)[number];
const supertypes = ["Basic", "Legendary", "Ongoing", "Snow", "World"] as const;

export function isSupertype(arg: unknown): arg is Supertype {
    return false;
}
