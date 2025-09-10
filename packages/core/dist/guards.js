import { sleep } from './utils';
export async function withDelay(fn, ms) {
    if (!ms || ms <= 0)
        return Promise.resolve(fn());
    await sleep(ms);
    return fn();
}
/** Ensures fn settles within timeoutMs; if it doesn't, resolve anyway. */
export async function withTimeout(fn, timeoutMs) {
    if (!timeoutMs || timeoutMs <= 0)
        return fn();
    let done = false;
    const t = new Promise(r => setTimeout(() => { if (!done)
        r(); }, timeoutMs));
    const res = await Promise.race([fn().then(v => { done = true; return v; }), t]);
    return res;
}
