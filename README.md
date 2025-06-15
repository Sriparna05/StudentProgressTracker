# 🌟 Student Progress Tracker 🌟

### Your command center for academic success and productivity.

A modern, feature-rich, and visually appealing progress tracker built with pure JavaScript. This isn't just another to-do list; it's a motivational tool designed to help students visualize their progress, manage deadlines, and celebrate their achievements. All data is saved directly in your browser, so it's fast, private, and works offline.

---

## 🚀 Live Demo & Preview

**Check out the live version here:**

### 👉 **[https://sriparna05.github.io/StudentProgressTracker/](https://sriparna05.github.io/StudentProgressTracker/)** 👈

---

## ✨ Core Features

- **📊 Dynamic Donut Chart:** Visualize your completed vs. pending tasks in real-time with a sleek chart powered by **Chart.js**.
- **📝 Full Task Management:** Add, delete, and mark tasks as complete.
- **✍️ In-Place Editing:** Simply click the edit icon to change a task's title directly in the list.
- **🏁 Milestone & Deadline Tracking:** Mark important tasks as milestones for special visual highlighting. Overdue tasks are automatically flagged in red!
- **💾 Persistent Local Storage:** Your tasks are saved in your browser, so your progress is never lost.
- **🎉 Confetti Celebration:** Reach 100% completion and be rewarded with a satisfying confetti burst!
- **🔃 Smart Sorting:** Easily sort your tasks by creation date (newest first) or by due date to prioritize your work.
- **🌗 Modern Dark Theme:** A beautiful, responsive, black-and-blue interface that's easy on the eyes.

---

## 🛠️ Tech Stack

This project is built entirely on the frontend, requiring no server-side processing.

- **HTML5:** For the core structure and content.
- **CSS3:** For the dark theme, responsive layout (Flexbox/Grid), and modern styling.
- **JavaScript (ES6+):** For all the application logic, state management, and DOM manipulation.
- **[Chart.js](https://www.chartjs.org/):** For creating the beautiful and interactive donut chart.
- **[canvas-confetti](https://github.com/catdad/canvas-confetti):** For the fun completion celebration.

---

## 🏁 Getting Started

To run this project locally, simply follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Sriparna05/StudentProgressTracker
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd progress-tracker
    ```

3.  **Open the `index.html` file in your browser.**
    - You can just double-click the file.
    - For the best experience, use a live server extension in your code editor (like "Live Server" for VS Code) to automatically reload the page on changes.

---

## 🏗️ Project Architecture

The application follows a modern frontend architecture pattern based on a "single source of truth".

- **State Management:** All application data (the list of tasks) is stored in a single JavaScript array: `let tasks = []`.
- **Data Persistence:** Before any change, the `tasks` array is saved to the browser's `localStorage` by converting it to a JSON string. On page load, it's retrieved and parsed back into an array.
- **Render Function:** A central `render()` function is responsible for all UI updates. Any action (adding, deleting, completing a task) modifies the `tasks` array and then calls `render()`. This function then re-draws the task list and updates the chart, ensuring the UI is always in sync with the state.
- **Event Delegation:** A single event listener is placed on the main task list (`<ul>`) to efficiently handle clicks on any task's buttons (complete, edit, delete), rather than adding a listener to every single item.
