'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useNavigate } from './hooks';
import type { SeroNextLinkProps } from './types';
import { NavigationError } from '@piecemakr/sero-core';

/**
 * Next.js Link component that triggers route transitions
 */
export const SeroNextLink: React.FC<SeroNextLinkProps> = React.memo(({
  href,
  children,
  className,
  style,
  onClick,
  options = {},
  replace = false,
  scroll = true,
  shallow = false,
  prefetch = false,
  ...props
}) => {
  const { navigate } = useNavigate();

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Call user's onClick handler first
      onClick?.(event);

      // Prevent default navigation if not prevented by user
      if (!event.defaultPrevented) {
        event.preventDefault();

        try {
          await navigate(href, {
            ...options,
            replace,
            scroll,
            shallow,
          });
        } catch (error) {
          const navError = error instanceof NavigationError 
            ? error 
            : new NavigationError('Navigation failed', error instanceof Error ? error : undefined);
          console.error('Navigation failed:', navError);
          // Fallback to regular navigation
          window.location.href = href;
        }
      }
    },
    [href, onClick, navigate, options, replace, scroll, shallow]
  );

  // Handle prefetching using Next.js Link
  const linkProps = prefetch ? { prefetch: true } : {};

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={handleClick}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      {...linkProps}
      {...props}
    >
      {children}
    </Link>
  );
});

/**
 * Higher-order component to wrap existing Next.js Link components with transition support
 */
export const withSeroTransition = <P extends { href: string; onClick?: (event: React.MouseEvent) => void }>(
  LinkComponent: React.ComponentType<P>
) => {
  return React.forwardRef<HTMLElement, P & { transitionOptions?: import('@piecemakr/sero-core').BeginOptions }>(
    ({ transitionOptions = {}, href, ...props }, ref) => {
      const { navigate } = useNavigate();

      const handleClick = useCallback(
        async (event: React.MouseEvent) => {
          if (!event.defaultPrevented) {
            event.preventDefault();
            try {
              await navigate(href, transitionOptions);
            } catch (error) {
              const navError = error instanceof NavigationError 
                ? error 
                : new NavigationError('Navigation failed', error instanceof Error ? error : undefined);
              console.error('Navigation failed:', navError);
              window.location.href = href;
            }
          }
        },
        [href, navigate, transitionOptions]
      );

      return (
        <LinkComponent
          {...(props as unknown as P)}
          href={href}
          ref={ref}
          onClick={handleClick}
        />
      );
    }
  );
};

