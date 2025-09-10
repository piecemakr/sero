import type { NavigateFn } from './types';

/**
 * Wrap navigation with the View Transitions API when available and requested.
 * Falls back to plain navigate if unsupported or throws.
 */
export async function withViewTransition(navigate: NavigateFn): Promise<void> {
  // Guard for server/old browsers
  if (typeof document === 'undefined' || !('startViewTransition' in document)) {
    await navigate();
    return;
  }
  try {
    const vt = (document as any).startViewTransition(() => navigate());
    // browsers expose finished promise
    await vt?.finished?.catch(() => {});
  } catch {
    await navigate();
  }
}
