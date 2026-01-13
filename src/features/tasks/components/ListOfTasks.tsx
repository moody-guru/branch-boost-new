import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TasksCollection, TaskHandlers } from "../store";
import { Task } from "./Task";
import { FaClipboardList } from "react-icons/fa";

type ListOfTasksProps = {
  tasks: TasksCollection;
  taskHandlers: TaskHandlers;
  onAskAI: (taskName: string, id: string) => void;
  onOpenNotes: (taskName: string, notes: string, id: string) => void;
};

export const ListOfTasks = ({
  tasks,
  taskHandlers,
  onAskAI,
  onOpenNotes,
}: ListOfTasksProps) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center gap-3">
        <FaClipboardList size={40} className="text-slate-300" />
        <h2 className="font-bold text-xl text-slate-500">No tasks yet!</h2>
        <p className="text-slate-400">
          Click the "+ New Task" button to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 md:gap-2">
      <div className="hidden md:flex px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 mb-2">
        <div className="w-1/4">Task</div>
        <div className="w-1/6">Priority</div>
        <div className="w-1/6">Status</div>
        <div className="w-1/6">Started</div>
        <div className="w-1/4 text-center">Actions</div>
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
            id={String(task.id)}
          />
        ))}
      </SortableContext>
    </div>
  );
};
