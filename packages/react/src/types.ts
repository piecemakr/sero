import type { ReactNode } from 'react';
import type { ConfigureOptions, BeginOptions, TransitionContext } from 'sero-core';

export interface SeroProviderProps {
  children: ReactNode;
  options?: ConfigureOptions;
}

export interface SeroLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  options?: BeginOptions;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  prefetch?: boolean;
}

export interface UseRouteTransitionOptions {
  onEntering?: (context: TransitionContext) => void | Promise<void>;
  onExiting?: (context: TransitionContext) => void | Promise<void>;
  onNavigating?: (context: TransitionContext) => void | Promise<void>;
}

export interface SeroContextValue {
  beginTransition: (navigate: () => void | Promise<void>, options?: BeginOptions) => Promise<void>;
  subscribe: (callback: (context: TransitionContext) => void | Promise<void>) => () => void;
  getState: () => Readonly<{ phase: string; prevPath: string | null; nextPath: string | null }>;
  setPaths: (prev: string | null, next: string | null) => void;
  notifyExternalNavigation: () => Promise<void>;
}
