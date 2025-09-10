# sero-react

React adapter for Sero route transitions. Provides React components and hooks for seamless integration with the Sero core transition system.

## Installation

```bash
npm install @sero/react @sero/core
# or
pnpm add @sero/react @sero/core
# or
yarn add @sero/react @sero/core
```

## Quick Start

### 1. Wrap your app with SeroProvider

```tsx
import { SeroProvider } from '@sero/react';

function App() {
  return (
    <SeroProvider
      options={{
        delayMs: 200,
        viewTransitions: true,
        respectReducedMotion: true,
      }}
    >
      <YourApp />
    </SeroProvider>
  );
}
```

### 2. Use SeroLink for navigation

```tsx
import { SeroLink } from '@sero/react';

function Navigation() {
  return (
    <nav>
      <SeroLink href="/about" className="nav-link">
        About
      </SeroLink>
      <SeroLink 
        href="/contact" 
        options={{ delayMs: 300, viewTransition: true }}
      >
        Contact
      </SeroLink>
    </nav>
  );
}
```

### 3. Subscribe to transition phases

```tsx
import { useTransition } from '@sero/react';

function MyComponent() {
  useTransition({
    onExiting: (context) => {
      // Animate out
      console.log('Exiting to:', context.nextPath);
    },
    onEntering: (context) => {
      // Animate in
      console.log('Entering from:', context.prevPath);
    },
  });

  return <div>My Component</div>;
}
```

### 4. Programmatic navigation

```tsx
import { useNavigate } from '@sero/react';

function MyButton() {
  const { navigate } = useNavigate();

  const handleClick = () => {
    navigate('/dashboard', {
      delayMs: 250,
      onBeforeNavigate: () => console.log('About to navigate'),
      onAfterNavigate: () => console.log('Navigation complete'),
    });
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

## API Reference

### Components

#### `SeroProvider`

Provider component that wraps your app and configures Sero.

```tsx
<SeroProvider options={ConfigureOptions}>
  {children}
</SeroProvider>
```

**Props:**
- `children`: React children
- `options`: Optional configuration object (see `ConfigureOptions` from @sero/core)

#### `SeroLink`

Link component that triggers route transitions.

```tsx
<SeroLink 
  href="/path" 
  options={BeginOptions}
  replace={boolean}
  scroll={boolean}
  shallow={boolean}
  prefetch={boolean}
>
  Link Text
</SeroLink>
```

**Props:**
- `href`: Target URL
- `options`: Transition options (see `BeginOptions` from @sero/core)
- `replace`: Use `history.replaceState` instead of `pushState`
- `scroll`: Whether to scroll to top after navigation
- `shallow`: Shallow routing (Next.js specific)
- `prefetch`: Prefetch the target page
- Standard anchor element props (`className`, `style`, `onClick`, etc.)

### Hooks

#### `useSero()`

Access the Sero context directly.

```tsx
const { beginTransition, subscribe, getState, setPaths } = useSero();
```

#### `useRouteTransition(options)`

Subscribe to transition phases with callbacks.

```tsx
useRouteTransition({
  onExiting: (context) => void,
  onNavigating: (context) => void,
  onEntering: (context) => void,
});
```

#### `useTransitionState()`

Get the current transition state.

```tsx
const { phase, prevPath, nextPath } = useTransitionState();
```

#### `useNavigate()`

Get a programmatic navigation function.

```tsx
const { navigate } = useNavigate();

// Usage
navigate('/path', {
  delayMs: 200,
  viewTransition: true,
  replace: false,
  scroll: true,
});
```

### Higher-Order Components

#### `withSeroTransition(LinkComponent)`

Wrap existing Link components with transition support.

```tsx
import { withSeroTransition } from '@sero/react';
import { Link } from 'next/link';

const TransitionLink = withSeroTransition(Link);

// Usage
<TransitionLink href="/about" transitionOptions={{ delayMs: 200 }}>
  About
</TransitionLink>
```

## Integration with Next.js

For Next.js App Router, you can create a custom Link component:

```tsx
// components/SeroNextLink.tsx
import { withSeroTransition } from '@sero/react';
import Link from 'next/link';

export const SeroNextLink = withSeroTransition(Link);
```

Then use it throughout your app:

```tsx
import { SeroNextLink } from './components/SeroNextLink';

<SeroNextLink href="/about" transitionOptions={{ delayMs: 200 }}>
  About
</SeroNextLink>
```

## TypeScript Support

This package is fully typed and exports all necessary types from both `@sero/react` and `@sero/core` for your convenience.

## Examples

See the [@sero/core documentation](../core/README.md) for more details on the underlying transition system and configuration options.
