import type {
  Phase,
  BeginOptions,
  ConfigureOptions,
  Subscriber,
  TransitionContext,
  NavigateFn
} from './types';
import { prefersReducedMotion, safeCall } from './utils';
import { withDelay, withTimeout } from './guards';
import { withViewTransition } from './viewTransitions';

type InternalConfig = Required<ConfigureOptions>;

const DEFAULTS: InternalConfig = {
  delayMs: 200,
  viewTransitions: true,
  respectReducedMotion: true,
  timeoutMs: 1500
};

export class SeroCoordinator {
  private phase: Phase = 'idle';
  private prevPath: string | null = null;
  private nextPath: string | null = null;

  private subs: Set<Subscriber> = new Set();
  private config: InternalConfig = { ...DEFAULTS };

  configure(opts: ConfigureOptions = {}) {
    this.config = { ...this.config, ...opts };
  }

  getState(): Readonly<{ phase: Phase; prevPath: string | null; nextPath: string | null }> {
    return { phase: this.phase, prevPath: this.prevPath, nextPath: this.nextPath };
  }

  subscribe(fn: Subscriber): () => void {
    this.subs.add(fn);
    return () => this.subs.delete(fn);
  }

  /** For adapters (e.g., React) to keep paths in sync on route changes */
  setPaths(prev: string | null, next: string | null) {
    this.prevPath = prev;
    this.nextPath = next;
  }

  private async emit() {
    const ctx: TransitionContext = {
      phase: this.phase,
      prevPath: this.prevPath,
      nextPath: this.nextPath
    };
    // Fire sequentially to keep ordering deterministic
    for (const fn of this.subs) {
      await Promise.resolve(fn(ctx)).catch(() => {});
    }
  }

  /**
   * Orchestrate exit -> (optional delay) -> navigate (optional VT) -> enter
   * The adapter supplies the real navigation function.
   */
  async beginTransition(navigate: NavigateFn, opts: BeginOptions = {}): Promise<void> {
    // Guard: blockIf
    if (opts.blockIf?.()) return;

    const rm = this.config.respectReducedMotion && prefersReducedMotion();
    const delay = rm ? 0 : opts.delayMs ?? this.config.delayMs;
    const timeoutMs = opts.timeoutMs ?? this.config.timeoutMs;
    const useVT = (opts.viewTransition ?? this.config.viewTransitions) && !rm;

    // EXIT
    this.phase = 'exiting';
    await this.emit();

    await safeCall(opts.onBeforeNavigate);

    // Optional delay (for exit animations to be visible)
    await withDelay(async () => {}, delay);

    // NAVIGATE (VT wrapper + safety timeout)
    this.phase = 'navigating';
    await this.emit();

    await withTimeout(async () => {
      if (useVT) {
        await withViewTransition(navigate);
      } else {
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
  }

  /** To be called by adapters when navigation happens outside our control (back/forward) */
  async notifyExternalNavigation(): Promise<void> {
    // We simulate a minimal entering pulse so subscribers can react.
    this.phase = 'entering';
    await this.emit();
    this.phase = 'idle';
    await this.emit();
  }
}

/** Singleton for simple integration; adapters can also create their own instance */
export const sero = new SeroCoordinator();
