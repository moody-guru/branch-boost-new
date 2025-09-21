import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TasksCollection } from "@/features/tasks/types";
import { Task } from "@/features/tasks/components/Task";
import { TaskHandlers } from "@/features/tasks/components/TasksWrapper";

type TableOfTasksProps = {
  tasks: TasksCollection;
  taskHandlers: TaskHandlers;
};

export const TableOfTasks = ({ tasks, taskHandlers }: TableOfTasksProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="font-bold text-xl text-slate-500">No tasks yet!</h2>
        <p className="text-slate-400">Add a new task above to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {" "}
      {/* Increased gap for better spacing */}
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <Task key={task.id} taskHandlers={taskHandlers} {...task} />
        ))}
      </SortableContext>
    </div>
  );
};
