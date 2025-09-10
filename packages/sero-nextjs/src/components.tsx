'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useSeroNavigate } from './hooks';
import type { SeroNextLinkProps } from './types';

/**
 * Next.js Link component that triggers route transitions
 */
export const SeroNextLink: React.FC<SeroNextLinkProps> = ({
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
  const { navigate } = useSeroNavigate();

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
          console.error('Navigation failed:', error);
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
};

/**
 * Higher-order component to wrap existing Next.js Link components with transition support
 */
export const withSeroTransition = <P extends object>(
  LinkComponent: React.ComponentType<P & { href: string; onClick?: (event: React.MouseEvent) => void }>
) => {
  return React.forwardRef<any, P & { href: string; transitionOptions?: any }>(
    ({ transitionOptions = {}, href, ...props }, ref) => {
      const { navigate } = useSeroNavigate();

      const handleClick = useCallback(
        async (event: React.MouseEvent) => {
          if (!event.defaultPrevented) {
            event.preventDefault();
            try {
              await navigate(href, transitionOptions);
            } catch (error) {
              console.error('Navigation failed:', error);
              window.location.href = href;
            }
          }
        },
        [href, navigate, transitionOptions]
      );

      return (
        <LinkComponent
          {...(props as P)}
          href={href}
          ref={ref}
          onClick={handleClick}
        />
      );
    }
  );
};

/**
 * Wrapper component for pages that need transition support
 */
export const SeroPageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};
