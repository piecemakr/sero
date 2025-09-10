// Context and Provider
export { SeroProvider, useSero } from './context';

// Hooks
export { useTransition, useTransitionState, useNavigate } from './hooks';

// Components
export { SeroLink, withSeroTransition } from './components';

// Types
export type {
  SeroProviderProps,
  SeroLinkProps,
  UseTransitionOptions,
  SeroContextValue,
} from './types';

// Re-export core types for convenience
export type {
  Phase,
  TransitionContext,
  BeginOptions,
  ConfigureOptions,
  Subscriber,
  NavigateFn,
} from '@sero/core';
