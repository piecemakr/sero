import type { Phase, BeginOptions, ConfigureOptions, Subscriber, NavigateFn } from './types';
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
    setPaths(prev: string | null, next: string | null): void;
    private emit;
    beginTransition(navigate: NavigateFn, opts?: BeginOptions): Promise<void>;
    notifyExternalNavigation(): Promise<void>;
}
export declare const sero: SeroCoordinator;
//# sourceMappingURL=coordinator.d.ts.map