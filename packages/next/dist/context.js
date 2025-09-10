'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { sero } from '@sero/core';
const SeroNextContext = createContext(null);
export const SeroNextProvider = ({ children, options }) => {
    const configuredRef = useRef(false);
    const pathname = usePathname();
    useEffect(() => {
        if (options && !configuredRef.current) {
            sero.configure(options);
            configuredRef.current = true;
        }
        // Development warnings
        if (typeof window !== 'undefined') {
            // Check if Next.js router is available
            if (!pathname) {
                console.warn('Sero: usePathname returned null. Make sure you\'re using Next.js App Router and this component is rendered on the client side.');
            }
            // Warn about View Transitions support (only once)
            if (options?.viewTransitions !== false && !('startViewTransition' in document) && !configuredRef.current) {
                console.info('Sero: View Transitions API is not supported in this browser. Transitions will work but without the native API.');
            }
        }
    }, [options, pathname]);
    // Sync pathname changes with the coordinator
    useEffect(() => {
        sero.setPaths(null, pathname);
        sero.notifyExternalNavigation();
    }, [pathname]);
    const contextValue = useMemo(() => ({
        beginTransition: sero.beginTransition.bind(sero),
        subscribe: sero.subscribe.bind(sero),
        getState: sero.getState.bind(sero),
        setPaths: sero.setPaths.bind(sero),
        notifyExternalNavigation: sero.notifyExternalNavigation.bind(sero),
    }), []);
    return (_jsx(SeroNextContext.Provider, { value: contextValue, children: children }));
};
export const useSeroNext = () => {
    const context = useContext(SeroNextContext);
    if (!context) {
        throw new Error('useSeroNext must be used within a SeroNextProvider. ' +
            'Make sure to wrap your app with <SeroNextProvider> in your layout.tsx or _app.tsx file.');
    }
    return context;
};
//# sourceMappingURL=context.js.map