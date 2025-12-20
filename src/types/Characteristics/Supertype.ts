export type Supertype = (typeof supertypes)[number];
const supertypes = ["Basic", "Legendary", "Ongoing", "Snow", "World"] as const;
