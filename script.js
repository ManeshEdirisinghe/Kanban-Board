// Kanban Board Application
// Task Manager with Drag and Drop functionality

class KanbanBoard {
    constructor() {
        // Initialize tasks from localStorage or empty array
        this.tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
        this.currentEditId = null;
        this.tempSubtasks = [];

        // Available labels with colors
        this.labels = {
            bug: { name: 'Bug', color: '#f85149' },
            feature: { name: 'Feature', color: '#a371f7' },
            urgent: { name: 'Urgent', color: '#ff7b00' },
            improvement: { name: 'Improvement', color: '#58a6ff' },
            documentation: { name: 'Documentation', color: '#3fb950' }
        };

        // DOM Elements - Add Task
        this.taskInput = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.labelSelect = document.getElementById('labelSelect');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.descriptionInput = document.getElementById('descriptionInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');

        // DOM Elements - Edit Modal
        this.editModal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editDescriptionInput = document.getElementById('editDescriptionInput');
        this.editPrioritySelect = document.getElementById('editPrioritySelect');
        this.editLabelSelect = document.getElementById('editLabelSelect');
        this.editDueDateInput = document.getElementById('editDueDateInput');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');

        // DOM Elements - Subtasks
        this.subtasksList = document.getElementById('subtasksList');
        this.subtaskInput = document.getElementById('subtaskInput');
        this.addSubtaskBtn = document.getElementById('addSubtaskBtn');
        this.subtasksProgress = document.getElementById('subtasksProgress');

        // DOM Elements - Search and Filter
        this.searchInput = document.getElementById('searchInput');
        this.filterPriority = document.getElementById('filterPriority');
        this.filterLabel = document.getElementById('filterLabel');
        this.filterDate = document.getElementById('filterDate');
        this.clearFiltersBtn = document.getElementById('clearFiltersBtn');

        // DOM Elements - Theme Toggle
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');

        // Task lists
        this.taskLists = {
            todo: document.getElementById('todo-list'),
            inprogress: document.getElementById('inprogress-list'),
            done: document.getElementById('done-list')
        };

        // Initialize the board
        this.init();
    }

    init() {
        // Bind event listeners - Add Task
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());

        // Bind event listeners - Edit Modal
        this.saveEditBtn.addEventListener('click', () => this.saveEdit());
        this.cancelEditBtn.addEventListener('click', () => this.closeModal());

        // Bind event listeners - Subtasks
        this.addSubtaskBtn.addEventListener('click', () => this.addSubtask());
        this.subtaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addSubtask();
            }
        });

        // Bind event listeners - Search and Filter
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.filterPriority.addEventListener('change', () => this.applyFilters());
        this.filterLabel.addEventListener('change', () => this.applyFilters());
        this.filterDate.addEventListener('change', () => this.applyFilters());
        this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());

        // Bind event listeners - Theme Toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Initialize theme from localStorage
        this.initTheme();

        // Close modal when clicking outside
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeModal();
        });

        // Setup drag and drop for all task lists
        Object.values(this.taskLists).forEach(list => {
            this.setupDropZone(list);
        });

        // Render existing tasks
        this.renderAllTasks();
    }

    // Initialize theme from localStorage
    initTheme() {
        const savedTheme = localStorage.getItem('kanbanTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    // Toggle between light and dark theme
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('kanbanTheme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    // Update the theme toggle icon
    updateThemeIcon(theme) {
        if (theme === 'light') {
            this.themeIcon.classList.remove('fa-moon');
            this.themeIcon.classList.add('fa-sun');
        } else {
            this.themeIcon.classList.remove('fa-sun');
            this.themeIcon.classList.add('fa-moon');
        }
    }

    // Generate unique ID for tasks
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Add new task
    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) {
            this.taskInput.focus();
            this.shakeElement(this.taskInput);
            return;
        }

        const task = {
            id: this.generateId(),
            text: text,
            description: this.descriptionInput.value.trim(),
            priority: this.prioritySelect.value,
            label: this.labelSelect.value,
            dueDate: this.dueDateInput.value || null,
            status: 'todo',
            subtasks: [],
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTask(task, true);
        this.updateCounts();

        // Clear inputs
        this.taskInput.value = '';
        this.descriptionInput.value = '';
        this.labelSelect.value = '';
        this.dueDateInput.value = '';
        this.taskInput.focus();
    }

    // Check if task is overdue
    isOverdue(dueDate) {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        return due < today;
    }

    // Check if task is due today
    isDueToday(dueDate) {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        return due.getTime() === today.getTime();
    }

    // Check if task is due this week
    isDueThisWeek(dueDate) {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        const due = new Date(dueDate);
        return due >= today && due <= weekEnd;
    }

    // Get subtask completion info
    getSubtaskProgress(subtasks) {
        if (!subtasks || subtasks.length === 0) return null;
        const completed = subtasks.filter(s => s.completed).length;
        return { completed, total: subtasks.length };
    }

    // Render a single task
    renderTask(task, isNew = false) {
        const taskCard = document.createElement('div');
        const isOverdue = this.isOverdue(task.dueDate) && task.status !== 'done';
        const isDueToday = this.isDueToday(task.dueDate);

        taskCard.className = `task-card priority-${task.priority}${isNew ? ' new' : ''}${isOverdue ? ' overdue' : ''}${isDueToday ? ' due-today' : ''}`;
        taskCard.id = `task-${task.id}`;
        taskCard.draggable = true;

        const priorityLabels = {
            low: 'Low',
            medium: 'Medium',
            high: 'High'
        };

        const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        // Build due date HTML
        let dueDateHtml = '';
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            const dueDateClass = isOverdue ? 'overdue' : (isDueToday ? 'due-today' : '');
            dueDateHtml = `<span class="task-due-date ${dueDateClass}"><i class="fas fa-calendar"></i> ${dueDate}</span>`;
        }

        // Build label HTML
        let labelHtml = '';
        if (task.label && this.labels[task.label]) {
            const label = this.labels[task.label];
            labelHtml = `<span class="task-label" style="background: ${label.color}20; color: ${label.color}">${label.name}</span>`;
        }

        // Build subtasks progress HTML
        let subtasksHtml = '';
        const progress = this.getSubtaskProgress(task.subtasks);
        if (progress) {
            const percentage = (progress.completed / progress.total) * 100;
            subtasksHtml = `
                <div class="task-subtasks-preview">
                    <i class="fas fa-list-check"></i>
                    <div class="subtasks-mini-progress">
                        <div class="subtasks-mini-bar" style="width: ${percentage}%"></div>
                    </div>
                    <span>${progress.completed}/${progress.total}</span>
                </div>
            `;
        }

        // Build description preview HTML
        let descriptionHtml = '';
        if (task.description) {
            descriptionHtml = `
                <div class="task-description-preview">
                    <p>${this.escapeHtml(task.description.substring(0, 100))}${task.description.length > 100 ? '...' : ''}</p>
                </div>
            `;
        }

        // Build labels row HTML
        let labelsRowHtml = '';
        if (labelHtml || dueDateHtml) {
            labelsRowHtml = `<div class="task-labels-row">${labelHtml}${dueDateHtml}</div>`;
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
            <div class="task-meta">
                <span class="priority-badge ${task.priority}">${priorityLabels[task.priority]}</span>
                <span class="task-date">${createdDate}</span>
            </div>
        `;

        // Add event listeners
        this.setupDragEvents(taskCard, task.id);

        const editBtn = taskCard.querySelector('.edit-btn');
        const deleteBtn = taskCard.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => this.openEditModal(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        // Append to correct list
        this.taskLists[task.status].appendChild(taskCard);
    }
        const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        taskCard.innerHTML = `
            <div class="task-content">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="edit-btn" title="Edit task"><i class="fas fa-pen"></i></button>
                    <button class="delete-btn" title="Delete task"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="task-meta">
                <span class="priority-badge ${task.priority}">${priorityLabels[task.priority]}</span>
                <span class="task-date">${createdDate}</span>
            </div>
        `;

        // Add event listeners
        this.setupDragEvents(taskCard, task.id);
        
        const editBtn = taskCard.querySelector('.edit-btn');
        const deleteBtn = taskCard.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => this.openEditModal(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        // Append to correct list
        this.taskLists[task.status].appendChild(taskCard);
    }

    // Render all tasks
    renderAllTasks() {
        // Clear all lists
        Object.values(this.taskLists).forEach(list => {
            list.innerHTML = '';
        });

        // Render each task
        this.tasks.forEach(task => this.renderTask(task));
        this.updateCounts();
    }

    // Apply search and filters
    applyFilters() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const priorityFilter = this.filterPriority.value;
        const labelFilter = this.filterLabel.value;
        const dateFilter = this.filterDate.value;

        // Clear all lists
        Object.values(this.taskLists).forEach(list => {
            list.innerHTML = '';
        });

        // Filter and render tasks
        this.tasks.forEach(task => {
            let matches = true;

            // Search filter
            if (searchTerm) {
                const textMatch = task.text.toLowerCase().includes(searchTerm);
                const descMatch = task.description && task.description.toLowerCase().includes(searchTerm);
                matches = textMatch || descMatch;
            }

            // Priority filter
            if (matches && priorityFilter !== 'all') {
                matches = task.priority === priorityFilter;
            }

            // Label filter
            if (matches && labelFilter !== 'all') {
                matches = task.label === labelFilter;
            }

            // Date filter
            if (matches && dateFilter !== 'all') {
                switch (dateFilter) {
                    case 'overdue':
                        matches = this.isOverdue(task.dueDate) && task.status !== 'done';
                        break;
                    case 'today':
                        matches = this.isDueToday(task.dueDate);
                        break;
                    case 'week':
                        matches = this.isDueThisWeek(task.dueDate);
                        break;
                    case 'nodate':
                        matches = !task.dueDate;
                        break;
                }
            }

            if (matches) {
                this.renderTask(task);
            }
        });

        this.updateCounts();
    }

    // Clear all filters
    clearFilters() {
        this.searchInput.value = '';
        this.filterPriority.value = 'all';
        this.filterLabel.value = 'all';
        this.filterDate.value = 'all';
        this.renderAllTasks();
    }

    // Setup drag events for a task card
    setupDragEvents(taskCard, taskId) {
        taskCard.addEventListener('dragstart', (e) => {
            taskCard.classList.add('dragging');
            e.dataTransfer.setData('text/plain', taskId);
            e.dataTransfer.effectAllowed = 'move';
        });

        taskCard.addEventListener('dragend', () => {
            taskCard.classList.remove('dragging');
        });
    }

    // Setup drop zone for a task list
    setupDropZone(list) {
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            list.classList.add('drag-over');

            // Find the element to insert before
            const afterElement = this.getDragAfterElement(list, e.clientY);
            const draggingCard = document.querySelector('.dragging');
            
            if (draggingCard) {
                if (afterElement) {
                    list.insertBefore(draggingCard, afterElement);
                } else {
                    list.appendChild(draggingCard);
                }
            }
        });

        list.addEventListener('dragleave', (e) => {
            if (!list.contains(e.relatedTarget)) {
                list.classList.remove('drag-over');
            }
        });

        list.addEventListener('drop', (e) => {
            e.preventDefault();
            list.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            const newStatus = list.dataset.status;
            
            this.moveTask(taskId, newStatus);
        });
    }

    // Get the element to insert before during drag
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Move task to new status
    moveTask(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            task.status = newStatus;
            this.saveTasks();
            this.updateCounts();
        }
    }

    // Delete task
    deleteTask(taskId) {
        const taskCard = document.getElementById(`task-${taskId}`);
        if (taskCard) {
            taskCard.style.transform = 'translateX(100px)';
            taskCard.style.opacity = '0';
            
            setTimeout(() => {
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.saveTasks();
                taskCard.remove();
                this.updateCounts();
            }, 300);
        }
    }

    // Open edit modal
    openEditModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.currentEditId = taskId;
            this.editTaskInput.value = task.text;
            this.editDescriptionInput.value = task.description || '';
            this.editPrioritySelect.value = task.priority;
            this.editLabelSelect.value = task.label || '';
            this.editDueDateInput.value = task.dueDate || '';

            // Load subtasks
            this.tempSubtasks = task.subtasks ? [...task.subtasks] : [];
            this.renderSubtasks();

            this.editModal.classList.add('active');
            this.editTaskInput.focus();
        }
    }

    // Add subtask
    addSubtask() {
        const text = this.subtaskInput.value.trim();
        if (!text) {
            this.shakeElement(this.subtaskInput);
            return;
        }

        this.tempSubtasks.push({
            id: this.generateId(),
            text: text,
            completed: false
        });

        this.subtaskInput.value = '';
        this.renderSubtasks();
    }

    // Render subtasks in modal
    renderSubtasks() {
        this.subtasksList.innerHTML = '';

        this.tempSubtasks.forEach((subtask, index) => {
            const subtaskItem = document.createElement('div');
            subtaskItem.className = `subtask-item${subtask.completed ? ' completed' : ''}`;
            subtaskItem.innerHTML = `
                <label class="subtask-checkbox">
                    <input type="checkbox" ${subtask.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>
                <span class="subtask-text">${this.escapeHtml(subtask.text)}</span>
                <button class="subtask-delete" title="Delete subtask"><i class="fas fa-times"></i></button>
            `;

            const checkbox = subtaskItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                this.tempSubtasks[index].completed = checkbox.checked;
                this.renderSubtasks();
            });

            const deleteBtn = subtaskItem.querySelector('.subtask-delete');
            deleteBtn.addEventListener('click', () => {
                this.tempSubtasks.splice(index, 1);
                this.renderSubtasks();
            });

            this.subtasksList.appendChild(subtaskItem);
        });

        // Update progress
        const completed = this.tempSubtasks.filter(s => s.completed).length;
        this.subtasksProgress.textContent = `${completed}/${this.tempSubtasks.length}`;
    }

    // Save edit
    saveEdit() {
        const newText = this.editTaskInput.value.trim();
        if (!newText) {
            this.shakeElement(this.editTaskInput);
            return;
        }

        const task = this.tasks.find(t => t.id === this.currentEditId);
        if (task) {
            task.text = newText;
            task.description = this.editDescriptionInput.value.trim();
            task.priority = this.editPrioritySelect.value;
            task.label = this.editLabelSelect.value;
            task.dueDate = this.editDueDateInput.value || null;
            task.subtasks = [...this.tempSubtasks];
            this.saveTasks();
            this.renderAllTasks();
        }

        this.closeModal();
    }

    // Close modal
    closeModal() {
        this.editModal.classList.remove('active');
        this.currentEditId = null;
        this.tempSubtasks = [];
    }

    // Clear all tasks
    clearAllTasks() {
        if (this.tasks.length === 0) return;
        
        if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
            this.tasks = [];
            this.saveTasks();
            this.renderAllTasks();
        }
    }

    // Update task counts
    updateCounts() {
        const counts = {
            todo: 0,
            inprogress: 0,
            done: 0
        };

        this.tasks.forEach(task => {
            counts[task.status]++;
        });

        document.getElementById('todo-count').textContent = counts.todo;
        document.getElementById('inprogress-count').textContent = counts.inprogress;
        document.getElementById('done-count').textContent = counts.done;
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('kanbanTasks', JSON.stringify(this.tasks));
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Shake animation for validation
    shakeElement(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'shake 0.5s ease';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
}

// Add shake animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the Kanban Board when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KanbanBoard();
});
