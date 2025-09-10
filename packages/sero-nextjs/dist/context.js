'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { sero } from 'sero-core';
const SeroNextContext = createContext(null);
export const SeroNextProvider = ({ children, options }) => {
    const configuredRef = useRef(false);
    const pathname = usePathname();
    useEffect(() => {
        if (options && !configuredRef.current) {
            sero.configure(options);
            configuredRef.current = true;
        }
    }, [options]);
    // Sync pathname changes with the coordinator
    useEffect(() => {
        sero.setPaths(null, pathname);
        sero.notifyExternalNavigation();
    }, [pathname]);
    const contextValue = {
        beginTransition: sero.beginTransition.bind(sero),
        subscribe: sero.subscribe.bind(sero),
        getState: sero.getState.bind(sero),
        setPaths: sero.setPaths.bind(sero),
        notifyExternalNavigation: sero.notifyExternalNavigation.bind(sero),
    };
    return (_jsx(SeroNextContext.Provider, { value: contextValue, children: children }));
};
export const useSeroNext = () => {
    const context = useContext(SeroNextContext);
    if (!context) {
        throw new Error('useSeroNext must be used within a SeroNextProvider');
    }
    return context;
};
//# sourceMappingURL=context.js.map