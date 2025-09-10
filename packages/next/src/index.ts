// Context and Provider
export { SeroNextProvider, useSeroNext } from './context';

// Hooks
export { useTransition, useTransitionState, useNavigate } from './hooks';

// Components
export { SeroNextLink, withSeroTransition } from './components';

// Types
export type {
  SeroNextProviderProps,
  SeroNextLinkProps,
  UseTransitionOptions,
  SeroNextContextValue,
} from './types';

// Re-export core types for convenience
export type {
  Phase,
  TransitionContext,
  BeginOptions,
  ConfigureOptions,
  Subscriber,
  NavigateFn,
} from '@piecemakr/sero-core';
