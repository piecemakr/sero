import React from 'react';
import type { SeroLinkProps } from './types';
/**
 * Link component that triggers route transitions
 */
export declare const SeroLink: React.FC<SeroLinkProps>;
/**
 * Higher-order component to wrap existing Link components with transition support
 */
export declare const withSeroTransition: <P extends object>(LinkComponent: React.ComponentType<P & {
    href: string;
    onClick?: (event: React.MouseEvent) => void;
}>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    href: string;
    transitionOptions?: any;
}> & React.RefAttributes<any>>;
