// src/features/tasks/store.ts

export interface TaskType {
  id: string; // UUID from Supabase
  taskName: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "finished";
  startedAt?: string | Date;
  finishedAt?: string | Date;
  notes?: string;
  created_at?: string;
  user_id?: string;
}

export type TasksCollection = TaskType[];

export const initialState: TasksCollection = [];

export enum ActionKinds {
  ADD_NEW_TASK = "ADD_NEW_TASK",
  FINISHED_TASK = "FINISHED_TASK",
  ORDER_ITEMS = "ORDER_ITEMS",
  DELETE_TASK = "DELETE_TASK",
  UPDATE_TASK_NOTES = "UPDATE_TASK_NOTES",
  SET_TASKS = "SET_TASKS",
}

export type Actions =
  | { type: ActionKinds.ADD_NEW_TASK; payload: TaskType }
  | { type: ActionKinds.FINISHED_TASK; payload: TaskType }
  | { type: ActionKinds.DELETE_TASK; payload: string }
  | { type: ActionKinds.ORDER_ITEMS; payload: TasksCollection }
  | {
      type: ActionKinds.UPDATE_TASK_NOTES;
      payload: { id: string; notes: string };
    }
  | { type: ActionKinds.SET_TASKS; payload: TasksCollection };

// Handlers Definition
export type TaskHandlers = {
  finishTask: (status: string, id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateNotes: (id: string, newNotes: string) => Promise<void>;
  reorder: (
    list: TasksCollection,
    startIndex: number,
    endIndex: number
  ) => TasksCollection;
};

export const TasksReducer = (
  state: TasksCollection = initialState,
  action: Actions
): TasksCollection => {
  const { type, payload } = action;

  switch (type) {
    case ActionKinds.SET_TASKS:
      return payload as TasksCollection;
    case ActionKinds.ADD_NEW_TASK:
      return [payload as TaskType, ...state];
    case ActionKinds.FINISHED_TASK:
      const updatedTask = payload as TaskType;
      return state.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
    case ActionKinds.ORDER_ITEMS:
      return payload as TasksCollection;
    case ActionKinds.DELETE_TASK:
      return state.filter((task) => task.id !== (payload as string));
    case ActionKinds.UPDATE_TASK_NOTES:
      const notePayload = payload as { id: string; notes: string };
      return state.map((task) =>
        task.id === notePayload.id
          ? { ...task, notes: notePayload.notes }
          : task
      );
    default:
      return state;
  }
};
