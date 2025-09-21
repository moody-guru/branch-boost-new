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
  payload: TaskType | TasksCollection | string; // <-- This is the fix
}

export const TasksReducer = (
  state: TasksCollection = initialState,
  { type, payload }: Actions
): TasksCollection => {
  switch (type) {
    case ActionKinds.SET_TASKS:
      if (Array.isArray(payload)) {
        return payload;
      }
      return state;

    case ActionKinds.ADD_NEW_TASK:
      if (typeof payload === "object" && !Array.isArray(payload)) {
        return [...state, payload as TaskType];
      }
      return state;

    case ActionKinds.FINISHED_TASK:
      if (typeof payload === "object" && !Array.isArray(payload)) {
        const updatedTask = payload as TaskType;
        return state.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      }
      return state;

    case ActionKinds.DELETE_TASK:
      if (typeof payload === "string") {
        // FIX: Convert the string payload back to a number for the comparison
        return state.filter((task) => task.id !== Number(payload));
      }
      return state;

    default:
      return state;
  }
};