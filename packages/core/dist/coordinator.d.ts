import type { Phase, BeginOptions, ConfigureOptions, Subscriber, NavigateFn } from './types.js';
export declare class SeroCoordinator {
    private phase;
    private prevPath;
    private nextPath;
    private subs;
    private config;
    configure(opts?: ConfigureOptions): void;
    getState(): Readonly<{
        phase: Phase;
        prevPath: string | null;
        nextPath: string | null;
    }>;
    subscribe(fn: Subscriber): () => void;
    /** For adapters (e.g., React) to keep paths in sync on route changes */
    setPaths(prev: string | null, next: string | null): void;
    private emit;
    /**
     * Orchestrate exit -> (optional delay) -> navigate (optional VT) -> enter
     * The adapter supplies the real navigation function.
     */
    beginTransition(navigate: NavigateFn, opts?: BeginOptions): Promise<void>;
    /** To be called by adapters when navigation happens outside our control (back/forward) */
    notifyExternalNavigation(): Promise<void>;
}
/** Singleton for simple integration; adapters can also create their own instance */
export declare const sero: SeroCoordinator;
