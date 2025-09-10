// Example usage of Sero Next.js package
// This file demonstrates how to integrate Sero with Next.js App Router

'use client';

import React from 'react';
import { 
  SeroNextProvider, 
  SeroNextLink, 
  useSeroTransition, 
  useSeroNavigate,
  useSeroState 
} from 'sero-nextjs';

// Example layout component
export function ExampleLayout({ children }: { children: React.ReactNode }) {
  return (
    <SeroNextProvider
      options={{
        delayMs: 200,
        viewTransitions: true,
        respectReducedMotion: true,
        timeoutMs: 1500,
      }}
    >
      <nav>
        <SeroNextLink href="/" className="nav-link">
          Home
        </SeroNextLink>
        <SeroNextLink href="/about" className="nav-link">
          About
        </SeroNextLink>
        <SeroNextLink href="/contact" className="nav-link">
          Contact
        </SeroNextLink>
      </nav>
      <main>{children}</main>
    </SeroNextProvider>
  );
}

// Example page component
export function ExamplePage() {
  const { navigate } = useSeroNavigate();
  const { phase, prevPath, nextPath } = useSeroState();

  useSeroTransition({
    onEntering: (context) => {
      console.log('Page entering:', context);
      // Add your enter animations here
    },
    onExiting: (context) => {
      console.log('Page exiting:', context);
      // Add your exit animations here
    },
    onNavigating: (context) => {
      console.log('Navigation happening:', context);
      // Add loading states here
    },
  });

  const handleProgrammaticNavigation = async () => {
    await navigate('/about', {
      replace: false,
      scroll: true,
      delayMs: 300,
    });
  };

  return (
    <div>
      <h1>Example Page</h1>
      <p>Current phase: {phase}</p>
      <p>Previous path: {prevPath || 'None'}</p>
      <p>Next path: {nextPath || 'None'}</p>
      
      <button onClick={handleProgrammaticNavigation}>
        Navigate Programmatically
      </button>
    </div>
  );
}

// Example with custom transition options
export function CustomTransitionPage() {
  return (
    <div>
      <h1>Custom Transition Page</h1>
      
      <SeroNextLink
        href="/special"
        options={{
          delayMs: 500,
          viewTransition: true,
          onBeforeNavigate: () => {
            console.log('About to navigate to special page');
          },
          onAfterNavigate: () => {
            console.log('Navigation to special page complete');
          },
        }}
      >
        Go to Special Page
      </SeroNextLink>
    </div>
  );
}
