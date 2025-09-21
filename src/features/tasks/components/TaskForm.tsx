//will contain the form for adding new tasks. It will be updated to save new tasks to your Supabase tasks table.

//The form is now simplified. It just collects user input and calls a function (handleAddTask) that is passed in from the parent dashboard page.

// src/features/tasks/components/TaskForm.tsx

import React, { useState } from 'react';
import { TaskType } from '../types';

interface TaskFormProps {
  // This function will handle the Supabase insert logic
  handleAddTask: (taskData: Omit<TaskType, 'id' | 'created_at' | 'user_id' | 'startedAt' | 'finishedAt' | 'status'>) => Promise<void>;
}

const initialValue = {
  taskName: "",
  priority: "low" as 'low' | 'medium' | 'high',
};

export const TaskForm = ({ handleAddTask }: TaskFormProps) => {
  const [task, setTask] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task.taskName || isSubmitting) return;

    setIsSubmitting(true);
    await handleAddTask(task);
    setTask(initialValue); // Reset form after submission
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-slate-700 font-bold text-lg mb-4'>Create a New Task</h2>
      <div className="flex flex-col gap-4">
        <label className='font-semibold text-slate-600' htmlFor="taskName">
          Task Name
          <input
            required
            onChange={handleChange}
            id='taskName'
            type="text"
            value={task.taskName}
            className='w-full p-2 mt-1 bg-slate-100 rounded-md border border-slate-300'
            name="taskName"
          />
        </label>

        <label className='text-slate-600 font-semibold' htmlFor="priority">
          Priority
          <select
            onChange={handleChange}
            name="priority"
            id='priority'
            value={task.priority}
            className='capitalize w-full p-2 mt-1 bg-slate-100 rounded-md border border-slate-300'
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className='w-full bg-sky-500 py-2 text-slate-50 font-semibold rounded-md cursor-pointer hover:bg-sky-600 duration-200 disabled:bg-slate-400'
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};