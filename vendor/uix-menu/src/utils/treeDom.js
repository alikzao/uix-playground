function translate(value) {
    return typeof window.t === 'function' ? window.t(value) : value;
}

export function buildTreeNode(item, level = 0) {
    const paddingLeft = `${level * 20}px`;
    const iconHTML = item.icon ? `<i class="${item.icon}"></i>` : '';
    const label = translate(item.name);

    if (item.children?.length) {
        return `
            <li class="collapsed parent">
                <div class="node-content" style="padding-left: ${paddingLeft}" title="${label}">
                    <div class="icon-text-container">
                        <span class="leaf-icon-placeholder"></span>
                        ${iconHTML}
                        <span class="label">${label}</span>
                    </div>
                    <span class="toggle-icon">+</span>
                </div>
                <ul>
                    ${item.children.map((child) => buildTreeNode(child, level + 1)).join('')}
                </ul>
            </li>
        `;
    }

    return `
        <li>
            <div
                class="node-content leaf-node-content"
                data-tab-id="${item.dataTabId || ''}"
                data-tab-full="${item.full ? 'true' : 'false'}"
                data-name="${label}"
                style="padding-left: ${paddingLeft}"
                title="${label}"
            >
                <div class="icon-text-container">
                    <span class="leaf-icon"></span>
                    ${iconHTML}
                    <span class="label">${label}</span>
                </div>
            </div>
        </li>
    `;
}

export function expandAncestors(leafElement) {
    let parentNode = leafElement.closest('ul')?.closest('li.parent');

    while (parentNode) {
        parentNode.classList.remove('collapsed');
        const icon = parentNode.querySelector('.node-content .toggle-icon');
        if (icon) {
            icon.textContent = '-';
        }
        parentNode = parentNode.closest('ul')?.closest('li.parent');
    }
}

export function toggleNodeState(listItem) {
    const collapsed = listItem.classList.toggle('collapsed');
    const icon = listItem.querySelector('.node-content .toggle-icon');

    if (icon) {
        icon.textContent = collapsed ? '+' : '-';
    }
}

export function applyCollapsedTreeState(sidebar) {
    const isCollapsed = sidebar.classList.contains('collapsed');
    const nodes = sidebar.querySelectorAll('.tree .node-content, .tree .leaf-node-content');

    nodes.forEach((node) => {
        if (!node.dataset.originalPaddingLeft) {
            node.dataset.originalPaddingLeft = node.style.paddingLeft || '';
        }

        node.style.paddingLeft = isCollapsed ? '12px' : node.dataset.originalPaddingLeft;
    });
}

export function syncToggleIcon(button, collapsed) {
    const icon = button?.querySelector('i');
    if (!icon) {
        return;
    }

    icon.classList.remove('bi-chevron-left', 'bi-chevron-right');
    icon.classList.add(collapsed ? 'bi-chevron-right' : 'bi-chevron-left');
}
