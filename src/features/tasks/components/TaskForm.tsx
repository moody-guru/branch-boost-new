import React, { useState } from "react";
import { TaskType } from "../store";

interface TaskFormProps {
  onAddTask: (task: TaskType) => void;
  showTaskCreation: boolean;
}

const initialValueTask: TaskType = {
  id: "",
  priority: "low",
  status: "pending",
  taskName: "",
  startedAt: new Date(),
  finishedAt: undefined,
  notes: "",
};

export const TaskForm = ({ onAddTask, showTaskCreation }: TaskFormProps) => {
  const [task, setTask] = useState<TaskType>(initialValueTask);

  const handleChange = (e: any) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTask: TaskType = {
      ...task,
      id: crypto.randomUUID(),
      startedAt: new Date(),
      status: "pending",
    };
    onAddTask(newTask);
    setTask(initialValueTask);
  };

  if (!showTaskCreation) return null;

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-slate-100 transition-all">
      <h2 className="text-slate-800 font-bold text-base md:text-lg mb-4">
        Create a New Task
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-slate-600 text-xs md:text-sm">
            Task Name
          </label>
          <input
            required
            onChange={handleChange}
            name="taskName"
            type="text"
            value={task.taskName}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition-all placeholder:text-slate-400"
            placeholder="e.g. Finish the monthly report"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-slate-600 font-semibold text-xs md:text-sm">
            Priority
          </label>
          <div className="relative">
            <select
              onChange={handleChange}
              name="priority"
              value={task.priority}
              className="capitalize w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-500 cursor-pointer appearance-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {/* Custom arrow icon to make it look cleaner than default dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-2 bg-sky-500 py-2 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors shadow-sm text-sm"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};
