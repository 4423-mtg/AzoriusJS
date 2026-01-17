/** タイムスタンプ */
export type Timestamp = {
    id: TimestampId;
};

let _timestampid: number = -1;

export function createTimestamp(): Timestamp {
    return { id: ++_timestampid };
}

export function isTimestamp(arg: unknown): arg is Timestamp {
    return (
        typeof arg === "object" &&
        arg !== null &&
        "id" in arg &&
        isTimestampId(arg.id)
    );
}

/** `timestamp1` が `timestamp2` よりも前なら負の値、同じなら `0` 、後なら正の値。 */
export function compareTimestamp(
    timestamp1: Timestamp,
    timestamp2: Timestamp,
): number {
    return compareTimestampId(timestamp1.id, timestamp2.id);
}

// ================================================================================
export type TimestampId = number;
export function isTimestampId(arg: unknown): arg is TimestampId {
    return typeof arg === "number";
}
export function compareTimestampId(id1: TimestampId, id2: TimestampId): number {
    return id1 - id2;
}
