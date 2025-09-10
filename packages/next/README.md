# Sero Next.js

Next.js integration for Sero route transitions with View Transitions API support.

## Installation

```bash
npm install @sero/nextjs @sero/core
# or
pnpm add @sero/nextjs @sero/core
# or  
yarn add @sero/nextjs @sero/core
```

## Quick Start

### 1. Wrap your app with the provider

```tsx
// app/layout.tsx
import { SeroNextProvider } from '@sero/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SeroNextProvider
          options={{
            delayMs: 200,
            viewTransitions: true,
            respectReducedMotion: true,
          }}
        >
          {children}
        </SeroNextProvider>
      </body>
    </html>
  );
}
```

### 2. Use the transition link

```tsx
// app/page.tsx
import { SeroNextLink } from '@sero/nextjs';

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <SeroNextLink href="/about">
        Go to About
      </SeroNextLink>
    </div>
  );
}
```

### 3. Add transition hooks to your pages

```tsx
// app/about/page.tsx
import { useTransition } from '@sero/nextjs';

export default function AboutPage() {
  useTransition({
    onEntering: () => {
      console.log('Entering about page');
    },
    onExiting: () => {
      console.log('Exiting about page');
    },
  });

  return <h1>About Page</h1>;
}
```

## API Reference

### Components

#### `SeroNextLink`

A Next.js Link component with transition support.

```tsx
<SeroNextLink
  href="/about"
  replace={false}
  scroll={true}
  shallow={false}
  prefetch={true}
  options={{
    delayMs: 300,
    viewTransition: true,
  }}
>
  Go to About
</SeroNextLink>
```

#### `SeroNextProvider`

Context provider for the transition system.

```tsx
<SeroNextProvider
  options={{
    delayMs: 200,
    viewTransitions: true,
    respectReducedMotion: true,
    timeoutMs: 1500,
  }}
>
  {children}
</SeroNextProvider>
```

### Hooks

#### `useTransition`

Subscribe to transition phases.

```tsx
useTransition({
  onEntering: (context) => {
    // Page is entering
  },
  onExiting: (context) => {
    // Page is exiting
  },
  onNavigating: (context) => {
    // Navigation is happening
  },
});
```

#### `useNavigate`

Programmatic navigation with transitions.

```tsx
const { navigate } = useNavigate();

// Navigate with transition
await navigate('/about', {
  replace: false,
  scroll: true,
  delayMs: 300,
});
```

#### `useTransitionState`

Get current transition state.

```tsx
const { phase, prevPath, nextPath } = useTransitionState();
```

## Features

- ✅ Next.js App Router integration
- ✅ View Transitions API support
- ✅ SSR-safe implementation
- ✅ TypeScript support
- ✅ Reduced motion respect
- ✅ Customizable delays and timeouts
- ✅ Programmatic navigation
- ✅ Prefetching support

## Browser Support

- Modern browsers with View Transitions API support
- Graceful fallback for unsupported browsers
- SSR compatible
