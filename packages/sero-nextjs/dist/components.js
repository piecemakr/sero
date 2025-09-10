'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import Link from 'next/link';
import { useSeroNavigate } from './hooks';
/**
 * Next.js Link component that triggers route transitions
 */
export const SeroNextLink = ({ href, children, className, style, onClick, options = {}, replace = false, scroll = true, shallow = false, prefetch = false, ...props }) => {
    const { navigate } = useSeroNavigate();
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
                console.error('Navigation failed:', error);
                // Fallback to regular navigation
                window.location.href = href;
            }
        }
    }, [href, onClick, navigate, options, replace, scroll, shallow]);
    // Handle prefetching using Next.js Link
    const linkProps = prefetch ? { prefetch: true } : {};
    return (_jsx(Link, { href: href, className: className, style: style, onClick: handleClick, replace: replace, scroll: scroll, shallow: shallow, ...linkProps, ...props, children: children }));
};
/**
 * Higher-order component to wrap existing Next.js Link components with transition support
 */
export const withSeroTransition = (LinkComponent) => {
    return React.forwardRef(({ transitionOptions = {}, href, ...props }, ref) => {
        const { navigate } = useSeroNavigate();
        const handleClick = useCallback(async (event) => {
            if (!event.defaultPrevented) {
                event.preventDefault();
                try {
                    await navigate(href, transitionOptions);
                }
                catch (error) {
                    console.error('Navigation failed:', error);
                    window.location.href = href;
                }
            }
        }, [href, navigate, transitionOptions]);
        return (_jsx(LinkComponent, { ...props, href: href, ref: ref, onClick: handleClick }));
    });
};
/**
 * Wrapper component for pages that need transition support
 */
export const SeroPageWrapper = ({ children, className, style }) => {
    return (_jsx("div", { className: className, style: style, children: children }));
};
//# sourceMappingURL=components.js.map