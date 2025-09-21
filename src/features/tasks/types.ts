// src/features/tasks/types.ts

// The structure of a task object fetched from Supabase
export interface TaskType {
  id: number;
  created_at: string;
  user_id: string;
  taskName: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'finished';
  startedAt: string;
  finishedAt: string | null;
}

// An array of tasks
export type TasksCollection = TaskType[];

