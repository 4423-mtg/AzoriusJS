export type Supertype = (typeof supertypes)[number];
const supertypes = ["basic", "legendary", "ongoing", "snow", "world"] as const;
