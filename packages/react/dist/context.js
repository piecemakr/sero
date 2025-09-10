import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useRef, useMemo } from 'react';
import { sero } from '@piecemakr/sero-core';
const SeroContext = createContext(null);
export const SeroProvider = ({ children, options }) => {
    const configuredRef = useRef(false);
    useEffect(() => {
        if (options && !configuredRef.current) {
            sero.configure(options);
            configuredRef.current = true;
        }
    }, [options]);
    const contextValue = useMemo(() => ({
        beginTransition: sero.beginTransition.bind(sero),
        subscribe: sero.subscribe.bind(sero),
        getState: sero.getState.bind(sero),
        setPaths: sero.setPaths.bind(sero),
        notifyExternalNavigation: sero.notifyExternalNavigation.bind(sero),
    }), []);
    return (_jsx(SeroContext.Provider, { value: contextValue, children: children }));
};
export const useSero = () => {
    const context = useContext(SeroContext);
    if (!context) {
        throw new Error('useSero must be used within a SeroProvider. ' +
            'Make sure to wrap your app with <SeroProvider> in your root component.');
    }
    return context;
};
