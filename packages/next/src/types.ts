import type { ReactNode } from 'react';
import type { ConfigureOptions, BeginOptions, TransitionContext } from '@piecemakr/sero-core';

export interface SeroNextProviderProps {
  children: ReactNode;
  options?: ConfigureOptions;
}

export interface SeroNextLinkProps {
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

export interface UseTransitionOptions {
  onEntering?: (context: TransitionContext) => void | Promise<void>;
  onExiting?: (context: TransitionContext) => void | Promise<void>;
  onNavigating?: (context: TransitionContext) => void | Promise<void>;
}

export interface SeroNextContextValue {
  beginTransition: (navigate: () => void | Promise<void>, options?: BeginOptions) => Promise<void>;
  subscribe: (callback: (context: TransitionContext) => void | Promise<void>) => () => void;
  getState: () => Readonly<{ phase: string; prevPath: string | null; nextPath: string | null }>;
  setPaths: (prev: string | null, next: string | null) => void;
  notifyExternalNavigation: () => Promise<void>;
}

// Re-export core types for convenience
export type {
  Phase,
  TransitionContext,
  BeginOptions,
  ConfigureOptions,
  Subscriber,
  NavigateFn,
} from '@sero/core';
