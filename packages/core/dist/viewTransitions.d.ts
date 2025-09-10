import type { NavigateFn } from './types';
/**
 * Wrap navigation with the View Transitions API when available and requested.
 * Falls back to plain navigate if unsupported or throws.
 */
export declare function withViewTransition(navigate: NavigateFn): Promise<void>;
