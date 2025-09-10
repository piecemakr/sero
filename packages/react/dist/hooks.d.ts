import type { BeginOptions } from '@sero/core';
import type { UseTransitionOptions } from './types';
export declare const useTransition: (options?: UseTransitionOptions) => void;
export declare const useTransitionState: () => Readonly<{
    phase: string;
    prevPath: string | null;
    nextPath: string | null;
}>;
export declare const useNavigate: () => {
    navigate: (href: string, options?: BeginOptions & {
        replace?: boolean;
        scroll?: boolean;
        shallow?: boolean;
    }) => Promise<void>;
};
//# sourceMappingURL=hooks.d.ts.map