// ---------------------------------------------
// PRIORITY VALUES
// ---------------------------------------------
//
// We define the allowed priority values as a literal tuple.
// `as const` makes each value a string literal type
// AND freezes the array so TypeScript treats it as:
//   readonly ["low", "medium", "high"]
//
export const PRIORITIES = ['low', 'medium', 'high'];
// ---------------------------------------------
// STATUS VALUES
// ---------------------------------------------
//
// Same pattern for workflow statuses.
//
export const STATUSES = ['todo', 'wip', 'testing', 'done'];
//# sourceMappingURL=types.js.map