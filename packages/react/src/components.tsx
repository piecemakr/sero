import React, { useCallback } from 'react';
import { useNavigate } from './hooks';
import type { SeroLinkProps } from './types';

/**
 * Link component that triggers route transitions
 */
export const SeroLink: React.FC<SeroLinkProps> = ({
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
          console.error('Navigation failed:', error);
          // Fallback to regular navigation
          window.location.href = href;
        }
      }
    },
    [href, onClick, navigate, options, replace, scroll, shallow]
  );

  // Handle prefetching
  React.useEffect(() => {
    if (prefetch && typeof window !== 'undefined') {
      // Simple prefetch implementation - could be enhanced
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [href, prefetch]);

  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

/**
 * Higher-order component to wrap existing Link components with transition support
 */
export const withSeroTransition = <P extends object>(
  LinkComponent: React.ComponentType<P & { href: string; onClick?: (event: React.MouseEvent) => void }>
) => {
  return React.forwardRef<any, P & { href: string; transitionOptions?: any }>(
    ({ transitionOptions = {}, href, ...props }, ref) => {
      const { navigate } = useNavigate();

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
