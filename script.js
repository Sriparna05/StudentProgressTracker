document.addEventListener('DOMContentLoaded', () => {
    // State
    let tasks = [];
    let chartInstance = null;

    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const sortTasksSelect = document.getElementById('sort-tasks');
    const progressText = document.getElementById('progress-text');
    const taskStats = document.getElementById('task-stats');
    const chartCanvas = document.getElementById('progressChart');
    
    function setupEventListeners() {
        taskForm.addEventListener('submit', addTask);
        taskList.addEventListener('click', handleTaskActions);
        sortTasksSelect.addEventListener('change', render);
    }

    function loadTasksFromLocalStorage() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value.trim();
        if (title === '') return;
        const newTask = {
            id: `task-${Date.now()}`,
            title,
            description: document.getElementById('task-description').value.trim(),
            dueDate: document.getElementById('task-due-date').value,
            createdAt: new Date().toISOString(),
            isCompleted: false,
            isMilestone: document.getElementById('is-milestone').checked,
        };
        tasks.push(newTask);
        taskForm.reset();
        render();
    }
    
    function handleTaskActions(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        const taskId = taskItem.dataset.id;
        if (e.target.classList.contains('task-checkbox')) {
            toggleCompletion(taskId);
        } else if (e.target.closest('.btn-delete')) {
            deleteTask(taskId);
        } else if (e.target.closest('.btn-edit')) {
            toggleEditMode(taskItem);
        } else if (e.target.closest('.btn-save')) {
            saveTaskEdit(taskId, taskItem);
        }
    }

    function toggleCompletion(id) {
        const task = tasks.find(t => t.id === id);
        task.isCompleted = !task.isCompleted;
        render();
    }
    
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        render();
    }

    function toggleEditMode(taskItem) {
        const titleSpan = taskItem.querySelector('.task-title-desc span');
        const editButton = taskItem.querySelector('.btn-edit');
        const deleteButton = taskItem.querySelector('.btn-delete');
        const currentTitle = titleSpan.textContent;
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentTitle;
        editInput.className = 'edit-input';
        titleSpan.replaceWith(editInput);
        editInput.focus();
        editButton.innerHTML = '💾';
        editButton.classList.remove('btn-edit');
        editButton.classList.add('btn-save');
        deleteButton.style.display = 'none';
    }

    function saveTaskEdit(id, taskItem) {
        const newTitle = taskItem.querySelector('.edit-input').value.trim();
        const task = tasks.find(t => t.id === id);
        if (task && newTitle) task.title = newTitle;
        render();
    }

    function sortTasks() {
        const sortBy = sortTasksSelect.value;
        tasks.sort((a, b) => {
            if (sortBy === 'dueDate') {
                if (!a.dueDate) return 1; if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    function render() {
        saveTasksToLocalStorage();
        sortTasks();
        renderTaskList();
        updateProgress();
    }

    function renderTaskList() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = `<li class="no-tasks-message">No tasks yet. Add one to get started!</li>`;
            return;
        }
        tasks.forEach(task => {
            const isOverdue = !task.isCompleted && task.dueDate && new Date(task.dueDate) < new Date();
            const li = document.createElement('li');
            li.className = `task-item ${task.isCompleted ? 'completed' : ''} ${task.isMilestone ? 'milestone' : ''} ${isOverdue ? 'overdue' : ''}`;
            li.dataset.id = task.id;
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.isCompleted ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-title-desc">
                        <span>${task.title}</span>
                        ${task.description ? `<p>${task.description}</p>` : ''}
                    </div>
                    <div class="task-meta">
                        ${task.dueDate ? `<span class="due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-edit" title="Edit">✏️</button>
                    <button class="btn-delete" title="Delete">🗑️</button>
                </div>`;
            taskList.appendChild(li);
        });
    }

    function updateProgress() {
        const completedTasks = tasks.filter(t => t.isCompleted).length;
        const totalTasks = tasks.length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        progressText.textContent = `${percentage}%`;
        taskStats.textContent = `${completedTasks} / ${totalTasks} tasks completed`;
        updateChart(completedTasks, totalTasks - completedTasks);
        if (percentage === 100 && totalTasks > 0) {
            triggerConfetti();
        }
    }
    
    function initializeChart() {
        const ctx = chartCanvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{ data: [0, 1], backgroundColor: ['#007bff', '#2a364d'], borderColor: '#1a2233', borderWidth: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }
        });
    }

    function updateChart(completed, pending) {
        if (!chartInstance) return;
        chartInstance.data.datasets[0].data = [completed, pending];
        chartInstance.update();
    }

    function triggerConfetti() {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
    
    // Initializer function
    function init() {
        loadTasksFromLocalStorage();
        initializeChart();
        setupEventListeners();
        render();
    }

    init();
});