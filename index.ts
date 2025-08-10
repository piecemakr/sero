/**
 * Sero - Lightweight transition layer for Next.js Links
 * 
 * This is the main entry point for the sero package.
 * Provides functionality for delayed, preloaded, and animated page transitions.
 */

export interface SeroOptions {
  delay?: number;
  preload?: boolean;
  animate?: boolean;
}

/**
 * Placeholder function for sero functionality
 * @param options Configuration options for transitions
 */
export function sero(options: SeroOptions = {}): void {
  // TODO: Implement sero functionality
  console.log('Sero initialized with options:', options);
}

/**
 * Default export for convenience
 */
export default sero;