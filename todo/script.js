// Todo List App with Local Storage

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

let todos = [];
let currentFilter = 'all';

// Initialize app
function init() {
    loadFromLocalStorage();
    render();
    attachEventListeners();
}

// Load todos from localStorage
function loadFromLocalStorage() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        todos = JSON.parse(stored);
    }
}

// Save todos to localStorage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Attach event listeners
function attachEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAll);

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            render();
        });
    });
}

// Add new todo
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') {
        alert('Please enter a task!');
        todoInput.focus();
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: 'medium',
        createdAt: new Date().toLocaleString(),
    };

    todos.push(newTodo);
    saveToLocalStorage();
    todoInput.value = '';
    todoInput.focus();
    render();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveToLocalStorage();
        render();
    }
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    saveToLocalStorage();
    render();
}

// Clear completed todos
function clearCompleted() {
    if (todos.some((t) => t.completed)) {
        if (confirm('Delete all completed tasks?')) {
            todos = todos.filter((t) => !t.completed);
            saveToLocalStorage();
            render();
        }
    } else {
        alert('No completed tasks to clear.');
    }
}

// Clear all todos
function clearAll() {
    if (todos.length === 0) {
        alert('No tasks to delete.');
        return;
    }
    if (confirm('Delete ALL tasks? This cannot be undone.')) {
        todos = [];
        saveToLocalStorage();
        render();
    }
}

// Update stats
function updateStats() {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;

    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter((t) => !t.completed);
        case 'completed':
            return todos.filter((t) => t.completed);
        default:
            return todos;
    }
}

// Render todos
function render() {
    const filtered = getFilteredTodos();
    todoList.innerHTML = '';

    if (todos.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
    }

    filtered.forEach((todo) => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        if (todo.completed) li.classList.add('completed');

        const priorityClass = `priority-${todo.priority || 'medium'}`;
        const priorityText = (todo.priority || 'medium').charAt(0).toUpperCase() + (todo.priority || 'medium').slice(1);

        li.innerHTML = `
            <input
                type="checkbox"
                class="checkbox"
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            />
            <span class="priority-badge ${priorityClass}">${priorityText}</span>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn-item" onclick="deleteTodo(${todo.id})">Delete</button>
        `;

        todoList.appendChild(li);
    });

    updateStats();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);