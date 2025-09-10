import React from 'react';
import type { SeroNextLinkProps } from './types';
/**
 * Next.js Link component that triggers route transitions
 */
export declare const SeroNextLink: React.FC<SeroNextLinkProps>;
/**
 * Higher-order component to wrap existing Next.js Link components with transition support
 */
export declare const withSeroTransition: <P extends object>(LinkComponent: React.ComponentType<P & {
    href: string;
    onClick?: (event: React.MouseEvent) => void;
}>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    href: string;
    transitionOptions?: any;
}> & React.RefAttributes<any>>;
/**
 * Wrapper component for pages that need transition support
 */
export declare const SeroPageWrapper: React.FC<{
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}>;
//# sourceMappingURL=components.d.ts.map