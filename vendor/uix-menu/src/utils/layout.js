import { DEFAULT_LAYOUT, DEFAULT_SELECTORS, SIDEBAR_LS } from '../constants.js';

export function readCollapsedState(storageKey = SIDEBAR_LS) {
    try {
        return localStorage.getItem(storageKey) === '1';
    } catch (error) {
        return false;
    }
}

export function refreshViewportLayout(sidebar, options = {}) {
    const selectors = { ...DEFAULT_SELECTORS, ...(options.selectors || {}) };
    const layout = { ...DEFAULT_LAYOUT, ...(options.layout || {}) };
    const main = document.querySelector(selectors.main);
    const nav2 = document.querySelector(selectors.nav2);
    const width = window.innerWidth;
    const hasSidebar = width >= layout.desktopBreakpoint && sidebar;
    const sidebarWidth = hasSidebar && sidebar.classList.contains('collapsed')
        ? layout.collapsedWidth
        : layout.expandedWidth;

    if (main) {
        if (hasSidebar) {
            main.style.marginLeft = `${sidebarWidth}px`;
            main.style.width = `calc(100% - ${sidebarWidth}px)`;
        } else {
            main.style.marginLeft = '0';
            main.style.width = '100%';
        }
    }

    if (nav2) {
        if (hasSidebar) {
            nav2.style.position = 'fixed';
            nav2.style.top = '0';
            nav2.style.left = `${sidebarWidth}px`;
            nav2.style.right = '0';
            nav2.style.width = `calc(100% - ${sidebarWidth}px)`;
            nav2.style.marginLeft = '0';
            nav2.style.marginRight = '0';
        } else {
            nav2.style.position = '';
            nav2.style.top = '';
            nav2.style.left = '';
            nav2.style.right = '';
            nav2.style.width = '';
            nav2.style.marginLeft = '';
            nav2.style.marginRight = '';
        }
    }

    if (main && layout.forceRepaint) {
        main.style.display = 'none';
        void main.offsetHeight;
        main.style.display = '';
    }

    if (window.erpComponent && typeof window.erpComponent.adjustHeights === 'function') {
        window.erpComponent.adjustHeights();
    }
}
