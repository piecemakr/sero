'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { sero } from 'sero-core';
import type { SeroNextContextValue, SeroNextProviderProps } from './types';

const SeroNextContext = createContext<SeroNextContextValue | null>(null);

export const SeroNextProvider: React.FC<SeroNextProviderProps> = ({ children, options }) => {
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

  const contextValue: SeroNextContextValue = {
    beginTransition: sero.beginTransition.bind(sero),
    subscribe: sero.subscribe.bind(sero),
    getState: sero.getState.bind(sero),
    setPaths: sero.setPaths.bind(sero),
    notifyExternalNavigation: sero.notifyExternalNavigation.bind(sero),
  };

  return (
    <SeroNextContext.Provider value={contextValue}>
      {children}
    </SeroNextContext.Provider>
  );
};

export const useSeroNext = (): SeroNextContextValue => {
  const context = useContext(SeroNextContext);
  if (!context) {
    throw new Error('useSeroNext must be used within a SeroNextProvider');
  }
  return context;
};
