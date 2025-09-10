export declare function withDelay<T>(fn: () => T | Promise<T>, ms?: number): Promise<T>;
/** Ensures fn settles within timeoutMs; if it doesn't, resolve anyway. */
export declare function withTimeout<T>(fn: () => Promise<T>, timeoutMs?: number): Promise<T | void>;
