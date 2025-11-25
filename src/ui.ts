// Module for interacting with the DOM (UI rendering and drag & drop)
import type { Task, Status } from './types';

/**
 * Format an ISO timestamp into a human-readable string.
 */
export function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleString(undefined, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
}

/**
 * Create a DOM element representing a task card.
 * - Shows title, creation date, priority
 * - Shows finished date only if status is 'done'
 * - Includes a delete button
 * - Supports drag & drop
 */
export function createTaskElement(task: Task): HTMLElement {
	const card = document.createElement('article');
	card.className = 'card';
	card.setAttribute('role', 'listitem');
	card.draggable = true;
	card.dataset.id = task.id;

	// --- Delete button (top-right) ---
	const delBtn = document.createElement('button');
	delBtn.className = 'card-delete';
	delBtn.type = 'button';
	delBtn.title = 'Delete task';
	delBtn.setAttribute('aria-label', 'Delete task');
	delBtn.textContent = 'x';

	// --- Task title ---
	const titleEl = document.createElement('div');
	titleEl.className = 'card-title';
	titleEl.textContent = task.title;

	// --- Bottom info container (meta, priority, finished) ---
	const infoEl = document.createElement('div');
	infoEl.className = 'card-info'; // we can style as flex or grid in CSS

	// Creation date
	const metaEl = document.createElement('div');
	metaEl.className = 'card-meta';
	metaEl.textContent = `Created: ${formatDate(task.createdAt)}`;

	// Priority
	const priorityEl = document.createElement('div');
	priorityEl.className = `card-priority card-priority-${task.priority}`;
	priorityEl.textContent = `Priority: ${task.priority}`;

	// Finished date (only if done)
	let finishedEl: HTMLDivElement | null = null;
	if (task.status === 'done' && task.finishedAt) {
		finishedEl = document.createElement('div');
		finishedEl.className = 'card-finished';
		finishedEl.textContent = `Finished: ${formatDate(task.finishedAt)}`;
	}

	// Append meta, priority, finished into info container
	infoEl.append(metaEl, priorityEl);
	if (finishedEl) infoEl.append(finishedEl);

	// --- Append all main elements to card ---
	card.append(delBtn, titleEl, infoEl);

	return card;
}

/**
 * Attach drag & drop event handlers to columns and cards.
 * - `columns`: a map from Status to the column element
 * - `onMove`: callback called when a card is moved to a new column
 */
export function bindDragAndDrop(
	columns: Record<Status, HTMLElement>,
	onMove: (taskId: string, to: Status) => void
): void {
	// Add drag handlers to each column
	(Object.keys(columns) as Status[]).forEach((status) => {
		const col = columns[status];

		// Allow dragging over the column
		col.addEventListener('dragover', (e) => {
			e.preventDefault();
			col.classList.add('drag-over');
		});

		col.addEventListener('dragleave', () => {
			col.classList.remove('drag-over');
		});

		// Handle drop
		col.addEventListener('drop', (e) => {
			e.preventDefault();
			col.classList.remove('drag-over');
			const id = e.dataTransfer?.getData('text/plain');
			if (id) onMove(id, status);
		});
	});

	// Delegate dragstart and dragend to document (cards are dynamic)
	document.addEventListener('dragstart', (e) => {
		const target = e.target as HTMLElement | null;
		if (!target) return;
		const card = target.closest('.card') as HTMLElement | null;
		if (card && card.dataset.id) {
			e.dataTransfer?.setData('text/plain', card.dataset.id);
			card.style.opacity = '0.6'; // visual feedback
		}
	});

	document.addEventListener('dragend', (e) => {
		const target = e.target as HTMLElement | null;
		if (!target) return;
		const card = target.closest('.card') as HTMLElement | null;
		if (card) card.style.opacity = '';
	});
}

/**
 * Render all tasks into their respective columns.
 * - Clears columns first
 * - Creates a card element for each task
 */
export function renderBoard(tasks: Task[], columns: Record<Status, HTMLElement>): void {
	// Clear existing content
	(Object.keys(columns) as Status[]).forEach((status) => {
		columns[status].innerHTML = '';
	});

	// Add task cards to appropriate columns
	tasks.forEach((task) => {
		const el = createTaskElement(task);
		columns[task.status].appendChild(el);
	});
}
