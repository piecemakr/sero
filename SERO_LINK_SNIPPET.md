# SeroLink Component Snippet

This is the ready-to-use SeroLink component snippet mentioned in the review. You can copy this into your Next.js 15 App Router project to start using Sero immediately.

## SeroLink Component

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
    // internal routes only
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

## Layout Setup

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
    // back/forward navigations that bypass beginTransition
    sero.notifyExternalNavigation();
  }, [pathname]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Basic CSS

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

## Usage

```tsx
// Use like a regular Next.js Link
<SeroLink href="/about">About</SeroLink>

// With custom options
<SeroLink 
  href="/features" 
  delay={300}
  onBeforeNavigate={() => console.log('Navigating...')}
  onAfterNavigate={() => console.log('Complete!')}
>
  Features
</SeroLink>
```

This component provides a drop-in replacement for Next.js Link with smooth transitions powered by Sero!
