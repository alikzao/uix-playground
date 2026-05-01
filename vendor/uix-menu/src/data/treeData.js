export const treeData = [
    {
        name: 'work_tasks',
        icon: 'bi bi-person-workspace',
        children: [
            { name: 'work_tasks', dataTabId: 'tasks', icon: 'bi bi-list-task' },
            { name: 'kanban_bord', dataTabId: 'kanban::kanban', icon: 'bi bi-kanban' },
            { name: 'frequently_used_notes', dataTabId: '', icon: 'bi bi-sticky' }
        ]
    },
    {
        name: 'accounting',
        icon: 'bi bi-bank',
        children: [
            { name: 'all_invoices', dataTabId: 'invoices/direction=clean', icon: 'bi bi-receipt' },
            { name: 'incoming_invoices', dataTabId: 'invoices/direction=in', icon: 'bi bi-box-arrow-in-down' },
            { name: 'outgoing_invoices', dataTabId: 'invoices/direction=out', icon: 'bi bi-box-arrow-up-right' },
            { name: 'opening_balances', dataTabId: 'opening_balances', icon: 'bi bi-hourglass-split' },
            { name: 'all_payments', dataTabId: 'payments', icon: 'bi bi-cash-stack' },
            { name: 'incoming_payments', dataTabId: 'payments/direction=in', icon: 'bi bi-cash-coin' },
            { name: 'outcoming_payments', dataTabId: 'payments/direction=out', icon: 'bi bi-send-check' },
            { name: 'journal_entries', dataTabId: 'journal_entry', icon: 'bi bi-journal-text' },
            { name: 'bank_statements', dataTabId: '', icon: 'bi bi-file-earmark-bar-graph' },
            { name: 'chart_of_accounts', dataTabId: 'chart_of_accounts', icon: 'bi bi-diagram-3' },
            { name: 'chart_of_accounts_types', dataTabId: 'account_types', icon: 'bi bi-tags' },
            { name: 'currencies', dataTabId: 'currencies', icon: 'bi bi-currency-exchange' },
            { name: 'payment_types', dataTabId: 'payment_types', icon: 'bi bi-credit-card' }
        ]
    },
    {
        name: 'sales_clients',
        icon: 'bi bi-person-workspace',
        children: [
            { name: 'clients', dataTabId: 'clients', icon: 'bi bi-people' },
            { name: 'sales_order', dataTabId: 'sales_orders', icon: 'bi bi-bag-check' },
            { name: 'condition_payment', dataTabId: 'condition_payment', icon: 'bi bi-ui-checks' },
            { name: 'payment_terms', dataTabId: 'payment_terms', icon: 'bi bi-calendar-check' },
            { name: 'payment_method', dataTabId: 'payment_methods', icon: 'bi bi-wallet2' },
            { name: 'invoice_status', dataTabId: 'invoice_statuses', icon: 'bi bi-clipboard-check' },
            { name: 'type_tax', dataTabId: 'type_tax', icon: 'bi bi-percent' }
        ]
    },
    {
        name: 'warehouse_stocks',
        icon: 'bi bi-collection',
        children: [
            { name: 'sales_order', dataTabId: 'sales_orders', icon: 'bi bi-bag-check' },
            { name: 'products', dataTabId: 'products', icon: 'bi bi-box-seam' },
            { name: 'stock_balances', dataTabId: 'stock', icon: 'bi bi-boxes' },
            { name: 'warehouses', dataTabId: 'locations', icon: 'bi bi-building' },
            { name: 'categories', dataTabId: 'categories', icon: 'bi bi-bookmarks' },
            { name: 'containers', dataTabId: 'containers', icon: 'bi bi-archive' },
            { name: 'pick_slot', dataTabId: 'pick_slot', icon: 'bi bi-grid-3x3-gap' },
            { name: 'units', dataTabId: 'units', icon: 'bi bi-rulers' }
        ]
    },
    {
        name: 'eCommerce',
        icon: 'bi bi-cart',
        children: [
            { name: 'products', dataTabId: 'products', icon: 'bi bi-box-seam' },
            { name: 'categories', dataTabId: 'categories', icon: 'bi bi-bookmarks' },
            { name: 'products_attributes', dataTabId: 'attr_types', icon: 'bi bi-sliders' },
            { name: 'values_attributes', dataTabId: 'attr_values', icon: 'bi bi-list-ul' },
            { name: 'blog', dataTabId: 'blog', icon: 'bi bi-pencil-square' },
            { name: 'banners', dataTabId: 'banners', icon: 'bi bi-image' },
            { name: 'settings', dataTabId: 'settings', icon: 'bi bi-gear' }
        ]
    },
    {
        name: 'analytics_reports',
        icon: 'bi bi-graph-up-arrow',
        children: [
            { name: 'trial_balance', dataTabId: 'report::trial_balance', icon: 'bi bi-bar-chart-line' },
            { name: 'liquidity_forecast', dataTabId: 'report::cash_position', icon: 'bi bi-graph-up' },
            { name: 'pnl', dataTabId: 'report::pl', icon: 'bi bi-pie-chart' },
            { name: 'cash_flow', dataTabId: 'report::cash_flow', icon: 'bi bi-water' },
            { name: 'employee_productivity', dataTabId: '', icon: 'bi bi-speedometer2' },
            { name: 'quotes', dataTabId: '', icon: 'bi bi-chat-quote' }
        ]
    },
    {
        name: 'users',
        icon: 'bi bi-people',
        children: [
            { name: 'partners', dataTabId: 'partners', icon: 'bi bi-person-vcard' },
            { name: 'users', dataTabId: 'users', icon: 'bi bi-people-fill' },
            { name: 'permissions', dataTabId: 'tree::permissions', icon: 'bi bi-shield-lock' }
        ]
    },
    {
        name: 'manufacturing',
        icon: 'bi bi-diagram-3',
        children: [
            { name: 'bom', dataTabId: 'bom', icon: 'bi bi-card-checklist' },
            { name: 'mfg_orders', dataTabId: 'mfg_orders', icon: 'bi bi-gear-wide-connected' }
        ]
    },
    {
        name: 'calendar',
        icon: 'bi bi-calendar2-week',
        children: [
            { name: 'Calendar', dataTabId: 'calendar::calendar', icon: 'bi bi-calendar-event' }
        ]
    },
    {
        name: 'CRM',
        icon: 'bi bi-kanban',
        children: [
            { name: 'kanban_bord', dataTabId: 'crm::kanban', icon: 'bi bi-kanban' },
            { name: 'leads', dataTabId: 'leads', icon: 'bi bi-funnel' },
            { name: 'clients', dataTabId: 'crm::clients', icon: 'bi bi-person-lines-fill' }
        ]
    },
    {
        name: 'HRM',
        icon: 'bi bi-people',
        children: [
            { name: 'kanban_bord', dataTabId: 'crm::kanban', icon: 'bi bi-kanban' },
            { name: 'employees', dataTabId: 'employees', icon: 'bi bi-person-badge' },
            { name: 'departments', dataTabId: 'departments', icon: 'bi bi-diagram-3' },
            { name: 'positions', dataTabId: 'positions', icon: 'bi bi-briefcase' },
            { name: 'absences', dataTabId: 'absences', icon: 'bi bi-calendar-x' },
            { name: 'absence_policies', dataTabId: 'absence_policies', icon: 'bi bi-sliders' },
            { name: 'performance', dataTabId: 'performance', icon: 'bi bi-graph-up-arrow' },
            { name: 'performance_reviews', dataTabId: 'hrm::performance_reviews', icon: 'bi bi-ui-checks-grid' },
            { name: 'clients', dataTabId: 'crm::clients', icon: 'bi bi-person-lines-fill' },
            { name: 'Calendar', dataTabId: 'calendar::calendar', icon: 'bi bi-calendar-event' }
        ]
    },
    {
        name: 'constructor',
        icon: 'bi bi-box',
        children: [
            { name: 'constructor_docs', dataTabId: 'constructor::constructor', icon: 'bi bi-file-earmark-code' },
            { name: 'constructor_site', dataTabId: 'constructor::site', icon: 'bi bi-window' },
            { name: 'constructor_workflow', dataTabId: 'constructor::workflow', icon: 'bi bi-diagram-2' },
            { name: 'constructor_workflow_lists', dataTabId: 'constructor::workflow_lists', icon: 'bi bi-list-columns-reverse' }
        ]
    },
    {
        name: 'iCloud',
        icon: 'bi bi-cloud-check',
        children: [
            { name: 'test 3', dataTabId: '', icon: 'bi bi-cloud' }
        ]
    },
    {
        name: 'iGaming',
        icon: 'bi bi-dice-6',
        children: [
            { name: 'test 3', dataTabId: '', icon: 'bi bi-controller' }
        ]
    },
    {
        name: 'chats',
        icon: 'bi bi-chat-dots',
        children: [
            { name: 'test 2', dataTabId: '', icon: 'bi bi-chat-left-text' }
        ]
    },
    {
        name: 'user_info',
        icon: 'bi bi-person',
        children: [
            { name: 'Child 3', dataTabId: '', icon: 'bi bi-person-badge' }
        ]
    },
    {
        name: 'settings',
        icon: 'bi bi-gear',
        children: [
            { name: 'Child 2', dataTabId: '', icon: 'bi bi-sliders2' },
            { name: 'items', dataTabId: 'items', icon: 'bi bi-list-stars' },
            { name: 'invoice_lines', dataTabId: 'invoice_lines', full: true, icon: 'bi bi-text-paragraph' }
        ]
    }
];
