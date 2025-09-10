import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { useNavigate } from './hooks';
import { NavigationError } from '@sero/core';
export const SeroLink = React.memo(({ href, children, className, style, onClick, options = {}, replace = false, scroll = true, shallow = false, prefetch = false, ...props }) => {
    const { navigate } = useNavigate();
    const handleClick = useCallback(async (event) => {
        onClick?.(event);
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
                window.location.href = href;
            }
        }
    }, [href, onClick, navigate, options, replace, scroll, shallow]);
    React.useEffect(() => {
        if (prefetch && typeof window !== 'undefined') {
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
//# sourceMappingURL=components.js.map