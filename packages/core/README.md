# sero-core

Framework-agnostic core for route transitions in Next.js App Router–style apps.

- Phases: `idle → exiting → navigating → entering → idle`
- Lifecycle: `beginTransition(navigate, opts)` orchestrates exit delay, navigation (optionally via View Transitions), then enter.
- Pub/Sub: `subscribe((ctx) => ...)` to animate **anywhere** in your app.
- No React dependency. Pair it with a React adapter later.

## Install

```bash
pnpm add sero-core
```

## Quick Start (pseudo)

```typescript
import { sero } from 'sero-core';

// 1) Configure global defaults (optional)
sero.configure({
  delayMs: 200,
  viewTransitions: true,
  respectReducedMotion: true,
  timeoutMs: 1500
});

// 2) Keep paths in sync (your adapter should call this on route intent)
sero.setPaths(currentPathname, targetPathname);

// 3) Subscribe anywhere to react to phases
const unsubscribe = sero.subscribe(({ phase, prevPath, nextPath }) => {
  if (phase === 'exiting') {
    // kick off exit animations
  } else if (phase === 'entering') {
    // run entrance animations
  }
});

// 4) Run a transition around actual navigation
await sero.beginTransition(() => router.push('/about'), {
  delayMs: 250,
  onBeforeNavigate: () => {/* e.g., add body class */},
  onAfterNavigate: () => {/* e.g., focus h1 */},
  blockIf: () => hasUnsavedChanges,
  viewTransition: true,
  timeoutMs: 1500
});

// 5) If a back/forward happens outside your control:
sero.notifyExternalNavigation();
```

## Notes

sero-core doesn't know about React or Next. Your React adapter should:

- Call `sero.setPaths(prev, next)` on link click (intent).
- Wrap `router.push()` with `sero.beginTransition(...)`.
- Watch pathname changes and call `sero.notifyExternalNavigation()` for back/forward.

When you add a React adapter later, you'll expose `<SeroProvider/>`, `<SeroLink/>`, and `useRouteTransition()` using this core.

## Types

See `src/types.ts` for `BeginOptions`, `ConfigureOptions`, and `TransitionContext`.
