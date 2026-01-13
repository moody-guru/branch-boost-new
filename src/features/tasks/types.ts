// src/features/tasks/types.ts

// The structure of a task object fetched from Supabase
export interface TaskType {
  id: number; // Ensure this is number (Supabase uses numbers usually). If you use UUIDs, keep it string.
  taskName: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "finished";
  startedAt?: string | Date;
  finishedAt?: string | Date;
  notes?: string; // <--- Add this optional field
}

export type TasksCollection = TaskType[];

