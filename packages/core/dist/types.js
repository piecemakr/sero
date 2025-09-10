export class SeroError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'SeroError';
    }
}
export class NavigationError extends SeroError {
    constructor(message, originalError) {
        super(message, 'NAVIGATION_ERROR');
        this.originalError = originalError;
        this.name = 'NavigationError';
    }
}
export class TransitionError extends SeroError {
    constructor(message, originalError) {
        super(message, 'TRANSITION_ERROR');
        this.originalError = originalError;
        this.name = 'TransitionError';
    }
}
//# sourceMappingURL=types.js.map