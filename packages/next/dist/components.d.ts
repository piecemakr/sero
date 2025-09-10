import React from 'react';
import type { SeroNextLinkProps } from './types';
/**
 * Next.js Link component that triggers route transitions
 */
export declare const SeroNextLink: React.FC<SeroNextLinkProps>;
/**
 * Higher-order component to wrap existing Next.js Link components with transition support
 */
export declare const withSeroTransition: <P extends {
    href: string;
    onClick?: (event: React.MouseEvent) => void;
}>(LinkComponent: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    transitionOptions?: import("@sero/core").BeginOptions;
}> & React.RefAttributes<HTMLElement>>;
//# sourceMappingURL=components.d.ts.map