import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// FIX 1: Correct Import Path to Store (Go up 3 levels from src/components/ui)
import { TasksCollection, TaskHandlers } from "../../features/tasks/store";

// FIX 2: Correct Import Path to Task Component
import { Task } from "../../features/tasks/components/Task";

type TableOfTasksProps = {
  tasks: TasksCollection;
  taskHandlers: TaskHandlers;
  onAskAI: (taskName: string, id: string) => void;
  onOpenNotes: (taskName: string, notes: string, id: string) => void;
};

export const TableOfTasks = ({
  tasks,
  taskHandlers,
  onAskAI,
  onOpenNotes,
}: TableOfTasksProps) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
        <h2 className="font-bold text-xl text-slate-500">No tasks yet!</h2>
        <p className="text-slate-400">Add a new task above to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Desktop Header */}
      <div className="hidden md:flex px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 mb-2">
        <div className="w-1/4">Task</div>
        <div className="w-1/6">Priority</div>
        <div className="w-1/6">Status</div>
        <div className="w-1/6">Started</div>
        <div className="w-1/12 text-center">Notes</div>
        <div className="ml-auto">Actions</div>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <Task
            key={task.id}
            taskHandlers={taskHandlers}
            onAskAI={onAskAI}
            onOpenNotes={onOpenNotes}
            {...task}
            // Explicitly cast ID to string to satisfy TypeScript
            id={String(task.id)}
          />
        ))}
      </SortableContext>
    </div>
  );
};
