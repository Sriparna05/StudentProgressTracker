document.addEventListener('DOMContentLoaded', () => {
    // State
    let tasks = [];

    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskTitleInput = document.getElementById('task-title');

    // Load tasks from localStorage on startup
    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Render tasks to the DOM
    function renderTasks() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = `<li class="no-tasks-message">No tasks yet. Add one to get started!</li>`;
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.dataset.id = task.id;
            li.innerHTML = `<span>${task.title}</span>`;
            taskList.appendChild(li);
        });
    }
    
    // Add a new task
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
        
        saveTasks();
        renderTasks();
    }

    // Initializer function
    function init() {
        taskForm.addEventListener('submit', addTask);
        loadTasks();
        renderTasks();
    }

    init();
});