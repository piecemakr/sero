import { sleep } from './utils.js';

export async function withDelay<T>(fn: () => T | Promise<T>, ms?: number): Promise<T> {
  if (!ms || ms <= 0) return Promise.resolve(fn());
  const result = await fn();
  await sleep(ms);
  return result;
}

/** Ensures fn settles within timeoutMs; if it doesn't, resolve anyway. */
export async function withTimeout<T>(fn: () => Promise<T>, timeoutMs?: number): Promise<T | void> {
  if (!timeoutMs || timeoutMs <= 0) return fn();
  let done = false;
  const t = new Promise<void>(r => setTimeout(() => { if (!done) r(); }, timeoutMs));
  const res = await Promise.race([fn().then(v => { done = true; return v; }), t]) as T | void;
  return res;
}
