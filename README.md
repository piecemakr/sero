# Sero

A framework-agnostic library for smooth page transitions in Next.js App Router applications.

[![npm version](https://badge.fury.io/js/@sero%2Fcore.svg)](https://badge.fury.io/js/@sero%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Framework Agnostic**: Core library works with any framework
- **Next.js Integration**: Seamless integration with Next.js App Router
- **View Transitions API**: Leverages native browser View Transitions when available
- **TypeScript**: Full TypeScript support
- **Accessibility**: Respects `prefers-reduced-motion`
- **Lightweight**: Minimal bundle size impact (~4KB core)

## Quick Start (5 minutes)

### 1. Install

```bash
npm install @sero/core @sero/nextjs
# or
pnpm add @sero/core @sero/nextjs
```

### 2. Core Usage (Next 15 App Router)

```tsx
// app/layout.tsx
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sero } from '@sero/core';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Handle back/forward navigations
    sero.notifyExternalNavigation();
  }, [pathname]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/components/SeroLink.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sero } from '@sero/core';
import { MouseEvent } from 'react';

type Props = React.ComponentProps<typeof Link> & {
  delay?: number;
  onBeforeNavigate?: () => void | Promise<void>;
  onAfterNavigate?: () => void | Promise<void>;
  viewTransition?: boolean;
  blockIf?: () => boolean;
};

export default function SeroLink({ 
  href, 
  delay, 
  onBeforeNavigate, 
  onAfterNavigate, 
  viewTransition = true, 
  blockIf, 
  ...rest 
}: Props) {
  const router = useRouter();

  async function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (typeof href === 'string' && href.startsWith('/')) {
      e.preventDefault();
      sero.setPaths(window.location.pathname, href);
      await sero.beginTransition(() => router.push(href), {
        delayMs: delay,
        onBeforeNavigate,
        onAfterNavigate,
        viewTransition,
        blockIf
      });
    }
  }
  
  return <Link href={href} onClick={onClick} {...rest} />;
}
```

```css
/* app/globals.css */
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

[data-sero-phase="exiting"] {
  animation: fadeOut 200ms ease-out;
}

[data-sero-phase="entering"] {
  animation: fadeIn 200ms ease-in;
}
```

### 3. Use in your components

```tsx
// app/page.tsx
import SeroLink from './components/SeroLink';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Sero</h1>
      <SeroLink href="/about">Go to About</SeroLink>
    </div>
  );
}
```

## API Reference

### Core API (`@sero/core`)

#### `sero.configure(options)`

Configure global settings:

```ts
sero.configure({
  delayMs: 200,           // Delay before navigation
  viewTransitions: true,  // Use View Transitions API
  respectReducedMotion: true, // Respect user preferences
  timeoutMs: 1500        // Safety timeout
});
```

#### `sero.beginTransition(navigate, options)`

Start a transition:

```ts
await sero.beginTransition(() => router.push('/about'), {
  delayMs: 300,
  onBeforeNavigate: () => document.body.classList.add('exiting'),
  onAfterNavigate: () => document.body.classList.remove('exiting'),
  viewTransition: true,
  blockIf: () => false
});
```

#### `sero.setPaths(prev, next)`

Set current and target paths:

```ts
sero.setPaths('/home', '/about');
```

#### `sero.subscribe(callback)`

Subscribe to transition events:

```ts
const unsubscribe = sero.subscribe(({ phase, prevPath, nextPath }) => {
  console.log(`Phase: ${phase}, ${prevPath} → ${nextPath}`);
});
```

#### `sero.notifyExternalNavigation()`

Notify of external navigation (back/forward):

```ts
sero.notifyExternalNavigation();
```

### Transition Phases

- `idle` - No transition in progress
- `exiting` - Current page is exiting
- `navigating` - Navigation is happening
- `entering` - New page is entering
- `idle` - Transition complete

### Next.js Integration (`@sero/nextjs`)

#### `SeroProvider`

```tsx
<SeroProvider
  delayMs={200}
  viewTransitions={true}
  respectReducedMotion={true}
>
  {children}
</SeroProvider>
```

#### `SeroLink`

```tsx
<SeroLink
  href="/about"
  delayMs={300}
  onBeforeNavigate={() => console.log('Navigating...')}
  onAfterNavigate={() => console.log('Complete!')}
>
  About
</SeroLink>
```

## Examples

- [Next 15 Demo](./examples/next-15-demo) - Complete Next.js App Router example
- [Basic Usage](./packages/core/README.md) - Core library examples

## Browser Support

- Chrome 111+ (View Transitions API)
- Firefox 89+ (View Transitions API)
- Safari 18+ (View Transitions API)
- All modern browsers (fallback mode)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Troy Hancock](https://github.com/troyhancock)