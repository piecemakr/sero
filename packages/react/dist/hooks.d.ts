import type { BeginOptions } from '@piecemakr/sero-core';
import type { UseTransitionOptions } from './types';
/**
 * Hook to subscribe to route transition phases
 */
export declare const useTransition: (options?: UseTransitionOptions) => void;
/**
 * Hook to get current transition state
 */
export declare const useTransitionState: () => Readonly<{
    phase: string;
    prevPath: string | null;
    nextPath: string | null;
}>;
/**
 * Hook for programmatic navigation with transitions
 */
export declare const useNavigate: () => {
    navigate: (href: string, options?: BeginOptions & {
        replace?: boolean;
        scroll?: boolean;
        shallow?: boolean;
    }) => Promise<void>;
};
