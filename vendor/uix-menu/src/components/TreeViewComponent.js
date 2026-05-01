import { Component } from '../../../uix/src/index.js';
import { TREE_ACTIVE_LS } from '../constants.js';
import { treeData } from '../data/treeData.js';
import { ensureScopeSelector } from '../utils/scope.js';
import { buildTreeNode, expandAncestors, toggleNodeState } from '../utils/treeDom.js';

export class TreeViewComponent extends Component {

    constructor(selectorOrElement, props = {}) {
        super(selectorOrElement, props);
        this.state = null;
        this.initialState = {};
        this.scopeSelector = this.el ? ensureScopeSelector(this.el, 'uix-tree') : null;
        this.storageKey = props.storageKey || TREE_ACTIVE_LS;
        this.onLeafClick = props.onLeafClick || null;
        this.onTabSelect = props.onTabSelect || null;
    }

    render() {
        const data = this.props.data || treeData;
        return `
            <ul class="tree root">
                ${data.map((item) => buildTreeNode(item, 0)).join('')}
            </ul>
        `;
    }

    addEvents() {
        if (!this.scopeSelector && this.el) {
            this.scopeSelector = ensureScopeSelector(this.el, 'uix-tree');
        }

        if (!this.scopeSelector) {
            return;
        }

        this.addEvent(this.scopeSelector, '.leaf-node-content', 'click', this.handleLeafClick);
        this.addEvent(this.scopeSelector, '.parent > .node-content', 'click', this.handleParentClick);
    }

    componentUpdate() {
        this.restoreActiveLeaf();
    }

    handleLeafClick(event) {
        const leaf = event.target.closest('.leaf-node-content');
        if (!leaf) {
            return;
        }

        const leaves = Array.from(this.el.querySelectorAll('.leaf-node-content'));
        const activeIndex = leaves.indexOf(leaf);

        this.el.querySelectorAll('li.active').forEach((item) => item.classList.remove('active'));
        leaf.closest('li')?.classList.add('active');

        try {
            localStorage.setItem(this.storageKey, String(activeIndex));
        } catch (error) {}

        if (typeof this.onLeafClick === 'function') {
            this.onLeafClick(leaf, activeIndex);
        }

        if (typeof this.onTabSelect === 'function') {
            this.onTabSelect({
                leaf,
                activeIndex,
                tabId: leaf.dataset.tabId || '',
                tabFull: leaf.dataset.tabFull === 'true',
                name: leaf.dataset.name || ''
            });
        }
    }

    handleParentClick(event) {
        const nodeContent = event.target.closest('.node-content');
        const listItem = nodeContent?.closest('li.parent');

        if (!listItem || nodeContent?.classList.contains('leaf-node-content')) {
            return;
        }

        toggleNodeState(listItem);
    }

    restoreActiveLeaf() {
        let activeIndex = NaN;

        try {
            activeIndex = parseInt(localStorage.getItem(this.storageKey), 10);
        } catch (error) {}

        const leaves = this.el.querySelectorAll('.leaf-node-content');
        const restoredLeaf = Number.isInteger(activeIndex) ? leaves[activeIndex] : null;

        if (!restoredLeaf) {
            return;
        }

        expandAncestors(restoredLeaf);
        restoredLeaf.closest('li')?.classList.add('active');
    }
}
