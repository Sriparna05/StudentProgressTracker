document.addEventListener('DOMContentLoaded', () => {
    // State
    let tasks = [];

    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskTitleInput = document.getElementById('task-title');

    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // MODIFIED for PHASE 2
    function render() {
        saveTasks();
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = `<li class="no-tasks-message">No tasks yet. Add one to get started!</li>`;
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.isCompleted ? 'completed' : ''}`;
            li.dataset.id = task.id;
            li.innerHTML = `
                <div class="task-details">
                    <input type="checkbox" class="task-checkbox" ${task.isCompleted ? 'checked' : ''}>
                    <span>${task.title}</span>
                </div>
                <button class="btn-delete" title="Delete Task">🗑️</button>
            `;
            taskList.appendChild(li);
        });
    }
    
    function addTask(e) {
        e.preventDefault();
        const title = taskTitleInput.value.trim();
        if (title === '') return;

        const newTask = {
            id: `task-${Date.now()}`,
            title: title,
            isCompleted: false,
        };
        tasks.push(newTask);
        taskTitleInput.value = '';
        render(); // Use the new render() function
    }

    // NEW for PHASE 2: Event Delegation
    function handleTaskActions(e) {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;
        
        const taskId = taskItem.dataset.id;
        
        if (target.classList.contains('task-checkbox')) {
            const task = tasks.find(t => t.id === taskId);
            task.isCompleted = target.checked;
            render();
        } else if (target.classList.contains('btn-delete')) {
            tasks = tasks.filter(t => t.id !== taskId);
            render();
        }
    }

    function init() {
        taskForm.addEventListener('submit', addTask);
        taskList.addEventListener('click', handleTaskActions); // Use one listener
        loadTasks();
        renderTasks(); // Initial render on load
    }

    init();
});