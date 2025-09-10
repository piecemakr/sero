import { TransitionError } from './types';
import { prefersReducedMotion, safeCall } from './utils';
import { withDelay, withTimeout } from './guards';
import { withViewTransition } from './viewTransitions';
const DEFAULTS = {
    delayMs: 200,
    viewTransitions: true,
    respectReducedMotion: true,
    timeoutMs: 1500
};
export class SeroCoordinator {
    constructor() {
        this.phase = 'idle';
        this.prevPath = null;
        this.nextPath = null;
        this.subs = new Set();
        this.config = { ...DEFAULTS };
    }
    configure(opts = {}) {
        this.config = { ...this.config, ...opts };
    }
    getState() {
        return { phase: this.phase, prevPath: this.prevPath, nextPath: this.nextPath };
    }
    subscribe(fn) {
        this.subs.add(fn);
        return () => this.subs.delete(fn);
    }
    setPaths(prev, next) {
        this.prevPath = prev;
        this.nextPath = next;
    }
    async emit() {
        const ctx = {
            phase: this.phase,
            prevPath: this.prevPath,
            nextPath: this.nextPath
        };
        for (const fn of this.subs) {
            try {
                await Promise.resolve(fn(ctx));
            }
            catch (error) {
                console.warn('Sero subscriber error:', error);
            }
        }
    }
    async beginTransition(navigate, opts = {}) {
        const startTime = performance.now();
        try {
            if (opts.blockIf?.())
                return;
            const rm = this.config.respectReducedMotion && prefersReducedMotion();
            const delay = rm ? 0 : opts.delayMs ?? this.config.delayMs;
            const timeoutMs = opts.timeoutMs ?? this.config.timeoutMs;
            const useVT = (opts.viewTransition ?? this.config.viewTransitions) && !rm;
            this.phase = 'exiting';
            await this.emit();
            await safeCall(opts.onBeforeNavigate);
            await withDelay(async () => { }, delay);
            this.phase = 'navigating';
            await this.emit();
            await withTimeout(async () => {
                if (useVT) {
                    await withViewTransition(navigate);
                }
                else {
                    await navigate();
                }
            }, timeoutMs);
            this.phase = 'entering';
            await this.emit();
            await safeCall(opts.onAfterNavigate);
            this.phase = 'idle';
            await this.emit();
            if (typeof window !== 'undefined' && window.__SERO_DEBUG__) {
                const duration = performance.now() - startTime;
                console.debug(`Sero transition completed in ${duration.toFixed(2)}ms`, {
                    prevPath: this.prevPath,
                    nextPath: this.nextPath,
                    viewTransitions: useVT,
                    delay,
                });
            }
        }
        catch (error) {
            this.phase = 'idle';
            await this.emit();
            if (error instanceof Error) {
                throw new TransitionError(`Transition failed: ${error.message}`, error);
            }
            throw new TransitionError('Unknown transition error');
        }
    }
    async notifyExternalNavigation() {
        this.phase = 'entering';
        await this.emit();
        this.phase = 'idle';
        await this.emit();
    }
}
export const sero = new SeroCoordinator();
//# sourceMappingURL=coordinator.js.map