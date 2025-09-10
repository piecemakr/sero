export type Phase = 'idle' | 'exiting' | 'navigating' | 'entering';
export type TransitionContext = {
    /** Current phase at callback time */
    phase: Phase;
    /** Previous pathname (may be null for first load) */
    prevPath: string | null;
    /** Next pathname (target of navigation) */
    nextPath: string | null;
    /** Arbitrary bag for adapters to pass data (e.g., VT result) */
    data?: Record<string, unknown>;
};
export type BeginOptions = {
    /** Delay before navigate (time for exit animations) */
    delayMs?: number;
    /** Force View Transitions if available (adapter controlled) */
    viewTransition?: boolean;
    /** Abort navigation if returns true */
    blockIf?: () => boolean;
    /** Safety timeout after which we navigate anyway */
    timeoutMs?: number;
    /** Called immediately before navigate */
    onBeforeNavigate?: () => void | Promise<void>;
    /** Called immediately after navigate */
    onAfterNavigate?: () => void | Promise<void>;
};
export type ConfigureOptions = {
    delayMs?: number;
    viewTransitions?: boolean;
    respectReducedMotion?: boolean;
    timeoutMs?: number;
};
export type Subscriber = (ctx: TransitionContext) => void | Promise<void>;
export type NavigateFn = () => void | Promise<void>;
export declare class SeroError extends Error {
    code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class NavigationError extends SeroError {
    originalError?: Error | undefined;
    constructor(message: string, originalError?: Error | undefined);
}
export declare class TransitionError extends SeroError {
    originalError?: Error | undefined;
    constructor(message: string, originalError?: Error | undefined);
}
