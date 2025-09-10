import React from 'react';
import type { SeroLinkProps } from './types';
export declare const SeroLink: React.FC<SeroLinkProps>;
export declare const withSeroTransition: <P extends {
    href: string;
    onClick?: (event: React.MouseEvent) => void;
}>(LinkComponent: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    transitionOptions?: import("@sero/core").BeginOptions;
}> & React.RefAttributes<HTMLElement>>;
//# sourceMappingURL=components.d.ts.map