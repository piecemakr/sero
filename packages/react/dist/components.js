import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { useNavigate } from './hooks';
import { NavigationError } from '@sero/core';
/**
 * Link component that triggers route transitions
 */
export const SeroLink = React.memo(({ href, children, className, style, onClick, options = {}, replace = false, scroll = true, shallow = false, prefetch = false, ...props }) => {
    const { navigate } = useNavigate();
    const handleClick = useCallback(async (event) => {
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
            }
            catch (error) {
                const navError = error instanceof NavigationError
                    ? error
                    : new NavigationError('Navigation failed', error instanceof Error ? error : undefined);
                console.error('Navigation failed:', navError);
                // Fallback to regular navigation
                window.location.href = href;
            }
        }
    }, [href, onClick, navigate, options, replace, scroll, shallow]);
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
    return (_jsx("a", { href: href, className: className, style: style, onClick: handleClick, ...props, children: children }));
});
/**
 * Higher-order component to wrap existing Link components with transition support
 */
export const withSeroTransition = (LinkComponent) => {
    return React.forwardRef(({ transitionOptions = {}, href, ...props }, ref) => {
        const { navigate } = useNavigate();
        const handleClick = useCallback(async (event) => {
            if (!event.defaultPrevented) {
                event.preventDefault();
                try {
                    await navigate(href, transitionOptions);
                }
                catch (error) {
                    const navError = error instanceof NavigationError
                        ? error
                        : new NavigationError('Navigation failed', error instanceof Error ? error : undefined);
                    console.error('Navigation failed:', navError);
                    window.location.href = href;
                }
            }
        }, [href, navigate, transitionOptions]);
        return (_jsx(LinkComponent, { ...props, href: href, ref: ref, onClick: handleClick }));
    });
};
