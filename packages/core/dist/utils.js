export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export function prefersReducedMotion() {
    if (typeof window === 'undefined')
        return false;
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    catch {
        return false;
    }
}
export function safeCall(fn) {
    try {
        const res = fn?.();
        return Promise.resolve(res).catch(() => { });
    }
    catch {
        return Promise.resolve();
    }
}
