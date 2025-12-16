// Kanban Board Application
// Advanced Task Manager with Multiple Boards, Custom Columns, Attachments, Comments, Assignments & Time Tracking

class KanbanBoard {
    constructor() {
        // Initialize boards from localStorage
        this.boards = JSON.parse(localStorage.getItem('kanbanBoards')) || [];
        this.currentBoardId = localStorage.getItem('currentBoardId') || null;
        
        // Initialize team members
        this.teamMembers = JSON.parse(localStorage.getItem('kanbanTeam')) || [];
        
        // Current edit state
        this.currentEditId = null;
        this.tempSubtasks = [];
        this.tempAttachments = [];
        this.tempComments = [];
        this.tempTimeEntries = [];
        
        // Timer state
        this.timerInterval = null;
        this.timerStartTime = null;

        // Available labels with colors
        this.labels = {
            bug: { name: 'Bug', color: '#f85149' },
            feature: { name: 'Feature', color: '#a371f7' },
            urgent: { name: 'Urgent', color: '#ff7b00' },
            improvement: { name: 'Improvement', color: '#58a6ff' },
            documentation: { name: 'Documentation', color: '#3fb950' }
        };

        // Default columns configuration
        this.defaultColumns = [
            { id: 'todo', name: 'To Do', icon: 'fa-clipboard-list' },
            { id: 'inprogress', name: 'In Progress', icon: 'fa-spinner' },
            { id: 'done', name: 'Done', icon: 'fa-check-circle' }
        ];

        // Create default board if none exists
        if (this.boards.length === 0) {
            this.createBoard('My Board', true);
        } else if (!this.currentBoardId || !this.boards.find(b => b.id === this.currentBoardId)) {
            this.currentBoardId = this.boards[0].id;
            localStorage.setItem('currentBoardId', this.currentBoardId);
        }

        // Initialize DOM elements
        this.initDOMElements();
        
        // Initialize the board
        this.init();
    }

    initDOMElements() {
        // DOM Elements - Theme Toggle
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');

        // DOM Elements - Board Selector
        this.boardMenuBtn = document.getElementById('boardMenuBtn');
        this.boardDropdown = document.getElementById('boardDropdown');
        this.boardList = document.getElementById('boardList');
        this.currentBoardName = document.getElementById('currentBoardName');
        this.newBoardBtn = document.getElementById('newBoardBtn');

        // DOM Elements - New Board Modal
        this.newBoardModal = document.getElementById('newBoardModal');
        this.newBoardInput = document.getElementById('newBoardInput');
        this.createBoardBtn = document.getElementById('createBoardBtn');
        this.cancelBoardBtn = document.getElementById('cancelBoardBtn');

        // DOM Elements - Add Column Modal
        this.addColumnModal = document.getElementById('addColumnModal');
        this.columnNameInput = document.getElementById('columnNameInput');
        this.iconOptions = document.getElementById('iconOptions');
        this.createColumnBtn = document.getElementById('createColumnBtn');
        this.cancelColumnBtn = document.getElementById('cancelColumnBtn');
        this.addColumnBtn = document.getElementById('addColumnBtn');

        // DOM Elements - Edit Column Modal
        this.editColumnModal = document.getElementById('editColumnModal');
        this.editColumnNameInput = document.getElementById('editColumnNameInput');
        this.saveColumnBtn = document.getElementById('saveColumnBtn');
        this.deleteColumnBtn = document.getElementById('deleteColumnBtn');
        this.cancelEditColumnBtn = document.getElementById('cancelEditColumnBtn');
        this.currentEditColumnId = null;

        // DOM Elements - Team Modal
        this.teamModal = document.getElementById('teamModal');
        this.teamList = document.getElementById('teamList');
        this.memberNameInput = document.getElementById('memberNameInput');
        this.memberInitialsInput = document.getElementById('memberInitialsInput');
        this.memberColorInput = document.getElementById('memberColorInput');
        this.addMemberBtn = document.getElementById('addMemberBtn');
        this.closeTeamModalBtn = document.getElementById('closeTeamModalBtn');
        this.manageTeamBtn = document.getElementById('manageTeamBtn');
        this.teamAvatars = document.getElementById('teamAvatars');

        // DOM Elements - Add Task
        this.taskInput = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.labelSelect = document.getElementById('labelSelect');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.descriptionInput = document.getElementById('descriptionInput');
        this.assigneeSelect = document.getElementById('assigneeSelect');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');

        // DOM Elements - Edit Modal
        this.editModal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editDescriptionInput = document.getElementById('editDescriptionInput');
        this.editPrioritySelect = document.getElementById('editPrioritySelect');
        this.editLabelSelect = document.getElementById('editLabelSelect');
        this.editDueDateInput = document.getElementById('editDueDateInput');
        this.editAssigneeSelect = document.getElementById('editAssigneeSelect');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');

        // DOM Elements - Subtasks
        this.subtasksList = document.getElementById('subtasksList');
        this.subtaskInput = document.getElementById('subtaskInput');
        this.addSubtaskBtn = document.getElementById('addSubtaskBtn');
        this.subtasksProgress = document.getElementById('subtasksProgress');

        // DOM Elements - Attachments
        this.attachmentsList = document.getElementById('attachmentsList');
        this.attachmentInput = document.getElementById('attachmentInput');

        // DOM Elements - Comments
        this.commentsList = document.getElementById('commentsList');
        this.commentInput = document.getElementById('commentInput');
        this.addCommentBtn = document.getElementById('addCommentBtn');
        this.commentsCount = document.getElementById('commentsCount');

        // DOM Elements - Time Tracking
        this.totalTimeDisplay = document.getElementById('totalTimeDisplay');
        this.startTimerBtn = document.getElementById('startTimerBtn');
        this.stopTimerBtn = document.getElementById('stopTimerBtn');
        this.currentTimer = document.getElementById('currentTimer');
        this.timeLog = document.getElementById('timeLog');
        this.manualHours = document.getElementById('manualHours');
        this.manualMinutes = document.getElementById('manualMinutes');
        this.addTimeBtn = document.getElementById('addTimeBtn');

        // DOM Elements - Search and Filter
        this.searchInput = document.getElementById('searchInput');
        this.filterPriority = document.getElementById('filterPriority');
        this.filterLabel = document.getElementById('filterLabel');
        this.filterAssignee = document.getElementById('filterAssignee');
        this.clearFiltersBtn = document.getElementById('clearFiltersBtn');

        // DOM Elements - Calendar View
        this.calendarViewBtn = document.getElementById('calendarViewBtn');
        this.calendarModal = document.getElementById('calendarModal');
        this.calendarGrid = document.getElementById('calendarGrid');
        this.calendarTitle = document.getElementById('calendarTitle');
        this.prevMonthBtn = document.getElementById('prevMonthBtn');
        this.nextMonthBtn = document.getElementById('nextMonthBtn');
        this.closeCalendarBtn = document.getElementById('closeCalendarBtn');
        this.currentCalendarDate = new Date();

        // DOM Elements - Notifications
        this.notificationBtn = document.getElementById('notificationBtn');
        this.notificationBadge = document.getElementById('notificationBadge');
        this.notificationModal = document.getElementById('notificationModal');
        this.enableNotifications = document.getElementById('enableNotifications');
        this.notifyBefore = document.getElementById('notifyBefore');
        this.notifyOverdue = document.getElementById('notifyOverdue');
        this.overdueSummary = document.getElementById('overdueSummary');
        this.saveNotificationBtn = document.getElementById('saveNotificationBtn');
        this.closeNotificationBtn = document.getElementById('closeNotificationBtn');

        // DOM Elements - Email Summary
        this.emailSummaryBtn = document.getElementById('emailSummaryBtn');
        this.emailModal = document.getElementById('emailModal');
        this.emailBoardSelect = document.getElementById('emailBoardSelect');
        this.includeTodo = document.getElementById('includeTodo');
        this.includeInProgress = document.getElementById('includeInProgress');
        this.includeDone = document.getElementById('includeDone');
        this.includeOverdue = document.getElementById('includeOverdue');
        this.emailPreview = document.getElementById('emailPreview');
        this.sendEmailBtn = document.getElementById('sendEmailBtn');
        this.copyEmailBtn = document.getElementById('copyEmailBtn');
        this.closeEmailBtn = document.getElementById('closeEmailBtn');

        // Notification settings
        this.notificationSettings = JSON.parse(localStorage.getItem('kanbanNotifications')) || {
            enabled: false,
            notifyBefore: 1,
            notifyOverdue: true
        };

        // Board container
        this.boardContainer = document.getElementById('board');
    }

    init() {
        // Initialize theme
        this.initTheme();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Board selector events
        this.boardMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.boardDropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => this.boardDropdown.classList.remove('active'));
        this.newBoardBtn.addEventListener('click', () => this.openNewBoardModal());
        this.createBoardBtn.addEventListener('click', () => this.createBoardFromModal());
        this.cancelBoardBtn.addEventListener('click', () => this.closeNewBoardModal());

        // Column events
        this.addColumnBtn.addEventListener('click', () => this.openAddColumnModal());
        this.createColumnBtn.addEventListener('click', () => this.createColumnFromModal());
        this.cancelColumnBtn.addEventListener('click', () => this.closeAddColumnModal());
        this.saveColumnBtn.addEventListener('click', () => this.saveColumnEdit());
        this.deleteColumnBtn.addEventListener('click', () => this.deleteColumn());
        this.cancelEditColumnBtn.addEventListener('click', () => this.closeEditColumnModal());

        // Icon picker
        this.iconOptions.querySelectorAll('.icon-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.iconOptions.querySelectorAll('.icon-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Team events
        this.manageTeamBtn.addEventListener('click', () => this.openTeamModal());
        this.addMemberBtn.addEventListener('click', () => this.addTeamMember());
        this.closeTeamModalBtn.addEventListener('click', () => this.closeTeamModal());

        // Add Task events
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());

        // Edit Modal events
        this.saveEditBtn.addEventListener('click', () => this.saveEdit());
        this.cancelEditBtn.addEventListener('click', () => this.closeModal());

        // Subtasks events
        this.addSubtaskBtn.addEventListener('click', () => this.addSubtask());
        this.subtaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addSubtask();
            }
        });

        // Attachments events
        this.attachmentInput.addEventListener('change', (e) => this.handleFileUpload(e));

        // Comments events
        this.addCommentBtn.addEventListener('click', () => this.addComment());
        this.commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.addComment();
            }
        });

        // Time tracking events
        this.startTimerBtn.addEventListener('click', () => this.startTimer());
        this.stopTimerBtn.addEventListener('click', () => this.stopTimer());
        this.addTimeBtn.addEventListener('click', () => this.addManualTime());

        // Search and Filter events
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.filterPriority.addEventListener('change', () => this.applyFilters());
        this.filterLabel.addEventListener('change', () => this.applyFilters());
        this.filterAssignee.addEventListener('change', () => this.applyFilters());
        this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());

        // Close modals when clicking outside
        [this.editModal, this.newBoardModal, this.addColumnModal, this.editColumnModal, this.teamModal, this.calendarModal, this.notificationModal, this.emailModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    if (modal === this.editModal) this.stopTimer();
                }
            });
        });

        // Calendar events
        this.calendarViewBtn.addEventListener('click', () => this.openCalendarModal());
        this.closeCalendarBtn.addEventListener('click', () => this.closeCalendarModal());
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));

        // Notification events
        this.notificationBtn.addEventListener('click', () => this.openNotificationModal());
        this.saveNotificationBtn.addEventListener('click', () => this.saveNotificationSettings());
        this.closeNotificationBtn.addEventListener('click', () => this.closeNotificationModal());

        // Email events
        this.emailSummaryBtn.addEventListener('click', () => this.openEmailModal());
        this.sendEmailBtn.addEventListener('click', () => this.sendEmail());
        this.copyEmailBtn.addEventListener('click', () => this.copyEmailToClipboard());
        this.closeEmailBtn.addEventListener('click', () => this.closeEmailModal());
        [this.emailBoardSelect, this.includeTodo, this.includeInProgress, this.includeDone, this.includeOverdue].forEach(el => {
            el.addEventListener('change', () => this.updateEmailPreview());
        });

        // Render board
        this.renderBoardList();
        this.renderTeamAvatars();
        this.updateAssigneeSelects();
        this.renderColumns();
        this.renderAllTasks();
        
        // Initialize notifications
        this.initNotifications();
        this.updateNotificationBadge();
    }

    // ==================== THEME ====================
    initTheme() {
        const savedTheme = localStorage.getItem('kanbanTheme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('kanbanTheme', theme);
        if (theme === 'dark') {
            this.themeIcon.classList.remove('fa-sun');
            this.themeIcon.classList.add('fa-moon');
        } else {
            this.themeIcon.classList.remove('fa-moon');
            this.themeIcon.classList.add('fa-sun');
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    // ==================== BOARDS ====================
    getCurrentBoard() {
        return this.boards.find(b => b.id === this.currentBoardId);
    }

    createBoard(name, isDefault = false) {
        const board = {
            id: this.generateId(),
            name: name,
            columns: [...this.defaultColumns],
            tasks: []
        };
        this.boards.push(board);
        if (isDefault || !this.currentBoardId) {
            this.currentBoardId = board.id;
            localStorage.setItem('currentBoardId', this.currentBoardId);
        }
        this.saveBoards();
        return board;
    }

    switchBoard(boardId) {
        this.currentBoardId = boardId;
        localStorage.setItem('currentBoardId', boardId);
        this.renderBoardList();
        this.renderColumns();
        this.renderAllTasks();
    }

    deleteBoard(boardId) {
        if (this.boards.length <= 1) {
            alert('You must have at least one board.');
            return;
        }
        if (confirm('Delete this board and all its tasks?')) {
            this.boards = this.boards.filter(b => b.id !== boardId);
            if (this.currentBoardId === boardId) {
                this.currentBoardId = this.boards[0].id;
                localStorage.setItem('currentBoardId', this.currentBoardId);
            }
            this.saveBoards();
            this.renderBoardList();
            this.renderColumns();
            this.renderAllTasks();
        }
    }

    renderBoardList() {
        this.boardList.innerHTML = '';
        this.boards.forEach(board => {
            const item = document.createElement('div');
            item.className = `board-item${board.id === this.currentBoardId ? ' active' : ''}`;
            item.innerHTML = `
                <span class="board-name">${this.escapeHtml(board.name)}</span>
                <button class="delete-board-btn" title="Delete board"><i class="fas fa-trash"></i></button>
            `;
            item.querySelector('.board-name').addEventListener('click', () => this.switchBoard(board.id));
            item.querySelector('.delete-board-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteBoard(board.id);
            });
            this.boardList.appendChild(item);
        });

        const currentBoard = this.getCurrentBoard();
        this.currentBoardName.textContent = currentBoard ? currentBoard.name : 'Select Board';
    }

    openNewBoardModal() {
        this.newBoardInput.value = '';
        this.newBoardModal.classList.add('active');
        this.newBoardInput.focus();
    }

    closeNewBoardModal() {
        this.newBoardModal.classList.remove('active');
    }

    createBoardFromModal() {
        const name = this.newBoardInput.value.trim();
        if (!name) {
            this.shakeElement(this.newBoardInput);
            return;
        }
        this.createBoard(name);
        this.switchBoard(this.boards[this.boards.length - 1].id);
        this.closeNewBoardModal();
    }

    saveBoards() {
        localStorage.setItem('kanbanBoards', JSON.stringify(this.boards));
        this.updateNotificationBadge();
    }

    // ==================== COLUMNS ====================
    renderColumns() {
        const board = this.getCurrentBoard();
        if (!board) return;

        this.boardContainer.innerHTML = '';
        board.columns.forEach(column => {
            const columnEl = document.createElement('div');
            columnEl.className = 'column';
            columnEl.id = column.id;
            columnEl.innerHTML = `
                <div class="column-header">
                    <h2><i class="fas ${column.icon}"></i> ${this.escapeHtml(column.name)}</h2>
                    <div class="column-actions">
                        <span class="task-count" id="${column.id}-count">0</span>
                        <button class="column-edit-btn" title="Edit column"><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                </div>
                <div class="task-list" id="${column.id}-list" data-status="${column.id}">
                </div>
            `;
            
            const editBtn = columnEl.querySelector('.column-edit-btn');
            editBtn.addEventListener('click', () => this.openEditColumnModal(column.id));
            
            const taskList = columnEl.querySelector('.task-list');
            this.setupDropZone(taskList);
            
            this.boardContainer.appendChild(columnEl);
        });
    }

    openAddColumnModal() {
        this.columnNameInput.value = '';
        this.iconOptions.querySelectorAll('.icon-option').forEach(b => b.classList.remove('selected'));
        this.iconOptions.querySelector('[data-icon="fa-clipboard-list"]').classList.add('selected');
        this.addColumnModal.classList.add('active');
        this.columnNameInput.focus();
    }

    closeAddColumnModal() {
        this.addColumnModal.classList.remove('active');
    }

    createColumnFromModal() {
        const name = this.columnNameInput.value.trim();
        if (!name) {
            this.shakeElement(this.columnNameInput);
            return;
        }
        const selectedIcon = this.iconOptions.querySelector('.icon-option.selected');
        const icon = selectedIcon ? selectedIcon.dataset.icon : 'fa-clipboard-list';
        
        const board = this.getCurrentBoard();
        const columnId = name.toLowerCase().replace(/\s+/g, '-') + '-' + this.generateId().substring(0, 4);
        board.columns.push({ id: columnId, name: name, icon: icon });
        this.saveBoards();
        this.renderColumns();
        this.renderAllTasks();
        this.closeAddColumnModal();
    }

    openEditColumnModal(columnId) {
        const board = this.getCurrentBoard();
        const column = board.columns.find(c => c.id === columnId);
        if (!column) return;

        this.currentEditColumnId = columnId;
        this.editColumnNameInput.value = column.name;
        this.editColumnModal.classList.add('active');
        this.editColumnNameInput.focus();
    }

    closeEditColumnModal() {
        this.editColumnModal.classList.remove('active');
        this.currentEditColumnId = null;
    }

    saveColumnEdit() {
        const name = this.editColumnNameInput.value.trim();
        if (!name) {
            this.shakeElement(this.editColumnNameInput);
            return;
        }
        const board = this.getCurrentBoard();
        const column = board.columns.find(c => c.id === this.currentEditColumnId);
        if (column) {
            column.name = name;
            this.saveBoards();
            this.renderColumns();
            this.renderAllTasks();
        }
        this.closeEditColumnModal();
    }

    deleteColumn() {
        const board = this.getCurrentBoard();
        if (board.columns.length <= 1) {
            alert('You must have at least one column.');
            return;
        }
        const tasksInColumn = board.tasks.filter(t => t.status === this.currentEditColumnId);
        if (tasksInColumn.length > 0) {
            if (!confirm(`This column has ${tasksInColumn.length} task(s). Delete them too?`)) {
                return;
            }
            board.tasks = board.tasks.filter(t => t.status !== this.currentEditColumnId);
        }
        board.columns = board.columns.filter(c => c.id !== this.currentEditColumnId);
        this.saveBoards();
        this.renderColumns();
        this.renderAllTasks();
        this.closeEditColumnModal();
    }

    // ==================== TEAM MEMBERS ====================
    renderTeamAvatars() {
        this.teamAvatars.innerHTML = '';
        this.teamMembers.slice(0, 5).forEach(member => {
            const avatar = document.createElement('div');
            avatar.className = 'team-avatar';
            avatar.style.backgroundColor = member.color;
            avatar.textContent = member.initials;
            avatar.title = member.name;
            this.teamAvatars.appendChild(avatar);
        });
        if (this.teamMembers.length > 5) {
            const more = document.createElement('div');
            more.className = 'team-avatar more';
            more.textContent = `+${this.teamMembers.length - 5}`;
            this.teamAvatars.appendChild(more);
        }
    }

    updateAssigneeSelects() {
        const options = '<option value="">Unassigned</option>' + 
            this.teamMembers.map(m => `<option value="${m.id}">${this.escapeHtml(m.name)}</option>`).join('');
        this.assigneeSelect.innerHTML = options;
        this.editAssigneeSelect.innerHTML = options;
        
        // Update filter
        this.filterAssignee.innerHTML = '<option value="all">All Assignees</option>' + 
            this.teamMembers.map(m => `<option value="${m.id}">${this.escapeHtml(m.name)}</option>`).join('');
    }

    openTeamModal() {
        this.renderTeamList();
        this.memberNameInput.value = '';
        this.memberInitialsInput.value = '';
        this.teamModal.classList.add('active');
    }

    closeTeamModal() {
        this.teamModal.classList.remove('active');
    }

    renderTeamList() {
        this.teamList.innerHTML = '';
        this.teamMembers.forEach(member => {
            const item = document.createElement('div');
            item.className = 'team-member-item';
            item.innerHTML = `
                <div class="member-avatar" style="background: ${member.color}">${member.initials}</div>
                <span class="member-name">${this.escapeHtml(member.name)}</span>
                <button class="delete-member-btn" title="Remove"><i class="fas fa-times"></i></button>
            `;
            item.querySelector('.delete-member-btn').addEventListener('click', () => this.removeTeamMember(member.id));
            this.teamList.appendChild(item);
        });
    }

    addTeamMember() {
        const name = this.memberNameInput.value.trim();
        let initials = this.memberInitialsInput.value.trim().toUpperCase();
        const color = this.memberColorInput.value;

        if (!name) {
            this.shakeElement(this.memberNameInput);
            return;
        }
        if (!initials) {
            initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        }

        this.teamMembers.push({
            id: this.generateId(),
            name: name,
            initials: initials,
            color: color
        });
        this.saveTeam();
        this.renderTeamList();
        this.renderTeamAvatars();
        this.updateAssigneeSelects();
        this.memberNameInput.value = '';
        this.memberInitialsInput.value = '';
    }

    removeTeamMember(memberId) {
        this.teamMembers = this.teamMembers.filter(m => m.id !== memberId);
        this.saveTeam();
        this.renderTeamList();
        this.renderTeamAvatars();
        this.updateAssigneeSelects();
    }

    saveTeam() {
        localStorage.setItem('kanbanTeam', JSON.stringify(this.teamMembers));
    }

    getMember(memberId) {
        return this.teamMembers.find(m => m.id === memberId);
    }

    // ==================== TASKS ====================
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addTask() {
        const board = this.getCurrentBoard();
        if (!board) return;

        const text = this.taskInput.value.trim();
        if (!text) {
            this.taskInput.focus();
            this.shakeElement(this.taskInput);
            return;
        }

        const firstColumn = board.columns[0];
        const task = {
            id: this.generateId(),
            text: text,
            description: this.descriptionInput.value.trim(),
            priority: this.prioritySelect.value,
            label: this.labelSelect.value,
            dueDate: this.dueDateInput.value || null,
            assignee: this.assigneeSelect.value || null,
            status: firstColumn.id,
            subtasks: [],
            attachments: [],
            comments: [],
            timeEntries: [],
            createdAt: new Date().toISOString()
        };

        board.tasks.push(task);
        this.saveBoards();
        this.renderTask(task, true);
        this.updateCounts();

        // Clear inputs
        this.taskInput.value = '';
        this.descriptionInput.value = '';
        this.labelSelect.value = '';
        this.dueDateInput.value = '';
        this.assigneeSelect.value = '';
        this.taskInput.focus();
    }

    isOverdue(dueDate) {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dueDate) < today;
    }

    isDueToday(dueDate) {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        return due.getTime() === today.getTime();
    }

    getSubtaskProgress(subtasks) {
        if (!subtasks || subtasks.length === 0) return null;
        const completed = subtasks.filter(s => s.completed).length;
        return { completed, total: subtasks.length };
    }

    getTotalTime(timeEntries) {
        if (!timeEntries || timeEntries.length === 0) return 0;
        return timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
    }

    formatTime(minutes) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    }

    renderTask(task, isNew = false) {
        const board = this.getCurrentBoard();
        const taskList = document.getElementById(`${task.status}-list`);
        if (!taskList) return;

        const taskCard = document.createElement('div');
        const isOverdue = this.isOverdue(task.dueDate) && task.status !== board.columns[board.columns.length - 1].id;
        const isDueToday = this.isDueToday(task.dueDate);

        taskCard.className = `task-card priority-${task.priority}${isNew ? ' new' : ''}${isOverdue ? ' overdue' : ''}${isDueToday ? ' due-today' : ''}`;
        taskCard.id = `task-${task.id}`;
        taskCard.draggable = true;

        const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' };
        const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        // Build components
        let dueDateHtml = '';
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dueDateHtml = `<span class="task-due-date ${isOverdue ? 'overdue' : isDueToday ? 'due-today' : ''}"><i class="fas fa-calendar"></i> ${dueDate}</span>`;
        }

        let labelHtml = '';
        if (task.label && this.labels[task.label]) {
            const label = this.labels[task.label];
            labelHtml = `<span class="task-label" style="background: ${label.color}20; color: ${label.color}">${label.name}</span>`;
        }

        let subtasksHtml = '';
        const progress = this.getSubtaskProgress(task.subtasks);
        if (progress) {
            const pct = (progress.completed / progress.total) * 100;
            subtasksHtml = `<div class="task-subtasks-preview"><i class="fas fa-list-check"></i><div class="subtasks-mini-progress"><div class="subtasks-mini-bar" style="width:${pct}%"></div></div><span>${progress.completed}/${progress.total}</span></div>`;
        }

        let descriptionHtml = '';
        if (task.description) {
            descriptionHtml = `<div class="task-description-preview"><p>${this.escapeHtml(task.description.substring(0, 80))}${task.description.length > 80 ? '...' : ''}</p></div>`;
        }

        let assigneeHtml = '';
        if (task.assignee) {
            const member = this.getMember(task.assignee);
            if (member) {
                assigneeHtml = `<div class="task-assignee" style="background:${member.color}" title="${this.escapeHtml(member.name)}">${member.initials}</div>`;
            }
        }

        let timeHtml = '';
        const totalTime = this.getTotalTime(task.timeEntries);
        if (totalTime > 0) {
            timeHtml = `<span class="task-time"><i class="fas fa-clock"></i> ${this.formatTime(totalTime)}</span>`;
        }

        let commentsHtml = '';
        if (task.comments && task.comments.length > 0) {
            commentsHtml = `<span class="task-comments-count"><i class="fas fa-comment"></i> ${task.comments.length}</span>`;
        }

        let attachmentsHtml = '';
        if (task.attachments && task.attachments.length > 0) {
            attachmentsHtml = `<span class="task-attachments-count"><i class="fas fa-paperclip"></i> ${task.attachments.length}</span>`;
        }

        let labelsRowHtml = '';
        if (labelHtml || dueDateHtml) {
            labelsRowHtml = `<div class="task-labels-row">${labelHtml}${dueDateHtml}</div>`;
        }

        let indicatorsHtml = '';
        if (commentsHtml || attachmentsHtml || timeHtml) {
            indicatorsHtml = `<div class="task-indicators">${commentsHtml}${attachmentsHtml}${timeHtml}</div>`;
        }

        taskCard.innerHTML = `
            <div class="task-content">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="edit-btn" title="Edit task"><i class="fas fa-pen"></i></button>
                    <button class="delete-btn" title="Delete task"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            ${descriptionHtml}
            ${labelsRowHtml}
            ${subtasksHtml}
            ${indicatorsHtml}
            <div class="task-meta">
                <span class="priority-badge ${task.priority}">${priorityLabels[task.priority]}</span>
                <span class="task-date">${createdDate}</span>
                ${assigneeHtml}
            </div>
        `;

        this.setupDragEvents(taskCard, task.id);
        taskCard.querySelector('.edit-btn').addEventListener('click', () => this.openEditModal(task.id));
        taskCard.querySelector('.delete-btn').addEventListener('click', () => this.deleteTask(task.id));

        taskList.appendChild(taskCard);
    }

    renderAllTasks() {
        const board = this.getCurrentBoard();
        if (!board) return;

        board.columns.forEach(col => {
            const list = document.getElementById(`${col.id}-list`);
            if (list) list.innerHTML = '';
        });

        board.tasks.forEach(task => this.renderTask(task));
        this.updateCounts();
    }

    applyFilters() {
        const board = this.getCurrentBoard();
        if (!board) return;

        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const priorityFilter = this.filterPriority.value;
        const labelFilter = this.filterLabel.value;
        const assigneeFilter = this.filterAssignee.value;

        board.columns.forEach(col => {
            const list = document.getElementById(`${col.id}-list`);
            if (list) list.innerHTML = '';
        });

        board.tasks.forEach(task => {
            let matches = true;

            if (searchTerm) {
                const textMatch = task.text.toLowerCase().includes(searchTerm);
                const descMatch = task.description && task.description.toLowerCase().includes(searchTerm);
                matches = textMatch || descMatch;
            }
            if (matches && priorityFilter !== 'all') matches = task.priority === priorityFilter;
            if (matches && labelFilter !== 'all') matches = task.label === labelFilter;
            if (matches && assigneeFilter !== 'all') matches = task.assignee === assigneeFilter;

            if (matches) this.renderTask(task);
        });

        this.updateCounts();
    }

    clearFilters() {
        this.searchInput.value = '';
        this.filterPriority.value = 'all';
        this.filterLabel.value = 'all';
        this.filterAssignee.value = 'all';
        this.renderAllTasks();
    }

    deleteTask(taskId) {
        const board = this.getCurrentBoard();
        const taskCard = document.getElementById(`task-${taskId}`);
        if (taskCard) {
            taskCard.style.transform = 'translateX(100px)';
            taskCard.style.opacity = '0';
            setTimeout(() => {
                board.tasks = board.tasks.filter(t => t.id !== taskId);
                this.saveBoards();
                taskCard.remove();
                this.updateCounts();
            }, 300);
        }
    }

    clearAllTasks() {
        const board = this.getCurrentBoard();
        if (!board || board.tasks.length === 0) return;
        if (confirm('Delete all tasks on this board?')) {
            board.tasks = [];
            this.saveBoards();
            this.renderAllTasks();
        }
    }

    updateCounts() {
        const board = this.getCurrentBoard();
        if (!board) return;

        board.columns.forEach(col => {
            const count = board.tasks.filter(t => t.status === col.id).length;
            const countEl = document.getElementById(`${col.id}-count`);
            if (countEl) countEl.textContent = count;
        });
    }

    // ==================== DRAG & DROP ====================
    setupDragEvents(taskCard, taskId) {
        taskCard.addEventListener('dragstart', (e) => {
            taskCard.classList.add('dragging');
            e.dataTransfer.setData('text/plain', taskId);
            e.dataTransfer.effectAllowed = 'move';
        });
        taskCard.addEventListener('dragend', () => taskCard.classList.remove('dragging'));
    }

    setupDropZone(list) {
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            list.classList.add('drag-over');
            const afterElement = this.getDragAfterElement(list, e.clientY);
            const draggingCard = document.querySelector('.dragging');
            if (draggingCard) {
                if (afterElement) list.insertBefore(draggingCard, afterElement);
                else list.appendChild(draggingCard);
            }
        });
        list.addEventListener('dragleave', (e) => {
            if (!list.contains(e.relatedTarget)) list.classList.remove('drag-over');
        });
        list.addEventListener('drop', (e) => {
            e.preventDefault();
            list.classList.remove('drag-over');
            const taskId = e.dataTransfer.getData('text/plain');
            const newStatus = list.dataset.status;
            this.moveTask(taskId, newStatus);
        });
    }

    getDragAfterElement(container, y) {
        const draggables = [...container.querySelectorAll('.task-card:not(.dragging)')];
        return draggables.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset, element: child };
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    moveTask(taskId, newStatus) {
        const board = this.getCurrentBoard();
        const task = board.tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            task.status = newStatus;
            this.saveBoards();
            this.updateCounts();
        }
    }

    // ==================== EDIT MODAL ====================
    openEditModal(taskId) {
        const board = this.getCurrentBoard();
        const task = board.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.currentEditId = taskId;
        this.editTaskInput.value = task.text;
        this.editDescriptionInput.value = task.description || '';
        this.editPrioritySelect.value = task.priority;
        this.editLabelSelect.value = task.label || '';
        this.editDueDateInput.value = task.dueDate || '';
        this.editAssigneeSelect.value = task.assignee || '';

        this.tempSubtasks = task.subtasks ? [...task.subtasks] : [];
        this.tempAttachments = task.attachments ? [...task.attachments] : [];
        this.tempComments = task.comments ? [...task.comments] : [];
        this.tempTimeEntries = task.timeEntries ? [...task.timeEntries] : [];

        this.renderSubtasks();
        this.renderAttachments();
        this.renderComments();
        this.renderTimeTracking();

        this.editModal.classList.add('active');
        this.editTaskInput.focus();
    }

    saveEdit() {
        const board = this.getCurrentBoard();
        const newText = this.editTaskInput.value.trim();
        if (!newText) {
            this.shakeElement(this.editTaskInput);
            return;
        }

        const task = board.tasks.find(t => t.id === this.currentEditId);
        if (task) {
            task.text = newText;
            task.description = this.editDescriptionInput.value.trim();
            task.priority = this.editPrioritySelect.value;
            task.label = this.editLabelSelect.value;
            task.dueDate = this.editDueDateInput.value || null;
            task.assignee = this.editAssigneeSelect.value || null;
            task.subtasks = [...this.tempSubtasks];
            task.attachments = [...this.tempAttachments];
            task.comments = [...this.tempComments];
            task.timeEntries = [...this.tempTimeEntries];
            this.saveBoards();
            this.renderAllTasks();
        }
        this.closeModal();
    }

    closeModal() {
        this.stopTimer();
        this.editModal.classList.remove('active');
        this.currentEditId = null;
        this.tempSubtasks = [];
        this.tempAttachments = [];
        this.tempComments = [];
        this.tempTimeEntries = [];
    }

    // ==================== SUBTASKS ====================
    addSubtask() {
        const text = this.subtaskInput.value.trim();
        if (!text) {
            this.shakeElement(this.subtaskInput);
            return;
        }
        this.tempSubtasks.push({ id: this.generateId(), text, completed: false });
        this.subtaskInput.value = '';
        this.renderSubtasks();
    }

    renderSubtasks() {
        this.subtasksList.innerHTML = '';
        this.tempSubtasks.forEach((subtask, index) => {
            const item = document.createElement('div');
            item.className = `subtask-item${subtask.completed ? ' completed' : ''}`;
            item.innerHTML = `
                <label class="subtask-checkbox"><input type="checkbox" ${subtask.completed ? 'checked' : ''}><span class="checkmark"></span></label>
                <span class="subtask-text">${this.escapeHtml(subtask.text)}</span>
                <button class="subtask-delete" title="Delete"><i class="fas fa-times"></i></button>
            `;
            item.querySelector('input').addEventListener('change', (e) => {
                this.tempSubtasks[index].completed = e.target.checked;
                this.renderSubtasks();
            });
            item.querySelector('.subtask-delete').addEventListener('click', () => {
                this.tempSubtasks.splice(index, 1);
                this.renderSubtasks();
            });
            this.subtasksList.appendChild(item);
        });
        const completed = this.tempSubtasks.filter(s => s.completed).length;
        this.subtasksProgress.textContent = `${completed}/${this.tempSubtasks.length}`;
    }

    // ==================== ATTACHMENTS ====================
    handleFileUpload(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large (max 5MB)`);
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                this.tempAttachments.push({
                    id: this.generateId(),
                    name: file.name,
                    type: file.type,
                    data: event.target.result,
                    addedAt: new Date().toISOString()
                });
                this.renderAttachments();
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    }

    renderAttachments() {
        this.attachmentsList.innerHTML = '';
        this.tempAttachments.forEach((att, index) => {
            const item = document.createElement('div');
            item.className = 'attachment-item';
            const isImage = att.type.startsWith('image/');
            item.innerHTML = `
                ${isImage ? `<img src="${att.data}" class="attachment-preview" alt="${this.escapeHtml(att.name)}">` : `<div class="attachment-icon"><i class="fas fa-file"></i></div>`}
                <span class="attachment-name">${this.escapeHtml(att.name)}</span>
                <button class="attachment-delete" title="Remove"><i class="fas fa-times"></i></button>
            `;
            item.querySelector('.attachment-delete').addEventListener('click', () => {
                this.tempAttachments.splice(index, 1);
                this.renderAttachments();
            });
            if (isImage) {
                item.querySelector('.attachment-preview').addEventListener('click', () => window.open(att.data, '_blank'));
            }
            this.attachmentsList.appendChild(item);
        });
    }

    // ==================== COMMENTS ====================
    addComment() {
        const text = this.commentInput.value.trim();
        if (!text) {
            this.shakeElement(this.commentInput);
            return;
        }
        this.tempComments.push({
            id: this.generateId(),
            text,
            author: 'You',
            createdAt: new Date().toISOString()
        });
        this.commentInput.value = '';
        this.renderComments();
    }

    renderComments() {
        this.commentsList.innerHTML = '';
        this.tempComments.forEach((comment, index) => {
            const item = document.createElement('div');
            item.className = 'comment-item';
            const date = new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            item.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${this.escapeHtml(comment.author)}</span>
                    <span class="comment-date">${date}</span>
                    <button class="comment-delete" title="Delete"><i class="fas fa-times"></i></button>
                </div>
                <p class="comment-text">${this.escapeHtml(comment.text)}</p>
            `;
            item.querySelector('.comment-delete').addEventListener('click', () => {
                this.tempComments.splice(index, 1);
                this.renderComments();
            });
            this.commentsList.appendChild(item);
        });
        this.commentsCount.textContent = this.tempComments.length;
    }

    // ==================== TIME TRACKING ====================
    renderTimeTracking() {
        const total = this.getTotalTime(this.tempTimeEntries);
        this.totalTimeDisplay.textContent = this.formatTime(total);
        this.currentTimer.textContent = '00:00:00';
        this.startTimerBtn.disabled = false;
        this.stopTimerBtn.disabled = true;

        this.timeLog.innerHTML = '';
        this.tempTimeEntries.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'time-entry';
            const date = new Date(entry.loggedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            item.innerHTML = `
                <span class="time-entry-duration">${this.formatTime(entry.duration)}</span>
                <span class="time-entry-date">${date}</span>
                <button class="time-entry-delete" title="Delete"><i class="fas fa-times"></i></button>
            `;
            item.querySelector('.time-entry-delete').addEventListener('click', () => {
                this.tempTimeEntries.splice(index, 1);
                this.renderTimeTracking();
            });
            this.timeLog.appendChild(item);
        });
    }

    startTimer() {
        this.timerStartTime = Date.now();
        this.startTimerBtn.disabled = true;
        this.stopTimerBtn.disabled = false;

        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.timerStartTime) / 1000);
            const h = Math.floor(elapsed / 3600);
            const m = Math.floor((elapsed % 3600) / 60);
            const s = elapsed % 60;
            this.currentTimer.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;

            if (this.timerStartTime) {
                const elapsed = Math.floor((Date.now() - this.timerStartTime) / 60000); // minutes
                if (elapsed > 0) {
                    this.tempTimeEntries.push({
                        id: this.generateId(),
                        duration: elapsed,
                        loggedAt: new Date().toISOString()
                    });
                }
                this.timerStartTime = null;
                this.renderTimeTracking();
            }
        }
        this.startTimerBtn.disabled = false;
        this.stopTimerBtn.disabled = true;
        this.currentTimer.textContent = '00:00:00';
    }

    addManualTime() {
        const hours = parseInt(this.manualHours.value) || 0;
        const minutes = parseInt(this.manualMinutes.value) || 0;
        const total = hours * 60 + minutes;

        if (total <= 0) {
            this.shakeElement(this.manualHours);
            return;
        }

        this.tempTimeEntries.push({
            id: this.generateId(),
            duration: total,
            loggedAt: new Date().toISOString()
        });

        this.manualHours.value = '';
        this.manualMinutes.value = '';
        this.renderTimeTracking();
    }

    // ==================== CALENDAR VIEW ====================
    openCalendarModal() {
        this.currentCalendarDate = new Date();
        this.renderCalendar();
        this.calendarModal.classList.add('active');
    }

    closeCalendarModal() {
        this.calendarModal.classList.remove('active');
    }

    changeMonth(delta) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + delta);
        this.renderCalendar();
    }

    renderCalendar() {
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        // Update title
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        this.calendarTitle.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day and days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Get all tasks with due dates
        const tasksWithDates = this.getAllTasksWithDueDates();
        
        // Build calendar grid
        let html = '';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<div class="calendar-day other-month"><span class="day-number">${day}</span></div>`;
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            const dateStr = this.formatDateForCompare(date);
            const isToday = date.getTime() === today.getTime();
            
            const dayTasks = tasksWithDates.filter(t => t.dueDateStr === dateStr);
            
            let tasksHtml = '<div class="calendar-tasks">';
            const maxTasks = 3;
            dayTasks.slice(0, maxTasks).forEach(task => {
                const isOverdue = date < today && task.status !== 'done';
                tasksHtml += `<div class="calendar-task ${task.priority}${isOverdue ? ' overdue' : ''}" 
                              title="${this.escapeHtml(task.text)}" 
                              data-task-id="${task.id}">${this.escapeHtml(task.text)}</div>`;
            });
            if (dayTasks.length > maxTasks) {
                tasksHtml += `<div class="calendar-more">+${dayTasks.length - maxTasks} more</div>`;
            }
            tasksHtml += '</div>';
            
            html += `<div class="calendar-day${isToday ? ' today' : ''}">
                <span class="day-number">${day}</span>
                ${tasksHtml}
            </div>`;
        }
        
        // Next month days
        const totalCells = firstDay + daysInMonth;
        const remainingCells = (7 - (totalCells % 7)) % 7;
        for (let day = 1; day <= remainingCells; day++) {
            html += `<div class="calendar-day other-month"><span class="day-number">${day}</span></div>`;
        }
        
        this.calendarGrid.innerHTML = html;
        
        // Add click events to calendar tasks
        this.calendarGrid.querySelectorAll('.calendar-task').forEach(taskEl => {
            taskEl.addEventListener('click', () => {
                const taskId = taskEl.dataset.taskId;
                this.closeCalendarModal();
                this.openEditModal(taskId);
            });
        });
    }

    getAllTasksWithDueDates() {
        const tasks = [];
        this.boards.forEach(board => {
            board.tasks.forEach(task => {
                if (task.dueDate) {
                    tasks.push({
                        ...task,
                        boardId: board.id,
                        boardName: board.name,
                        dueDateStr: task.dueDate
                    });
                }
            });
        });
        return tasks;
    }

    formatDateForCompare(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ==================== NOTIFICATIONS ====================
    initNotifications() {
        // Load settings
        this.enableNotifications.checked = this.notificationSettings.enabled;
        this.notifyBefore.value = this.notificationSettings.notifyBefore;
        this.notifyOverdue.checked = this.notificationSettings.notifyOverdue;
        
        // Check for due tasks periodically
        this.checkDueTasks();
        setInterval(() => this.checkDueTasks(), 60000); // Check every minute
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications.');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            return true;
        }
        
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        
        return false;
    }

    checkDueTasks() {
        if (!this.notificationSettings.enabled) return;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const notifyDays = parseInt(this.notificationSettings.notifyBefore);
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + notifyDays);
        
        const overdueTasks = [];
        const upcomingTasks = [];
        
        this.boards.forEach(board => {
            const lastColumnId = board.columns[board.columns.length - 1]?.id;
            board.tasks.forEach(task => {
                if (!task.dueDate || task.status === lastColumnId) return;
                
                const dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                
                if (dueDate < today && this.notificationSettings.notifyOverdue) {
                    overdueTasks.push({ ...task, boardName: board.name });
                } else if (dueDate <= futureDate && dueDate >= today) {
                    upcomingTasks.push({ ...task, boardName: board.name });
                }
            });
        });
        
        // Update badge
        this.updateNotificationBadge();
        
        // Show notifications (throttled to avoid spam)
        const lastNotified = localStorage.getItem('lastNotificationTime');
        const now = Date.now();
        const hoursSinceLastNotification = lastNotified ? (now - parseInt(lastNotified)) / (1000 * 60 * 60) : 24;
        
        if (hoursSinceLastNotification >= 1 && (overdueTasks.length > 0 || upcomingTasks.length > 0)) {
            if (Notification.permission === 'granted') {
                if (overdueTasks.length > 0) {
                    new Notification('⚠️ Overdue Tasks', {
                        body: `You have ${overdueTasks.length} overdue task(s)!`,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>'
                    });
                }
                if (upcomingTasks.length > 0) {
                    new Notification('📅 Upcoming Tasks', {
                        body: `${upcomingTasks.length} task(s) due soon!`,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>'
                    });
                }
                localStorage.setItem('lastNotificationTime', now.toString());
            }
        }
    }

    updateNotificationBadge() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let overdueCount = 0;
        this.boards.forEach(board => {
            const lastColumnId = board.columns[board.columns.length - 1]?.id;
            board.tasks.forEach(task => {
                if (!task.dueDate || task.status === lastColumnId) return;
                const dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                if (dueDate < today) overdueCount++;
            });
        });
        
        if (overdueCount > 0) {
            this.notificationBadge.textContent = overdueCount;
            this.notificationBadge.style.display = 'flex';
        } else {
            this.notificationBadge.style.display = 'none';
        }
    }

    openNotificationModal() {
        this.enableNotifications.checked = this.notificationSettings.enabled;
        this.notifyBefore.value = this.notificationSettings.notifyBefore;
        this.notifyOverdue.checked = this.notificationSettings.notifyOverdue;
        
        this.renderOverdueSummary();
        this.notificationModal.classList.add('active');
    }

    closeNotificationModal() {
        this.notificationModal.classList.remove('active');
    }

    async saveNotificationSettings() {
        if (this.enableNotifications.checked) {
            const granted = await this.requestNotificationPermission();
            if (!granted) {
                alert('Notification permission was denied. Please enable it in your browser settings.');
                this.enableNotifications.checked = false;
                return;
            }
        }
        
        this.notificationSettings = {
            enabled: this.enableNotifications.checked,
            notifyBefore: parseInt(this.notifyBefore.value),
            notifyOverdue: this.notifyOverdue.checked
        };
        
        localStorage.setItem('kanbanNotifications', JSON.stringify(this.notificationSettings));
        this.closeNotificationModal();
        this.checkDueTasks();
    }

    renderOverdueSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const overdueTasks = [];
        this.boards.forEach(board => {
            const lastColumnId = board.columns[board.columns.length - 1]?.id;
            board.tasks.forEach(task => {
                if (!task.dueDate || task.status === lastColumnId) return;
                const dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                if (dueDate < today) {
                    overdueTasks.push({ ...task, boardName: board.name, dueDate: dueDate });
                }
            });
        });
        
        if (overdueTasks.length === 0) {
            this.overdueSummary.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No overdue tasks 🎉</p>';
            return;
        }
        
        let html = `<div class="overdue-summary-title"><i class="fas fa-exclamation-triangle"></i> ${overdueTasks.length} Overdue Task(s)</div>`;
        overdueTasks.forEach(task => {
            const daysOverdue = Math.floor((today - task.dueDate) / (1000 * 60 * 60 * 24));
            html += `
                <div class="overdue-task-item">
                    <span class="overdue-task-name">${this.escapeHtml(task.text)}</span>
                    <span class="overdue-task-date">${daysOverdue} day(s) overdue</span>
                </div>
            `;
        });
        this.overdueSummary.innerHTML = html;
    }

    // ==================== EMAIL SUMMARY ====================
    openEmailModal() {
        this.updateEmailPreview();
        this.emailModal.classList.add('active');
    }

    closeEmailModal() {
        this.emailModal.classList.remove('active');
    }

    generateEmailContent() {
        const includeCurrentOnly = this.emailBoardSelect.value === 'current';
        const includeTodo = this.includeTodo.checked;
        const includeInProgress = this.includeInProgress.checked;
        const includeDone = this.includeDone.checked;
        const includeOverdueOnly = this.includeOverdue.checked;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const boardsToInclude = includeCurrentOnly 
            ? [this.getCurrentBoard()] 
            : this.boards;
        
        let subject = `Task Summary - ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
        let body = `KANBAN BOARD TASK SUMMARY\n`;
        body += `Generated: ${new Date().toLocaleString()}\n`;
        body += `${'='.repeat(50)}\n\n`;
        
        let totalTasks = 0;
        let overdueTasks = 0;
        
        boardsToInclude.forEach(board => {
            if (!board) return;
            
            const lastColumnId = board.columns[board.columns.length - 1]?.id;
            const firstColumnId = board.columns[0]?.id;
            
            let boardTasks = [];
            
            board.tasks.forEach(task => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < today && task.status !== lastColumnId;
                
                if (includeOverdueOnly && !isOverdue) return;
                
                const isTodo = task.status === firstColumnId;
                const isDone = task.status === lastColumnId;
                const isInProgress = !isTodo && !isDone;
                
                if ((includeTodo && isTodo) || (includeInProgress && isInProgress) || (includeDone && isDone)) {
                    boardTasks.push({ ...task, isOverdue, statusName: this.getColumnName(board, task.status) });
                    totalTasks++;
                    if (isOverdue) overdueTasks++;
                }
            });
            
            if (boardTasks.length > 0) {
                body += `📋 BOARD: ${board.name}\n`;
                body += `${'-'.repeat(40)}\n`;
                
                boardTasks.forEach(task => {
                    const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' };
                    body += `\n${priorityEmoji[task.priority] || '⚪'} ${task.text}\n`;
                    body += `   Status: ${task.statusName}\n`;
                    if (task.dueDate) {
                        body += `   Due: ${new Date(task.dueDate).toLocaleDateString()}`;
                        if (task.isOverdue) body += ` ⚠️ OVERDUE`;
                        body += `\n`;
                    }
                    if (task.description) {
                        body += `   Note: ${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}\n`;
                    }
                    if (task.assignee) {
                        const member = this.getMember(task.assignee);
                        if (member) body += `   Assigned: ${member.name}\n`;
                    }
                });
                body += `\n`;
            }
        });
        
        body += `${'='.repeat(50)}\n`;
        body += `SUMMARY: ${totalTasks} task(s)`;
        if (overdueTasks > 0) body += ` | ${overdueTasks} overdue`;
        body += `\n`;
        
        return { subject, body };
    }

    getColumnName(board, status) {
        const column = board.columns.find(c => c.id === status);
        return column ? column.name : status;
    }

    updateEmailPreview() {
        const { body } = this.generateEmailContent();
        this.emailPreview.textContent = body;
    }

    sendEmail() {
        const { subject, body } = this.generateEmailContent();
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
    }

    copyEmailToClipboard() {
        const { subject, body } = this.generateEmailContent();
        const fullContent = `Subject: ${subject}\n\n${body}`;
        
        navigator.clipboard.writeText(fullContent).then(() => {
            const originalText = this.copyEmailBtn.innerHTML;
            this.copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                this.copyEmailBtn.innerHTML = originalText;
            }, 2000);
        }).catch(() => {
            alert('Failed to copy to clipboard');
        });
    }

    // ==================== UTILITIES ====================
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    shakeElement(element) {
        element.style.animation = 'none';
        element.offsetHeight;
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => element.style.animation = '', 500);
    }
}

// Shake animation
const style = document.createElement('style');
style.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => new KanbanBoard());
