export function isUUID(obj: unknown): boolean {
    return (
        typeof obj === "string" &&
        new RegExp(/^[^-]+-[^-]+-[^-]+-[^-]+-[^-]+$/g).test(obj)
    );
}

export function isNonNullObject(arg: unknown): arg is object {
    if (typeof arg === "object" && arg !== null) {
        return true;
    } else {
        return false;
    }
}
