import { SIDEBAR_LS, TREE_ACTIVE_LS } from '../constants.js';
import { treeData } from '../data/treeData.js';
import { ensureScopeSelector } from '../utils/scope.js';
import { applyCollapsedTreeState, syncToggleIcon } from '../utils/treeDom.js';
import { refreshViewportLayout } from '../utils/layout.js';
import { BaseMenuComponent } from './BaseMenuComponent.js';
import { TreeViewComponent } from './TreeViewComponent.js';

export class SidebarMenuComponent extends BaseMenuComponent {

    constructor(selectorOrElement, props = {}) {
        super(selectorOrElement, props);
        this.scopeSelector = ensureScopeSelector(this.el, 'uix-sidebar');
        this.template = this.el.innerHTML;
        this.storageKey = props.sidebarStorageKey || SIDEBAR_LS;
        this.resetMode = props.resetMode || 'all';
        this.resetStorageKeys = Array.isArray(props.resetStorageKeys) ? props.resetStorageKeys : [this.storageKey];
        this.layoutOptions = props.layoutOptions || {};
        this.sidebarToggleSelector = props.sidebarToggleSelector || '#sidebarToggle';
        this.children = {
            sidebarTree: new TreeViewComponent(null, {
                data: props.data || treeData,
                storageKey: props.treeStorageKey || TREE_ACTIVE_LS,
                onTabSelect: props.onTabSelect
            })
        };
        this._resizeHandler = this.handleResize.bind(this);
    }

    componentUpdate() {
        this.applyCollapsedState();
        this.attachWindowListeners();
    }

    toggleSidebar() {
        const nextCollapsed = !this.el.classList.contains('collapsed');
        this.state.collapsed = nextCollapsed;

        try {
            localStorage.setItem(this.storageKey, nextCollapsed ? '1' : '0');
        } catch (error) {}

        this.applyCollapsedState();
    }

    resetUiState() {
        try {
            if (this.resetMode === 'menu') {
                this.resetStorageKeys.forEach((key) => {
                    if (key) {
                        localStorage.removeItem(key);
                    }
                });
            } else {
                localStorage.clear();
            }
        } catch (error) {}

        location.reload();
    }

    handleResize() {
        refreshViewportLayout(this.el, this.layoutOptions);
    }

    attachWindowListeners() {
        if (this._windowBound) {
            return;
        }

        window.addEventListener('resize', this._resizeHandler);
        this._windowBound = true;
    }

    applyCollapsedState() {
        const collapsed = Boolean(this.state?.collapsed);
        this.el.classList.toggle('collapsed', collapsed);

        const button = this.el.querySelector(this.sidebarToggleSelector);
        syncToggleIcon(button, collapsed);
        applyCollapsedTreeState(this.el);
        refreshViewportLayout(this.el, this.layoutOptions);
    }
}
