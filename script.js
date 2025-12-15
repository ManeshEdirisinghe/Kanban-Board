// Kanban Board Application
// Task Manager with Drag and Drop functionality

class KanbanBoard {
    constructor() {
        // Initialize tasks from localStorage or empty array
        this.tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
        this.currentEditId = null;

        // DOM Elements
        this.taskInput = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.editModal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editPrioritySelect = document.getElementById('editPrioritySelect');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');

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
        // Bind event listeners
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());
        this.saveEditBtn.addEventListener('click', () => this.saveEdit());
        this.cancelEditBtn.addEventListener('click', () => this.closeModal());

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
            priority: this.prioritySelect.value,
            status: 'todo',
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTask(task, true);
        this.updateCounts();

        // Clear input
        this.taskInput.value = '';
        this.taskInput.focus();
    }

    // Render a single task
    renderTask(task, isNew = false) {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card priority-${task.priority}${isNew ? ' new' : ''}`;
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

        taskCard.innerHTML = `
            <div class="task-content">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="edit-btn" title="Edit task">✏️</button>
                    <button class="delete-btn" title="Delete task">🗑️</button>
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
            this.editPrioritySelect.value = task.priority;
            this.editModal.classList.add('active');
            this.editTaskInput.focus();
        }
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
            task.priority = this.editPrioritySelect.value;
            this.saveTasks();
            this.renderAllTasks();
        }

        this.closeModal();
    }

    // Close modal
    closeModal() {
        this.editModal.classList.remove('active');
        this.currentEditId = null;
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
