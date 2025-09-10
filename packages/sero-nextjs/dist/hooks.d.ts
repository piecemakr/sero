import type { BeginOptions } from 'sero-core';
import type { UseSeroNextOptions } from './types';
/**
 * Hook to subscribe to route transition phases
 */
export declare const useSeroTransition: (options?: UseSeroNextOptions) => void;
/**
 * Hook to get current transition state
 */
export declare const useSeroState: () => Readonly<{
    phase: string;
    prevPath: string | null;
    nextPath: string | null;
}>;
/**
 * Hook for programmatic navigation with transitions using Next.js router
 */
export declare const useSeroNavigate: () => {
    navigate: (href: string, options?: BeginOptions & {
        replace?: boolean;
        scroll?: boolean;
        shallow?: boolean;
    }) => Promise<void>;
};
//# sourceMappingURL=hooks.d.ts.map