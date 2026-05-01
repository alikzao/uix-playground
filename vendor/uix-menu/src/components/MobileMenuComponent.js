import { TREE_ACTIVE_LS } from '../constants.js';
import { treeData } from '../data/treeData.js';
import { ensureScopeSelector } from '../utils/scope.js';
import { BaseMenuComponent } from './BaseMenuComponent.js';
import { TreeViewComponent } from './TreeViewComponent.js';

export class MobileMenuComponent extends BaseMenuComponent {

    constructor(selectorOrElement, props = {}) {
        super(selectorOrElement, props);
        this.scopeSelector = ensureScopeSelector(this.el, 'uix-mobile-menu');
        this.template = this.el.innerHTML;
        this.burgerSelector = props.burgerSelector || '.burger';
        this.navLinksSelector = props.navLinksSelector || '.nav-links';
        this.children = {
            mobileTree: new TreeViewComponent(null, {
                data: props.data || treeData,
                storageKey: props.treeStorageKey || TREE_ACTIVE_LS,
                onLeafClick: () => this.closeMenu()
            })
        };
    }

    componentUpdate() {
        this.applyMobileState();
    }

    toggleMobileMenu() {
        this.state.mobileOpen = !this.state.mobileOpen;
        this.applyMobileState();
    }

    closeMenu() {
        this.state.mobileOpen = false;
        this.applyMobileState();
    }

    applyMobileState() {
        const mobileOpen = Boolean(this.state?.mobileOpen);
        const burger = this.el.querySelector(this.burgerSelector);
        const navLinks = this.el.querySelector(this.navLinksSelector);

        burger?.classList.toggle('toggle', mobileOpen);
        navLinks?.classList.toggle('nav-active', mobileOpen);
    }
}
