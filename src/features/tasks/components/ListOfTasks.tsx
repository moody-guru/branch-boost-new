//component will display the list of tasks retrieved from Supabase.

// src/features/tasks/components/ListOfTasks.tsx
import React from 'react';
import { TasksCollection } from '../types';
import { TaskHandlers } from './TasksWrapper';
import { TableOfTasks } from '@/components/ui/Table';

interface ListOfTasksProps {
    tasks: TasksCollection;
    taskHandlers: TaskHandlers;
}

export const ListOfTasks = ({ tasks, taskHandlers }: ListOfTasksProps) => {
    return (
        <>
            <h2 className="text-xl font-bold text-slate-700 mb-4">My Tasks</h2>
            <div className='overflow-y-auto max-h-96 min-h-[300px] w-full'>
                <TableOfTasks taskHandlers={taskHandlers} tasks={tasks} />
            </div>
        </>
    );
};