export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function safeCall(fn?: () => void | Promise<void>): Promise<void> {
  try {
    const res = fn?.();
    return Promise.resolve(res).catch(() => {});
  } catch {
    return Promise.resolve();
  }
}
