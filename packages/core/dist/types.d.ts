export type Phase = 'idle' | 'exiting' | 'navigating' | 'entering';
export type TransitionContext = {
    phase: Phase;
    prevPath: string | null;
    nextPath: string | null;
    data?: Record<string, unknown>;
};
export type BeginOptions = {
    delayMs?: number;
    viewTransition?: boolean;
    blockIf?: () => boolean;
    timeoutMs?: number;
    onBeforeNavigate?: () => void | Promise<void>;
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
//# sourceMappingURL=types.d.ts.map