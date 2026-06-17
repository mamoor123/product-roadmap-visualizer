/* ============================================
   RoadmapFlow — Product Roadmap Visualizer
   Complete JavaScript Application
   ============================================ */

(function() {
    'use strict';

    // ============ Default Data ============
    const DEFAULT_COLUMNS = {
        quarters: [
            { id: 'q1', title: 'Q1 — Jan–Mar', color: '#6366f1', icon: '❄️' },
            { id: 'q2', title: 'Q2 — Apr–Jun', color: '#22c55e', icon: '🌸' },
            { id: 'q3', title: 'Q3 — Jul–Sep', color: '#f59e0b', icon: '☀️' },
            { id: 'q4', title: 'Q4 — Oct–Dec', color: '#ef4444', icon: '🍂' }
        ],
        months: [
            { id: 'jan', title: 'January', color: '#6366f1' },
            { id: 'feb', title: 'February', color: '#818cf8' },
            { id: 'mar', title: 'March', color: '#a78bfa' },
            { id: 'apr', title: 'April', color: '#22c55e' },
            { id: 'may', title: 'May', color: '#4ade80' },
            { id: 'jun', title: 'June', color: '#86efac' },
            { id: 'jul', title: 'July', color: '#f59e0b' },
            { id: 'aug', title: 'August', color: '#fbbf24' },
            { id: 'sep', title: 'September', color: '#fcd34d' },
            { id: 'oct', title: 'October', color: '#ef4444' },
            { id: 'nov', title: 'November', color: '#f87171' },
            { id: 'dec', title: 'December', color: '#fca5a5' }
        ],
        'now-next-later': [
            { id: 'now', title: 'Now', color: '#22c55e', icon: '🎯' },
            { id: 'next', title: 'Next', color: '#f59e0b', icon: '📋' },
            { id: 'later', title: 'Later', color: '#6366f1', icon: '🔮' }
        ]
    };

    const SAMPLE_ITEMS = [
        { id: 's1', title: 'User Authentication', desc: 'Implement OAuth2 login with Google and GitHub providers', category: 'feature', priority: 'high', points: 8, column: 'q1', tags: ['backend', 'security'], owner: 'Alice', status: 'done' },
        { id: 's2', title: 'Dashboard Analytics', desc: 'Build real-time analytics dashboard with charts and filters', category: 'feature', priority: 'high', points: 5, column: 'q1', tags: ['frontend', 'data'], owner: 'Bob', status: 'progress' },
        { id: 's3', title: 'API Rate Limiting', desc: 'Add rate limiting middleware to protect public endpoints', category: 'infrastructure', priority: 'medium', points: 3, column: 'q1', tags: ['backend', 'security'], owner: 'Charlie', status: 'todo' },
        { id: 's4', title: 'Mobile Responsive UI', desc: 'Redesign all pages for mobile-first responsive layout', category: 'enhancement', priority: 'high', points: 8, column: 'q2', tags: ['frontend', 'ux'], owner: 'Alice', status: 'progress' },
        { id: 's5', title: 'Search Optimization', desc: 'Implement Elasticsearch for full-text search across products', category: 'feature', priority: 'medium', points: 5, column: 'q2', tags: ['backend', 'performance'], owner: 'Dave', status: 'todo' },
        { id: 's6', title: 'Payment Gateway', desc: 'Integrate Stripe for subscription billing and one-time payments', category: 'feature', priority: 'high', points: 8, column: 'q2', tags: ['backend', 'payments'], owner: 'Eve', status: 'todo' },
        { id: 's7', title: 'Performance Audit', desc: 'Run Lighthouse audit and fix Core Web Vitals issues', category: 'research', priority: 'medium', points: 3, column: 'q3', tags: ['performance'], owner: 'Bob', status: 'todo' },
        { id: 's8', title: 'Dark Mode Support', desc: 'Add system-aware dark mode with manual toggle', category: 'enhancement', priority: 'low', points: 2, column: 'q3', tags: ['frontend', 'ux'], owner: 'Alice', status: 'todo' },
        { id: 's9', title: 'CI/CD Pipeline', desc: 'Set up GitHub Actions for automated testing and deployment', category: 'infrastructure', priority: 'medium', points: 5, column: 'q4', tags: ['devops'], owner: 'Charlie', status: 'todo' },
        { id: 's10', title: 'Documentation Site', desc: 'Build developer docs with interactive API explorer', category: 'feature', priority: 'low', points: 5, column: 'q4', tags: ['docs', 'frontend'], owner: 'Dave', status: 'todo' }
    ];

    const SAMPLE_BACKLOG = [
        { id: 'b1', title: 'Two-Factor Authentication', desc: 'Add TOTP-based 2FA for enhanced security', category: 'feature', priority: 'high', points: 5, tags: ['security'], owner: '' },
        { id: 'b2', title: 'Email Notifications', desc: 'Send transactional emails for key events', category: 'feature', priority: 'medium', points: 3, tags: ['backend'], owner: '' },
        { id: 'b3', title: 'Accessibility Audit', desc: 'WCAG 2.1 AA compliance review and fixes', category: 'research', priority: 'medium', points: 3, tags: ['a11y'], owner: '' }
    ];

    const MONTH_MAP = {
        jan: 'January', feb: 'February', mar: 'March', apr: 'April',
        may: 'May', jun: 'June', jul: 'July', aug: 'August',
        sep: 'September', oct: 'October', nov: 'November', dec: 'December'
    };

    const CATEGORY_ICONS = {
        feature: '🚀', enhancement: '✨', bugfix: '🐛', research: '🔬', infrastructure: '🏗️'
    };

    // ============ State ============
    let state = {
        items: [],
        backlog: [],
        period: 'quarters',
        view: 'board',
        theme: 'dark',
        title: 'Product Roadmap 2025',
        searchQuery: ''
    };

    // ============ DOM Cache ============
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ============ Init ============
    function init() {
        loadState();
        applyTheme();
        render();
        bindEvents();
        updateStats();
    }

    // ============ State Management ============
    function loadState() {
        try {
            const saved = localStorage.getItem('roadmapflow-data');
            if (saved) {
                const data = JSON.parse(saved);
                state.items = data.items || [];
                state.backlog = data.backlog || [];
                state.period = data.period || 'quarters';
                state.theme = data.theme || 'dark';
                state.title = data.title || 'Product Roadmap 2025';
            } else {
                state.items = JSON.parse(JSON.stringify(SAMPLE_ITEMS));
                state.backlog = JSON.parse(JSON.stringify(SAMPLE_BACKLOG));
            }
        } catch (e) {
            state.items = JSON.parse(JSON.stringify(SAMPLE_ITEMS));
            state.backlog = JSON.parse(JSON.stringify(SAMPLE_BACKLOG));
        }
    }

    function saveState() {
        localStorage.setItem('roadmapflow-data', JSON.stringify({
            items: state.items,
            backlog: state.backlog,
            period: state.period,
            theme: state.theme,
            title: state.title
        }));
    }

    // ============ Theme ============
    function applyTheme() {
        document.documentElement.setAttribute('data-theme', state.theme);
        const icon = $('#themeToggle i');
        icon.className = state.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        saveState();
    }

    // ============ Render ============
    function render() {
        renderBoard();
        renderTimeline();
        renderBacklog();
        renderAnalytics();
        updateStats();
        updatePeriodButtons();
        updateNavButtons();
        $('#roadmapTitle').textContent = state.title;
    }

    function getColumns() {
        return DEFAULT_COLUMNS[state.period] || DEFAULT_COLUMNS.quarters;
    }

    function renderBoard() {
        const board = $('#board');
        const columns = getColumns();
        const filtered = getFilteredItems();

        board.innerHTML = columns.map(col => {
            const colItems = filtered.filter(i => i.column === col.id);
            const totalPts = colItems.reduce((s, i) => s + (i.points || 0), 0);

            return `
                <div class="column" data-column="${col.id}">
                    <div class="column-head">
                        <div class="col-title-wrap">
                            <div class="col-dot" style="background:${col.color}"></div>
                            <span class="col-title">${col.icon || ''} ${col.title}</span>
                            <span class="col-count">${colItems.length}</span>
                            <span class="col-pts">${totalPts} pts</span>
                        </div>
                        <button class="col-add-btn" data-add-to="${col.id}" title="Add item to ${col.title}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="column-body" data-column="${col.id}">
                        ${colItems.length === 0 ? `
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <p>No items yet</p>
                            </div>
                        ` : colItems.map(item => renderCard(item)).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Bind drag events
        board.querySelectorAll('.column-body').forEach(body => {
            body.addEventListener('dragover', onDragOver);
            body.addEventListener('dragleave', onDragLeave);
            body.addEventListener('drop', onDrop);
        });

        board.querySelectorAll('.card').forEach(card => {
            card.addEventListener('dragstart', onDragStart);
            card.addEventListener('dragend', onDragEnd);
        });

        // Bind column add buttons
        board.querySelectorAll('.col-add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                openModal(null, btn.dataset.addTo);
            });
        });
    }

    function renderCard(item) {
        const priorityClass = `tag-priority-${item.priority}`;
        const catIcon = CATEGORY_ICONS[item.category] || '📌';
        const tags = (item.tags || []).map(t => `<span class="tag tag-custom">${t}</span>`).join('');
        const initials = item.owner ? item.owner.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '';

        return `
            <div class="card" draggable="true" data-id="${item.id}">
                <div class="card-head">
                    <span class="card-title">${item.title}</span>
                    <div class="card-actions">
                        <button class="card-action-btn edit" data-edit="${item.id}" title="Edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="card-action-btn delete" data-delete="${item.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${item.desc ? `<div class="card-desc">${item.desc}</div>` : ''}
                <div class="card-tags">
                    <span class="tag ${priorityClass}">${item.priority}</span>
                    <span class="tag tag-category">${catIcon} ${item.category}</span>
                    ${tags}
                </div>
                <div class="card-meta">
                    <span class="card-points"><i class="fas fa-cube"></i> ${item.points || 0} pts</span>
                    ${item.owner ? `<span class="card-owner"><span class="owner-avatar">${initials}</span> ${item.owner}</span>` : ''}
                </div>
            </div>
        `;
    }

    function renderTimeline() {
        const timeline = $('#timeline');
        const items = getFilteredItems();
        const columns = getColumns();

        if (state.period === 'months') {
            const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
            timeline.innerHTML = months.map(m => {
                const mItems = items.filter(i => i.column === m);
                return `
                    <div class="timeline-month">
                        <span class="timeline-label">${MONTH_MAP[m]}</span>
                        <div class="timeline-items">
                            ${mItems.length === 0 ? '<span style="color:var(--text-muted);font-size:12px">No items</span>' :
                              mItems.map(i => `
                                <div class="timeline-card" data-id="${i.id}">
                                    <div class="tc-title">${i.title}</div>
                                    <div class="tc-meta">
                                        <span>${CATEGORY_ICONS[i.category] || ''} ${i.category}</span>
                                        <span>${i.points || 0} pts</span>
                                        ${i.owner ? `<span>👤 ${i.owner}</span>` : ''}
                                    </div>
                                </div>
                              `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            timeline.innerHTML = columns.map(col => {
                const colItems = items.filter(i => i.column === col.id);
                return `
                    <div class="timeline-month">
                        <span class="timeline-label">${col.title}</span>
                        <div class="timeline-items">
                            ${colItems.length === 0 ? '<span style="color:var(--text-muted);font-size:12px">No items</span>' :
                              colItems.map(i => `
                                <div class="timeline-card" data-id="${i.id}">
                                    <div class="tc-title">${i.title}</div>
                                    <div class="tc-meta">
                                        <span>${CATEGORY_ICONS[i.category] || ''} ${i.category}</span>
                                        <span>${i.points || 0} pts</span>
                                        ${i.owner ? `<span>👤 ${i.owner}</span>` : ''}
                                    </div>
                                </div>
                              `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    function renderBacklog() {
        const list = $('#backlogList');
        const filtered = state.backlog.filter(i => {
            if (!state.searchQuery) return true;
            const q = state.searchQuery.toLowerCase();
            return i.title.toLowerCase().includes(q) || (i.desc || '').toLowerCase().includes(q);
        });

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Backlog is empty</p>
                </div>
            `;
            return;
        }

        list.innerHTML = filtered.map(item => `
            <div class="backlog-item" data-id="${item.id}">
                <span class="tag tag-priority-${item.priority}">${item.priority}</span>
                <span class="bi-title">${item.title}</span>
                <span class="bi-meta">
                    <span>${item.points || 0} pts</span>
                    ${(item.tags || []).map(t => `<span class="tag tag-custom">${t}</span>`).join('')}
                </span>
                <div class="bi-actions">
                    <button data-move-to-board="${item.id}" title="Move to Board">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="del" data-delete-backlog="${item.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Bind backlog events
        list.querySelectorAll('[data-move-to-board]').forEach(btn => {
            btn.addEventListener('click', () => moveBacklogToBoard(btn.dataset.moveToBoard));
        });
        list.querySelectorAll('[data-delete-backlog]').forEach(btn => {
            btn.addEventListener('click', () => {
                showConfirm('Delete Backlog Item', `Delete "${getItemTitle(btn.dataset.deleteBacklog, true)}"?`, () => {
                    state.backlog = state.backlog.filter(i => i.id !== btn.dataset.deleteBacklog);
                    saveState();
                    renderBacklog();
                    toast('Item deleted');
                });
            });
        });
    }

    function renderAnalytics() {
        const grid = $('#analyticsGrid');
        const items = state.items;
        const total = items.length;
        const totalPts = items.reduce((s, i) => s + (i.points || 0), 0);

        // Priority breakdown
        const high = items.filter(i => i.priority === 'high').length;
        const med = items.filter(i => i.priority === 'medium').length;
        const low = items.filter(i => i.priority === 'low').length;
        const maxPri = Math.max(high, med, low, 1);

        // Category breakdown
        const cats = {};
        items.forEach(i => { cats[i.category] = (cats[i.category] || 0) + 1; });
        const maxCat = Math.max(...Object.values(cats), 1);

        // Column distribution
        const cols = getColumns();
        const colData = cols.map(c => ({
            title: c.title,
            count: items.filter(i => i.column === c.id).length,
            pts: items.filter(i => i.column === c.id).reduce((s, i) => s + (i.points || 0), 0)
        }));
        const maxCol = Math.max(...colData.map(c => c.count), 1);

        // Owner breakdown
        const owners = {};
        items.forEach(i => { if (i.owner) owners[i.owner] = (owners[i.owner] || 0) + 1; });

        const catColors = { feature: '#6366f1', enhancement: '#22c55e', bugfix: '#ef4444', research: '#f59e0b', infrastructure: '#3b82f6' };

        grid.innerHTML = `
            <div class="analytics-card">
                <h3>Priority Distribution</h3>
                <div class="chart-bar-wrap">
                    <div class="chart-bar">
                        <span class="chart-bar-label">High</span>
                        <div class="chart-bar-track">
                            <div class="chart-bar-fill danger" style="width:${(high/maxPri)*100}%">${high}</div>
                        </div>
                    </div>
                    <div class="chart-bar">
                        <span class="chart-bar-label">Medium</span>
                        <div class="chart-bar-track">
                            <div class="chart-bar-fill warning" style="width:${(med/maxPri)*100}%">${med}</div>
                        </div>
                    </div>
                    <div class="chart-bar">
                        <span class="chart-bar-label">Low</span>
                        <div class="chart-bar-track">
                            <div class="chart-bar-fill success" style="width:${(low/maxPri)*100}%">${low}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="analytics-card">
                <h3>Category Breakdown</h3>
                <div class="chart-bar-wrap">
                    ${Object.entries(cats).map(([cat, count]) => `
                        <div class="chart-bar">
                            <span class="chart-bar-label">${CATEGORY_ICONS[cat] || ''} ${cat}</span>
                            <div class="chart-bar-track">
                                <div class="chart-bar-fill accent" style="width:${(count/maxCat)*100}%">${count}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="analytics-card">
                <h3>Overview</h3>
                <div class="donut-wrap">
                    <div class="donut">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" stroke-width="12"/>
                            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" stroke-width="12"
                                stroke-dasharray="${total > 0 ? (high/total)*314 : 0} ${total > 0 ? 314 - (high/total)*314 : 314}"
                                stroke-linecap="round"/>
                        </svg>
                        <div class="donut-center">
                            <div class="donut-val">${total}</div>
                            <div class="donut-lbl">items</div>
                        </div>
                    </div>
                    <div class="donut-legend">
                        <div class="legend-item"><div class="legend-dot" style="background:#ef4444"></div> High: ${high}</div>
                        <div class="legend-item"><div class="legend-dot" style="background:#f59e0b"></div> Medium: ${med}</div>
                        <div class="legend-item"><div class="legend-dot" style="background:#22c55e"></div> Low: ${low}</div>
                        <div class="legend-item"><div class="legend-dot" style="background:var(--accent)"></div> Total Points: ${totalPts}</div>
                    </div>
                </div>
            </div>

            <div class="analytics-card">
                <h3>Column Distribution</h3>
                <div class="chart-bar-wrap">
                    ${colData.map(c => `
                        <div class="chart-bar">
                            <span class="chart-bar-label">${c.title.split('—')[0].trim()}</span>
                            <div class="chart-bar-track">
                                <div class="chart-bar-fill info" style="width:${(c.count/maxCol)*100}%">${c.count} (${c.pts}pts)</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${Object.keys(owners).length > 0 ? `
            <div class="analytics-card">
                <h3>Team Workload</h3>
                <div class="chart-bar-wrap">
                    ${Object.entries(owners).map(([name, count]) => {
                        const maxOwn = Math.max(...Object.values(owners), 1);
                        return `
                            <div class="chart-bar">
                                <span class="chart-bar-label">${name}</span>
                                <div class="chart-bar-track">
                                    <div class="chart-bar-fill accent" style="width:${(count/maxOwn)*100}%">${count} items</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            ` : ''}
        `;
    }

    // ============ Stats ============
    function updateStats() {
        const items = state.items;
        $('#statTotal').textContent = items.length;
        $('#statPoints').textContent = items.reduce((s, i) => s + (i.points || 0), 0);
        $('#statHigh').textContent = items.filter(i => i.priority === 'high').length;
        $('#statDone').textContent = items.filter(i => i.status === 'done').length;
    }

    function updatePeriodButtons() {
        $$('.vs-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === state.period);
        });
    }

    function updateNavButtons() {
        $$('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === state.view);
        });
    }

    // ============ Filtering ============
    function getFilteredItems() {
        if (!state.searchQuery) return state.items;
        const q = state.searchQuery.toLowerCase();
        return state.items.filter(i =>
            i.title.toLowerCase().includes(q) ||
            (i.desc || '').toLowerCase().includes(q) ||
            (i.tags || []).some(t => t.toLowerCase().includes(q)) ||
            (i.owner || '').toLowerCase().includes(q) ||
            (i.category || '').toLowerCase().includes(q)
        );
    }

    // ============ Drag & Drop ============
    let draggedId = null;

    function onDragStart(e) {
        draggedId = e.target.dataset.id;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedId);
    }

    function onDragEnd(e) {
        e.target.classList.remove('dragging');
        $$('.column-body').forEach(b => b.classList.remove('drag-over'));
        draggedId = null;
    }

    function onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }

    function onDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    function onDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const newColumn = e.currentTarget.dataset.column;
        const itemId = e.dataTransfer.getData('text/plain');
        if (!itemId || !newColumn) return;

        const item = state.items.find(i => i.id === itemId);
        if (item) {
            item.column = newColumn;
            saveState();
            render();
            toast('Item moved');
        }
    }

    // ============ Modal ============
    let editingItem = null;

    function openModal(item, defaultColumn) {
        editingItem = item;
        const modal = $('#itemModal');
        const form = $('#itemForm');
        const title = $('#modalTitle');

        // Populate column select
        const colSelect = $('#itemColumn');
        const columns = getColumns();
        colSelect.innerHTML = columns.map(c => `<option value="${c.id}">${c.title}</option>`).join('');

        if (item) {
            title.textContent = 'Edit Item';
            $('#itemId').value = item.id;
            $('#itemTitle').value = item.title;
            $('#itemDesc').value = item.desc || '';
            $('#itemCategory').value = item.category || 'feature';
            $('#itemPriority').value = item.priority || 'medium';
            $('#itemPoints').value = item.points || 3;
            $('#itemColumn').value = item.column || columns[0].id;
            $('#itemTags').value = (item.tags || []).join(', ');
            $('#itemOwner').value = item.owner || '';
        } else {
            title.textContent = 'Add Roadmap Item';
            form.reset();
            $('#itemId').value = '';
            $('#itemColumn').value = defaultColumn || columns[0].id;
            $('#itemPoints').value = 3;
        }

        modal.classList.add('show');
        setTimeout(() => $('#itemTitle').focus(), 100);
    }

    function closeModal() {
        $('#itemModal').classList.remove('show');
        editingItem = null;
    }

    function saveItem(e) {
        e.preventDefault();
        const id = $('#itemId').value;
        const data = {
            title: $('#itemTitle').value.trim(),
            desc: $('#itemDesc').value.trim(),
            category: $('#itemCategory').value,
            priority: $('#itemPriority').value,
            points: parseInt($('#itemPoints').value) || 3,
            column: $('#itemColumn').value,
            tags: $('#itemTags').value.split(',').map(t => t.trim()).filter(Boolean),
            owner: $('#itemOwner').value.trim(),
            status: 'todo'
        };

        if (!data.title) return;

        if (id) {
            const item = state.items.find(i => i.id === id);
            if (item) {
                Object.assign(item, data);
                if (!item.status) item.status = 'todo';
            }
            toast('Item updated');
        } else {
            data.id = 'item-' + Date.now();
            state.items.push(data);
            toast('Item added');
        }

        saveState();
        render();
        closeModal();
    }

    // ============ Delete ============
    function deleteItem(id) {
        const item = state.items.find(i => i.id === id);
        if (!item) return;
        showConfirm('Delete Item', `Delete "${item.title}"?`, () => {
            state.items = state.items.filter(i => i.id !== id);
            saveState();
            render();
            toast('Item deleted');
        });
    }

    // ============ Backlog ============
    function openBacklogModal() {
        const modal = $('#itemModal');
        const form = $('#itemForm');
        $('#modalTitle').textContent = 'Add to Backlog';
        form.reset();
        $('#itemId').value = 'backlog-new';
        $('#itemColumn').value = getColumns()[0].id;
        $('#itemPoints').value = 3;
        // Hide column field for backlog
        const colField = $('#itemColumn').closest('.field');
        if (colField) colField.style.display = 'none';
        modal.classList.add('show');
    }

    function moveBacklogToBoard(id) {
        const item = state.backlog.find(i => i.id === id);
        if (!item) return;
        item.column = getColumns()[0].id;
        item.status = 'todo';
        state.items.push(item);
        state.backlog = state.backlog.filter(i => i.id !== id);
        saveState();
        render();
        toast('Moved to board');
    }

    // ============ Confirm Dialog ============
    let confirmCallback = null;

    function showConfirm(title, msg, onYes) {
        $('#confirmTitle').textContent = title;
        $('#confirmMsg').textContent = msg;
        confirmCallback = onYes;
        $('#confirmDialog').classList.add('show');
    }

    function closeConfirm() {
        $('#confirmDialog').classList.remove('show');
        confirmCallback = null;
    }

    // ============ Toast ============
    function toast(msg) {
        const t = $('#toast');
        $('#toastMsg').textContent = msg;
        t.classList.add('show');
        clearTimeout(t._timer);
        t._timer = setTimeout(() => t.classList.remove('show'), 2500);
    }

    // ============ Share ============
    function openShareModal() {
        const url = window.location.href;
        $('#shareLink').value = url;
        $('#embedCode').value = `<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`;
        $('#shareModal').classList.add('show');
    }

    // ============ Export/Import ============
    function exportJSON() {
        const data = { items: state.items, backlog: state.backlog, period: state.period, title: state.title };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'roadmapflow-export.json';
        a.click();
        URL.revokeObjectURL(url);
        toast('Exported!');
    }

    function importJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.items) state.items = data.items;
                if (data.backlog) state.backlog = data.backlog;
                if (data.period) state.period = data.period;
                if (data.title) state.title = data.title;
                saveState();
                render();
                toast('Imported!');
            } catch (err) {
                toast('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    }

    // ============ Helpers ============
    function getItemTitle(id, isBacklog) {
        const list = isBacklog ? state.backlog : state.items;
        const item = list.find(i => i.id === id);
        return item ? item.title : id;
    }

    // ============ Event Binding ============
    function bindEvents() {
        // Theme
        $('#themeToggle').addEventListener('click', toggleTheme);

        // Navigation
        $$('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.view = btn.dataset.view;
                $$('.view').forEach(v => v.classList.remove('active'));
                $(`#view-${state.view}`).classList.add('active');
                updateNavButtons();
            });
        });

        // Period switcher
        $$('.vs-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.period = btn.dataset.period;
                saveState();
                render();
            });
        });

        // Add item
        $('#addItemBtn').addEventListener('click', () => openModal(null));
        $('#addBacklogBtn').addEventListener('click', openBacklogModal);

        // Modal
        $('#modalClose').addEventListener('click', closeModal);
        $('#modalCancel').addEventListener('click', closeModal);
        $('#itemForm').addEventListener('submit', saveItem);
        $('#itemModal').addEventListener('click', (e) => {
            if (e.target === $('#itemModal')) closeModal();
        });

        // Confirm dialog
        $('#confirmYes').addEventListener('click', () => {
            if (confirmCallback) confirmCallback();
            closeConfirm();
        });
        $('#confirmNo').addEventListener('click', closeConfirm);
        $('#confirmDialog').addEventListener('click', (e) => {
            if (e.target === $('#confirmDialog')) closeConfirm();
        });

        // Share
        $('#shareBtn').addEventListener('click', openShareModal);
        $('#shareModalClose').addEventListener('click', () => $('#shareModal').classList.remove('show'));
        $('#shareModal').addEventListener('click', (e) => {
            if (e.target === $('#shareModal')) $('#shareModal').classList.remove('show');
        });
        $('#copyLinkBtn').addEventListener('click', () => {
            navigator.clipboard.writeText($('#shareLink').value);
            toast('Link copied!');
        });
        $('#shareTwitter').addEventListener('click', () => {
            window.open(`https://twitter.com/intent/tweet?text=Check out my product roadmap&url=${encodeURIComponent(window.location.href)}`);
        });
        $('#shareLinkedin').addEventListener('click', () => {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`);
        });
        $('#shareSlack').addEventListener('click', () => {
            navigator.clipboard.writeText($('#shareLink').value);
            toast('Link copied — paste in Slack!');
        });

        // Settings
        $('#settingsBtn').addEventListener('click', () => {
            $('#settingName').value = state.title;
            $('#settingView').value = state.period;
            $('#settingsModal').classList.add('show');
        });
        $('#settingsModalClose').addEventListener('click', () => $('#settingsModal').classList.remove('show'));
        $('#settingsModal').addEventListener('click', (e) => {
            if (e.target === $('#settingsModal')) $('#settingsModal').classList.remove('show');
        });
        $('#settingName').addEventListener('change', (e) => {
            state.title = e.target.value;
            $('#roadmapTitle').textContent = state.title;
            saveState();
        });
        $('#settingView').addEventListener('change', (e) => {
            state.period = e.target.value;
            saveState();
            render();
        });
        $('#exportJsonBtn').addEventListener('click', exportJSON);
        $('#importJsonBtn').addEventListener('click', () => $('#importFile').click());
        $('#importFile').addEventListener('change', (e) => {
            if (e.target.files[0]) importJSON(e.target.files[0]);
        });
        $('#clearDataBtn').addEventListener('click', () => {
            showConfirm('Clear All Data', 'This will delete all items and reset to defaults. Continue?', () => {
                localStorage.removeItem('roadmapflow-data');
                state.items = JSON.parse(JSON.stringify(SAMPLE_ITEMS));
                state.backlog = JSON.parse(JSON.stringify(SAMPLE_BACKLOG));
                state.period = 'quarters';
                state.title = 'Product Roadmap 2025';
                saveState();
                render();
                toast('Data cleared');
            });
        });

        // Search
        $('#searchInput').addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            render();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                $('#searchInput').focus();
            }
            if (e.key === 'Escape') {
                closeModal();
                closeConfirm();
                $('#shareModal').classList.remove('show');
                $('#settingsModal').classList.remove('show');
            }
            if (e.key === 'n' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                openModal(null);
            }
        });

        // Edit title
        $('#editTitleBtn').addEventListener('click', () => {
            const newTitle = prompt('Enter roadmap name:', state.title);
            if (newTitle && newTitle.trim()) {
                state.title = newTitle.trim();
                $('#roadmapTitle').textContent = state.title;
                saveState();
            }
        });

        // Mobile menu
        $('#menuBtn').addEventListener('click', () => {
            $('#sidebar').classList.toggle('open');
        });

        // Close sidebar on nav click (mobile)
        $$('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    $('#sidebar').classList.remove('open');
                }
            });
        });

        // Delegated events for cards
        document.addEventListener('click', (e) => {
            const editBtn = e.target.closest('[data-edit]');
            if (editBtn) {
                const item = state.items.find(i => i.id === editBtn.dataset.edit);
                if (item) openModal(item);
            }

            const deleteBtn = e.target.closest('[data-delete]');
            if (deleteBtn) {
                deleteItem(deleteBtn.dataset.delete);
            }
        });

        // Export PNG
        $('#exportBtn').addEventListener('click', () => {
            // Simple print-to-PDF approach
            window.print();
        });
    }

    // ============ Start ============
    document.addEventListener('DOMContentLoaded', init);
})();
