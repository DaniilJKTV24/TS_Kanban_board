# Kanban Board

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()
[![Status](https://img.shields.io/badge/Project%20Type-Learning%20Demo-lightgrey.svg)]()

A minimal, dependency-free **Kanban board** implemented in TypeScript.  
The board supports task creation, drag-and-drop movement across workflow columns,  
priority tagging, and automatic persistence through `localStorage`.

---

## Table of Contents

- [Features](#features)  
- [Project Structure](#project-structure)  
- [Installation](#installation)  
- [Development](#development)  
- [Task Model](#task-model)  
- [Available Scripts](#available-scripts)  
- [Future Improvements](#future-improvements)

---

## Features

- Four workflow stages:
  - **To Do**
  - **Work in Progress**
  - **Testing**
  - **Done**
- Create tasks with:
  - Required **title**
  - **Priority**: `low` (default), `medium`, `high`
  - Auto-generated **createdAt**
- Drag-and-drop movement between columns
- Automatically assigns **finishedAt** when a task moves to *Done*
- Fully persistent via browser `localStorage`
- Written in **TypeScript**, compiled to ES modules

---

## Project Structure

```
.
├── dist/
│   ├── main.js
│   ├── storage.js
│   ├── types.js
│   └── ui.js
│
├── src/
│   ├── main.ts
│   ├── storage.ts
│   ├── types.ts
│   └── ui.ts
│
├── index.html
├── styles.css
├── package.json
└── tsconfig.json
```

---

## Installation

```sh
npm install
```

---

## Development

### Build the project
```sh
npm run build
```

### Watch for changes
```sh
npm run dev
```

### Run the application
This project is static and does not include a dev server.

Use the VS Code **Live Server** extension:

1. Open `index.html`
2. Right-click → **Open with Live Server**

---

## Task Model

```ts
interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  finishedAt?: string;
  status: "todo" | "wip" | "testing" | "done";
}
```

Tasks are stored in:

```
localStorage["kanban_tasks_upd"]
```

---

## Available Scripts

| Script          | Description                          |
|-----------------|--------------------------------------|
| `build`         | Compile TypeScript to JavaScript     |
| `dev`           | Compile and watch for changes        |
| `clean`         | Remove the `dist` directory          |
| `test`          | Placeholder                          |

---

## Future Improvements

- Task editing
- Search and filtering
- Column WIP limits
- Light mode
- Data import/export
- Color themes

---

## License

MIT License  
Copyright © 2025
