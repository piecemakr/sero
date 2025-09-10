export class SeroError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'SeroError';
    }
}
export class NavigationError extends SeroError {
    originalError;
    constructor(message, originalError) {
        super(message, 'NAVIGATION_ERROR');
        this.originalError = originalError;
        this.name = 'NavigationError';
    }
}
export class TransitionError extends SeroError {
    originalError;
    constructor(message, originalError) {
        super(message, 'TRANSITION_ERROR');
        this.originalError = originalError;
        this.name = 'TransitionError';
    }
}
