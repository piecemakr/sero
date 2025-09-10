export async function withViewTransition(navigate) {
    if (typeof document === 'undefined' || !('startViewTransition' in document)) {
        await navigate();
        return;
    }
    try {
        const vt = document.startViewTransition?.(() => navigate());
        await vt?.finished?.catch(() => { });
    }
    catch {
        await navigate();
    }
}
//# sourceMappingURL=viewTransitions.js.map