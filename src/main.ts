import type { Task, Status, Priority } from "./types";
// Load helper functions for storage and ID generation
import { loadTasks, saveTasks, generateId } from "./storage.js";
// UI rendering and drag-and-drop binding
import { renderBoard, bindDragAndDrop } from "./ui.js";

// DOM Elements

// The form element for creating new tasks
const form = document.getElementById("new-task-form") as HTMLFormElement;
// Input for task title
const titleInput = document.getElementById("task-title") as HTMLInputElement;
// All priority buttons inside the form
const priorityButtons = document.querySelectorAll<HTMLButtonElement>(
  ".priority-group .priority"
);
// Hidden input that stores the currently selected priority
const priorityInput = document.getElementById(
  "task-priority"
) as HTMLInputElement;

// Priority selection handling

priorityButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // dataset.priority is always a string from HTML; cast to union type
    const value = btn.dataset.priority as Priority;
    priorityInput.value = value;

    // Visual feedback: mark clicked button as selected
    priorityButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

// Columns mapping

// Find DOM elements for each column
const colTodo = document.getElementById("col-todo") as HTMLElement;
const colWip = document.getElementById("col-wip") as HTMLElement;
const colTesting = document.getElementById("col-testing") as HTMLElement;
const colDone = document.getElementById("col-done") as HTMLElement;

// Map Status values to their corresponding column elements
const columns: Record<Status, HTMLElement> = {
  todo: colTodo,
  wip: colWip,
  testing: colTesting,
  done: colDone,
};

// Task state

// Load tasks from storage (localStorage or other source)
let tasks: Task[] = loadTasks();

// Render the board and save tasks
function sync() {
  renderBoard(tasks, columns);
  saveTasks(tasks);
}

// Form submission: create a new task

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  // Get the priority from the input, defaulting to 'low' if empty or invalid
  const priority: Priority = (priorityInput.value as Priority) || "low";

  if (!title) return; // Ignore empty task title
  if (priority == null) return "low";

  // Create a new task object
  const newTask: Task = {
    id: generateId(), // unique ID
    title, // user-provided title
    priority, // low/medium/high
    createdAt: new Date().toISOString(),
    finishedAt: null, // not finished yet
    status: "todo", // default status
  };

  // Add new task to the top of the tasks array
  tasks = [newTask, ...tasks];

  // Reset form fields and selected priority
  titleInput.value = "";
  priorityInput.value = "";
  priorityButtons.forEach((b) => b.classList.remove("selected"));

  sync(); // re-render board and save tasks
});

// Move task between columns

function moveTask(taskId: string, to: Status) {
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return; // task not found

  // If moving to 'done', record timestamp; else reset finishedAt
  const completed = to === "done" ? new Date().toISOString() : null;

  // Update task immutably
  tasks[idx] = { ...tasks[idx], status: to, finishedAt: completed };
  sync();

  // Visual feedback: flash task when moved to 'done'
  if (to === "done") {
    const el = columns.done.querySelector(
      `[data-id="${taskId}"]`
    ) as HTMLElement | null;
    if (el) {
      el.classList.add("flash-done");
      setTimeout(() => el.classList.remove("flash-done"), 1000);
    }
  }
}

// Bind drag-and-drop events using provided helper
bindDragAndDrop(columns, moveTask);

// Initial render
sync();

// Delete task by clicking delete button

// Delegated event listener because cards are dynamic
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  // Check if a delete button was clicked
  const delBtn = target.closest(".card-delete") as HTMLElement | null;
  if (!delBtn) return;

  e.preventDefault();
  e.stopPropagation();

  // Find the card element and its data-id
  const card = delBtn.closest(".card") as HTMLElement | null;
  const id = card?.dataset.id;
  if (!id) return;

  // Remove task from tasks array and sync
  tasks = tasks.filter((t) => t.id !== id);
  sync();
});
