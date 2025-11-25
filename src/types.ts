// ---------------------------------------------
// PRIORITY VALUES
// ---------------------------------------------
//
// We define the allowed priority values as a literal tuple.
// `as const` makes each value a string literal type
// AND freezes the array so TypeScript treats it as:
//   readonly ["low", "medium", "high"]
//
export const PRIORITIES = ['low', 'medium', 'high'] as const;

// This creates a union type from the tuple:
//   "low" | "medium" | "high"
// It stays in sync with the PRIORITIES array automatically.
//
export type Priority = typeof PRIORITIES[number];



// ---------------------------------------------
// STATUS VALUES
// ---------------------------------------------
//
// Same pattern for workflow statuses.
//
export const STATUSES = ['todo', 'wip', 'testing', 'done'] as const;

// Union type derived from the STATUS tuple:
//   "todo" | "wip" | "testing" | "done"
//
export type Status = typeof STATUSES[number];



// ---------------------------------------------
// TASK INTERFACE
// ---------------------------------------------
//
// Main interface used by the application.
// Priority and Status rely on the automatically-
// synchronized union types defined above.
//
export interface Task {
	// Unique task identifier
	id: string;

	// User input, descriptive title
	title: string;

	// Priority level (low | medium | high)
	priority: Priority;

	// Creation timestamp (ISO string)
	createdAt: string;

	// Completion timestamp (ISO string or null)
	finishedAt: string | null;

	// Workflow state (todo → wip → testing → done)
	status: Status;
}
