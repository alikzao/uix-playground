import { treeData } from './data/treeData.js';
import { readCollapsedState, refreshViewportLayout } from './utils/layout.js';
import { SidebarMenuComponent } from './components/SidebarMenuComponent.js';
import { MobileMenuComponent } from './components/MobileMenuComponent.js';
import { DEFAULT_LAYOUT, DEFAULT_SELECTORS, SIDEBAR_LS, TREE_ACTIVE_LS } from './constants.js';
import { expandAncestors } from './utils/treeDom.js';

let sidebarInstance = null;
let mobileInstance = null;

function normalizeOptions(options = {}) {
    return {
        data: options.data || treeData,
        selectors: { ...DEFAULT_SELECTORS, ...(options.selectors || {}) },
        layout: { ...DEFAULT_LAYOUT, ...(options.layout || {}) },
        storage: {
            sidebarCollapsedKey: options.storage?.sidebarCollapsedKey || SIDEBAR_LS,
            activeLeafKey: options.storage?.activeLeafKey || TREE_ACTIVE_LS
        },
        callbacks: {
            onTabSelect: options.callbacks?.onTabSelect || null
        },
        behavior: {
            exposeExpandAncestorsGlobal: options.behavior?.exposeExpandAncestorsGlobal !== false,
            resetMode: options.behavior?.resetMode || 'all'
        }
    };
}

function initSidebarComponent(selector = '#sidebar', options = {}) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!element) {
        return null;
    }

    if (sidebarInstance?.el === element) {
        sidebarInstance.applyCollapsedState();
        return sidebarInstance;
    }

    sidebarInstance = new SidebarMenuComponent(element, {
        data: options.data,
        treeStorageKey: options.storage.activeLeafKey,
        sidebarStorageKey: options.storage.sidebarCollapsedKey,
        sidebarToggleSelector: options.selectors.sidebarToggle,
        copyButtonSelector: options.selectors.copyButton,
        layoutOptions: { selectors: options.selectors, layout: options.layout },
        onTabSelect: options.callbacks.onTabSelect,
        resetMode: options.behavior.resetMode,
        resetStorageKeys: [
            options.storage.sidebarCollapsedKey,
            options.storage.activeLeafKey
        ]
    });
    sidebarInstance.initState({ collapsed: readCollapsedState(options.storage.sidebarCollapsedKey) });
    return sidebarInstance;
}

function initMobileComponent(selector = '.nav1', options = {}) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!element) {
        return null;
    }

    if (mobileInstance?.el === element) {
        mobileInstance.applyMobileState();
        return mobileInstance;
    }

    mobileInstance = new MobileMenuComponent(element, {
        data: options.data,
        treeStorageKey: options.storage.activeLeafKey,
        copyButtonSelector: options.selectors.copyButton,
        burgerSelector: options.selectors.burger,
        navLinksSelector: options.selectors.navLinks
    });
    mobileInstance.initState({ mobileOpen: false });
    return mobileInstance;
}

export function initSidebarToggle(sidebarSelector = '#sidebar', options = {}) {
    const normalized = normalizeOptions(options);
    return initSidebarComponent(sidebarSelector, normalized);
}

export function initMenuTree(options = {}) {
    const normalized = normalizeOptions(options);
    if (normalized.behavior.exposeExpandAncestorsGlobal && typeof window !== 'undefined') {
        window.expandAncestors = expandAncestors;
    }
    const sidebar = initSidebarComponent(normalized.selectors.sidebar, normalized);
    const mobile = initMobileComponent(normalized.selectors.mobile, normalized);

    if (sidebar) {
        refreshViewportLayout(sidebar.el, {
            selectors: normalized.selectors,
            layout: normalized.layout
        });
    }

    return { sidebar, mobile };
}

export { treeData };
