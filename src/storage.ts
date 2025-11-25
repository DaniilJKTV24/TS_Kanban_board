import type { Task } from './types';
import { PRIORITIES, STATUSES } from './types.js';

const STORAGE_KEY = 'kanban_tasks_upd';

/**
 * Runtime validation to ensure data loaded from localStorage
 * matches the Task interface shape.
 */
function isTask(obj: unknown): obj is Task {
	if (!obj || typeof obj !== 'object') return false;

	const t = obj as Record<string, unknown>;

	return (
		typeof t.id === 'string' &&
		typeof t.title === 'string' &&
		t.title.trim().length > 0 &&

		typeof t.createdAt === 'string' &&
		(t.finishedAt === null || typeof t.finishedAt === 'string') &&

		// Compare with exported literal arrays (one source of truth)
		PRIORITIES.includes(t.priority as any) &&
		STATUSES.includes(t.status as any)
	);
}

/**
 * Load tasks from LocalStorage.
 * Invalid entries are automatically filtered out.
 */
export function loadTasks(): Task[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];

		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];

		return parsed.filter(isTask);
	} catch {
		return [];
	}
}

/**
 * Save tasks to LocalStorage (as-is).
 */
export function saveTasks(tasks: Task[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Simple, collision-resistant ID generator.
 */
export function generateId(): string {
	const rnd = Math.random().toString(36).slice(2, 8);
	return `${Date.now().toString(36)}_${rnd}`;
}
