//This file centralizes all your state management logic (the "reducer").


// src/features/tasks/store.ts

import { TasksCollection, TaskType } from './types';

export const initialState: TasksCollection = [];

export enum ActionKinds {
  SET_TASKS = "SET_TASKS",             // For loading tasks from DB
  ADD_NEW_TASK = "ADD_NEW_TASK",
  FINISHED_TASK = "FINISHED_TASK",
  ORDER_ITEMS = "ORDER_ITEMS",
  DELETE_TASK = "DELETE_TASK",
}

export interface Actions {
  type: ActionKinds;
  payload: any;
}

export const TasksReducer = (state = initialState, { type, payload }: Actions): TasksCollection => {
  switch (type) {
    case ActionKinds.SET_TASKS:
      // Payload is the full array of tasks from the database
      return payload;

    case ActionKinds.ADD_NEW_TASK:
      // Payload is the single new task object returned from Supabase
      return [...state, payload];

    case ActionKinds.DELETE_TASK:
      // Payload is the ID of the task to remove
      return state.filter((task) => task.id !== payload);

    case ActionKinds.FINISHED_TASK:
      // Payload is the updated task object from Supabase
      return state.map((task) =>
        task.id === payload.id ? payload : task
      );

    case ActionKinds.ORDER_ITEMS:
       // Payload is the reordered list (client-side only)
      return [...payload];

    default:
      return state;
  }
};