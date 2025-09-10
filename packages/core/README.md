# @sero/core

The core transition coordinator for Sero. This package provides the framework-agnostic API for managing page transitions.

## Installation

```bash
npm install @sero/core
```

## Basic Usage

```ts
import { sero } from '@sero/core';

// Configure global settings
sero.configure({
  delayMs: 200,
  viewTransitions: true,
  respectReducedMotion: true,
  timeoutMs: 1500
});

// Subscribe to transition events
const unsubscribe = sero.subscribe(({ phase, prevPath, nextPath }) => {
  console.log(`Phase: ${phase}, ${prevPath} → ${nextPath}`);
});

// Start a transition
await sero.beginTransition(() => router.push('/about'), {
  delayMs: 300,
  onBeforeNavigate: () => document.body.classList.add('exiting'),
  onAfterNavigate: () => document.body.classList.remove('exiting')
});
```

## API

### `sero.configure(options)`

Configure global settings for all transitions.

```ts
sero.configure({
  delayMs?: number;           // Default delay before navigation (200ms)
  viewTransitions?: boolean;  // Use View Transitions API (true)
  respectReducedMotion?: boolean; // Respect prefers-reduced-motion (true)
  timeoutMs?: number;         // Safety timeout (1500ms)
});
```

### `sero.beginTransition(navigate, options)`

Start a transition with the given navigation function.

```ts
await sero.beginTransition(() => router.push('/about'), {
  delayMs?: number;           // Override global delay
  viewTransition?: boolean;   // Override global View Transitions setting
  blockIf?: () => boolean;    // Block navigation if returns true
  timeoutMs?: number;         // Override global timeout
  onBeforeNavigate?: () => void | Promise<void>; // Called before navigation
  onAfterNavigate?: () => void | Promise<void>;  // Called after navigation
});
```

### `sero.setPaths(prev, next)`

Set the current and target paths for tracking.

```ts
sero.setPaths('/home', '/about');
```

### `sero.subscribe(callback)`

Subscribe to transition events. Returns an unsubscribe function.

```ts
const unsubscribe = sero.subscribe((context) => {
  const { phase, prevPath, nextPath } = context;
  // Handle transition events
});
```

### `sero.notifyExternalNavigation()`

Notify the coordinator of external navigation (back/forward buttons).

```ts
sero.notifyExternalNavigation();
```

## Transition Phases

The coordinator goes through these phases during a transition:

1. **`idle`** - No transition in progress
2. **`exiting`** - Current page is exiting (callbacks fired)
3. **`navigating`** - Navigation is happening (View Transitions API if enabled)
4. **`entering`** - New page is entering (callbacks fired)
5. **`idle`** - Transition complete

## View Transitions API

When `viewTransitions: true` and the browser supports it, Sero will use the native View Transitions API for smooth transitions. Otherwise, it falls back to plain navigation.

## Accessibility

Sero automatically respects `prefers-reduced-motion` when `respectReducedMotion: true` (default). This skips delays and View Transitions for users who prefer reduced motion.

## Error Handling

All transitions are wrapped in try-catch blocks. If an error occurs:

1. The coordinator resets to `idle` state
2. A `TransitionError` is thrown
3. Subscribers are notified of the state change

## TypeScript

This package is written in TypeScript and provides full type definitions.

```ts
import type { Phase, TransitionContext, BeginOptions } from '@sero/core';
```