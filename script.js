document.addEventListener('DOMContentLoaded', () => {
    // State
    let tasks = [];
    let chartInstance = null; // NEW for chart

    // DOM Elements (Added new ones)
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskTitleInput = document.getElementById('task-title');
    const progressText = document.getElementById('progress-text');
    const taskStats = document.getElementById('task-stats');
    const chartCanvas = document.getElementById('progressChart');

    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function render() {
        saveTasks();
        renderTasks();
        updateProgress(); // NEW: Update progress visuals
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
        const newTask = { id: `task-${Date.now()}`, title, isCompleted: false };
        tasks.push(newTask);
        taskTitleInput.value = '';
        render();
    }

    function handleTaskActions(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        const taskId = taskItem.dataset.id;
        
        if (e.target.classList.contains('task-checkbox')) {
            const task = tasks.find(t => t.id === taskId);
            task.isCompleted = e.target.checked;
            render();
        } else if (e.target.classList.contains('btn-delete')) {
            tasks = tasks.filter(t => t.id !== taskId);
            render();
        }
    }

    // NEW FUNCTIONS for PHASE 3
    function updateProgress() {
        const completedTasks = tasks.filter(t => t.isCompleted).length;
        const totalTasks = tasks.length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        progressText.textContent = `${percentage}%`;
        taskStats.textContent = `${completedTasks} / ${totalTasks} tasks completed`;
        
        updateChart(completedTasks, totalTasks - completedTasks);
    }

    function initializeChart() {
        const ctx = chartCanvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    data: [0, tasks.length > 0 ? tasks.length : 1],
                    backgroundColor: ['#007bff', '#2a364d'],
                    borderColor: '#1a2233',
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { display: false } }
            }
        });
    }

    function updateChart(completed, pending) {
        if (!chartInstance) return;
        chartInstance.data.datasets[0].data = [completed, pending];
        chartInstance.update();
    }

    function init() {
        taskForm.addEventListener('submit', addTask);
        taskList.addEventListener('click', handleTaskActions);
        loadTasks();
        initializeChart(); // Initialize the chart on load
        render(); // Initial render will also update progress
    }

    init();
});