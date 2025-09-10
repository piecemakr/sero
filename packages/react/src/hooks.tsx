import { useEffect, useRef } from 'react';
import { useSero } from './context';
import type { TransitionContext, BeginOptions } from 'sero-core';
import type { UseRouteTransitionOptions } from './types';

/**
 * Hook to subscribe to route transition phases
 */
export const useRouteTransition = (options: UseRouteTransitionOptions = {}) => {
  const { subscribe } = useSero();
  const optionsRef = useRef(options);

  // Update options ref when they change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const unsubscribe = subscribe((context: TransitionContext) => {
      const { onEntering, onExiting, onNavigating } = optionsRef.current;

      switch (context.phase) {
        case 'exiting':
          onExiting?.(context);
          break;
        case 'navigating':
          onNavigating?.(context);
          break;
        case 'entering':
          onEntering?.(context);
          break;
      }
    });

    return unsubscribe;
  }, [subscribe]);
};

/**
 * Hook to get current transition state
 */
export const useTransitionState = () => {
  const { getState } = useSero();
  return getState();
};

/**
 * Hook for programmatic navigation with transitions
 */
export const useNavigate = () => {
  const { beginTransition, setPaths } = useSero();

  const navigate = (
    href: string,
    options: BeginOptions & {
      replace?: boolean;
      scroll?: boolean;
      shallow?: boolean;
    } = {}
  ) => {
    const { replace = false, scroll = true, shallow = false, ...transitionOptions } = options;

    // Set paths for the transition
    setPaths(window.location.pathname, href);

    // Create navigation function
    const navigateFn = () => {
      if (replace) {
        window.history.replaceState(null, '', href);
      } else {
        window.history.pushState(null, '', href);
      }

      // Trigger Next.js router if available
      if (typeof window !== 'undefined' && (window as any).next?.router) {
        const router = (window as any).next.router;
        if (replace) {
          router.replace(href, undefined, { scroll, shallow });
        } else {
          router.push(href, undefined, { scroll, shallow });
        }
      } else {
        // Fallback for non-Next.js apps
        window.location.href = href;
      }
    };

    return beginTransition(navigateFn, transitionOptions);
  };

  return { navigate };
};
