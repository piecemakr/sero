import { TransitionError } from './types.js';
import { prefersReducedMotion, safeCall } from './utils.js';
import { withDelay, withTimeout } from './guards.js';
import { withViewTransition } from './viewTransitions.js';
const DEFAULTS = {
    delayMs: 200,
    viewTransitions: true,
    respectReducedMotion: true,
    timeoutMs: 1500
};
export class SeroCoordinator {
    phase = 'idle';
    prevPath = null;
    nextPath = null;
    subs = new Set();
    config = { ...DEFAULTS };
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
    /** For adapters (e.g., React) to keep paths in sync on route changes */
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
        // Fire sequentially to keep ordering deterministic
        for (const fn of this.subs) {
            try {
                await Promise.resolve(fn(ctx));
            }
            catch (error) {
                console.warn('Sero subscriber error:', error);
            }
        }
    }
    /**
     * Orchestrate exit -> (optional delay) -> navigate (optional VT) -> enter
     * The adapter supplies the real navigation function.
     */
    async beginTransition(navigate, opts = {}) {
        const startTime = performance.now();
        try {
            // Guard: blockIf
            if (opts.blockIf?.())
                return;
            const rm = this.config.respectReducedMotion && prefersReducedMotion();
            const delay = rm ? 0 : opts.delayMs ?? this.config.delayMs;
            const timeoutMs = opts.timeoutMs ?? this.config.timeoutMs;
            const useVT = (opts.viewTransition ?? this.config.viewTransitions) && !rm;
            // EXIT
            this.phase = 'exiting';
            await this.emit();
            await safeCall(opts.onBeforeNavigate);
            // Optional delay (for exit animations to be visible)
            await withDelay(async () => { }, delay);
            // NAVIGATE (VT wrapper + safety timeout)
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
            // ENTER
            this.phase = 'entering';
            await this.emit();
            await safeCall(opts.onAfterNavigate);
            // back to idle
            this.phase = 'idle';
            await this.emit();
            // Performance tracking (optional - only in development)
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
            // Reset to idle state on error
            this.phase = 'idle';
            await this.emit();
            if (error instanceof Error) {
                throw new TransitionError(`Transition failed: ${error.message}`, error);
            }
            throw new TransitionError('Unknown transition error');
        }
    }
    /** To be called by adapters when navigation happens outside our control (back/forward) */
    async notifyExternalNavigation() {
        // We simulate a minimal entering pulse so subscribers can react.
        this.phase = 'entering';
        await this.emit();
        this.phase = 'idle';
        await this.emit();
    }
}
/** Singleton for simple integration; adapters can also create their own instance */
export const sero = new SeroCoordinator();
