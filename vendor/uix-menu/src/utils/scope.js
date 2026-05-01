let scopeId = 0;

export function ensureScopeSelector(element, prefix) {
    if (!element.dataset.uixScopeId) {
        scopeId += 1;
        element.dataset.uixScopeId = `${prefix}-${scopeId}`;
    }

    return `[data-uix-scope-id="${element.dataset.uixScopeId}"]`;
}
