'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSeroNext } from './context';
import type { TransitionContext, BeginOptions } from 'sero-core';
import type { UseSeroNextOptions } from './types';

/**
 * Hook to subscribe to route transition phases
 */
export const useSeroTransition = (options: UseSeroNextOptions = {}) => {
  const { subscribe } = useSeroNext();
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
export const useSeroState = () => {
  const { getState } = useSeroNext();
  return getState();
};

/**
 * Hook for programmatic navigation with transitions using Next.js router
 */
export const useSeroNavigate = () => {
  const { beginTransition, setPaths } = useSeroNext();
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback((
    href: string,
    options: BeginOptions & {
      replace?: boolean;
      scroll?: boolean;
      shallow?: boolean;
    } = {}
  ) => {
    const { replace = false, scroll = true, shallow = false, ...transitionOptions } = options;

    // Set paths for the transition
    setPaths(pathname, href);

    // Create navigation function using Next.js router
    const navigateFn = () => {
      if (replace) {
        router.replace(href, { scroll });
      } else {
        router.push(href, { scroll });
      }
    };

    return beginTransition(navigateFn, transitionOptions);
  }, [beginTransition, setPaths, router, pathname]);

  return { navigate };
};
