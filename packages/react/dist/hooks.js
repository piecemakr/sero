import { useEffect, useRef } from 'react';
import { useSero } from './context';
export const useTransition = (options = {}) => {
    const { subscribe } = useSero();
    const optionsRef = useRef(options);
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);
    useEffect(() => {
        const unsubscribe = subscribe((context) => {
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
        return () => {
            unsubscribe();
        };
    }, [subscribe]);
};
export const useTransitionState = () => {
    const { getState } = useSero();
    return getState();
};
export const useNavigate = () => {
    const { beginTransition, setPaths } = useSero();
    const navigate = (href, options = {}) => {
        const { replace = false, scroll = true, shallow = false, ...transitionOptions } = options;
        setPaths(window.location.pathname, href);
        const navigateFn = () => {
            if (replace) {
                window.history.replaceState(null, '', href);
            }
            else {
                window.history.pushState(null, '', href);
            }
            if (typeof window !== 'undefined' && window.next?.router) {
                const router = window.next.router;
                if (replace) {
                    router.replace(href, undefined, { scroll, shallow });
                }
                else {
                    router.push(href, undefined, { scroll, shallow });
                }
            }
            else {
                window.location.href = href;
            }
        };
        return beginTransition(navigateFn, transitionOptions);
    };
    return { navigate };
};
//# sourceMappingURL=hooks.js.map