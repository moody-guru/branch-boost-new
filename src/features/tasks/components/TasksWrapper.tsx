//manage the state of your tasks. Instead of using useReducer with localStorage, you'll refactor this to handle state with data fetched from Supabase.

//This component now acts as a simple wrapper, passing down the data and handler functions to the task list

// src/features/tasks/components/TasksWrapper.tsx
import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TasksCollection } from '../types';
import { ListOfTasks } from './ListOfTasks';
import { Actions, ActionKinds } from '../store';

export type TaskHandlers = {
  finishTask: (taskId: number) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
};

interface TasksWrapperProps {
  tasks: TasksCollection;
  dispatch: React.Dispatch<Actions>;
  taskHandlers: TaskHandlers;
}

export const TasksWrapper = ({ tasks, dispatch, taskHandlers }: TasksWrapperProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
      dispatch({ type: ActionKinds.ORDER_ITEMS, payload: reorderedTasks });
    }
  }

  return (
    <div className='w-full relative bg-white p-6 rounded-lg shadow-md'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <ListOfTasks
          tasks={tasks}
          taskHandlers={taskHandlers}
        />
      </DndContext>
    </div>
  );
};