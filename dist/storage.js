import { PRIORITIES, STATUSES } from './types.js';
const STORAGE_KEY = 'kanban_tasks_upd';
/**
 * Runtime validation to ensure data loaded from localStorage
 * matches the Task interface shape.
 */
function isTask(obj) {
    if (!obj || typeof obj !== 'object')
        return false;
    const t = obj;
    return (typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        t.title.trim().length > 0 &&
        typeof t.createdAt === 'string' &&
        (t.finishedAt === null || typeof t.finishedAt === 'string') &&
        // Compare with exported literal arrays (one source of truth)
        PRIORITIES.includes(t.priority) &&
        STATUSES.includes(t.status));
}
/**
 * Load tasks from LocalStorage.
 * Invalid entries are automatically filtered out.
 */
export function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter(isTask);
    }
    catch (_a) {
        return [];
    }
}
/**
 * Save tasks to LocalStorage (as-is).
 */
export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
/**
 * Simple, collision-resistant ID generator.
 */
export function generateId() {
    const rnd = Math.random().toString(36).slice(2, 8);
    return `${Date.now().toString(36)}_${rnd}`;
}
//# sourceMappingURL=storage.js.map