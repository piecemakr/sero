import React from 'react';
import type { SeroLinkProps } from './types';
/**
 * Link component that triggers route transitions
 */
export declare const SeroLink: React.FC<SeroLinkProps>;
/**
 * Higher-order component to wrap existing Link components with transition support
 */
export declare const withSeroTransition: <P extends {
    href: string;
    onClick?: (event: React.MouseEvent) => void;
}>(LinkComponent: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    transitionOptions?: import("@piecemakr/sero-core").BeginOptions;
}> & React.RefAttributes<HTMLElement>>;
