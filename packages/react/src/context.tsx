import React, { createContext, useContext, useEffect, useRef } from 'react';
import { sero } from 'sero-core';
import type { SeroContextValue, SeroProviderProps } from './types';

const SeroContext = createContext<SeroContextValue | null>(null);

export const SeroProvider: React.FC<SeroProviderProps> = ({ children, options }) => {
  const configuredRef = useRef(false);

  useEffect(() => {
    if (options && !configuredRef.current) {
      sero.configure(options);
      configuredRef.current = true;
    }
  }, [options]);

  const contextValue: SeroContextValue = {
    beginTransition: sero.beginTransition.bind(sero),
    subscribe: sero.subscribe.bind(sero),
    getState: sero.getState.bind(sero),
    setPaths: sero.setPaths.bind(sero),
    notifyExternalNavigation: sero.notifyExternalNavigation.bind(sero),
  };

  return (
    <SeroContext.Provider value={contextValue}>
      {children}
    </SeroContext.Provider>
  );
};

export const useSero = (): SeroContextValue => {
  const context = useContext(SeroContext);
  if (!context) {
    throw new Error('useSero must be used within a SeroProvider');
  }
  return context;
};
