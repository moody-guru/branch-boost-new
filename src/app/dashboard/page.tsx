//This will be the main, protected page where the user can view and manage their tasks.

// src/app/dashboard/page.tsx
'use client';

import { useEffect, useReducer, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; // Import the markdown component
import remarkGfm from 'remark-gfm'; // Import the GFM plugin
import { TasksWrapper, TaskHandlers } from '@/features/tasks/components/TasksWrapper';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import { TasksReducer, ActionKinds, initialState } from '@/features/tasks/store';

export default function DashboardPage() {
  const [tasks, dispatch] = useReducer(TasksReducer, initialState);
  const router = useRouter();
  const supabase = createClient();

  const [suggestion, setSuggestion] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [errorSuggestion, setErrorSuggestion] = useState('');

  useEffect(() => {
    const getTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) console.error('Error fetching tasks:', error);
      else if (data) dispatch({ type: ActionKinds.SET_TASKS, payload: data });
    };
    getTasks();
  }, [supabase]);

  const getAiSuggestion = async (taskName: string) => {
    setIsLoadingSuggestion(true);
    setErrorSuggestion('');
    setSuggestion('');
    try {
      const branch = 'Information Science and Engineering';
      const response = await fetch('/api/suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName, branch }),
      });
      if (!response.ok) throw new Error('Failed to fetch suggestion.');
      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error(error);
      setErrorSuggestion('Could not get an AI suggestion. Please try again.');
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const handleAddTask = async (taskData: { taskName: string; priority: 'low' | 'medium' | 'high' }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return console.error('No user logged in.');
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...taskData, user_id: user.id })
      .select().single();
    if (error) console.error('Error adding task:', error.message);
    else if (data) {
      dispatch({ type: ActionKinds.ADD_NEW_TASK, payload: data });
      getAiSuggestion(data.taskName);
    }
  };

  const handleFinishTask = async (taskId: number) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'finished', finishedAt: new Date().toISOString() })
      .eq('id', taskId).select().single();
    if (error) console.error('Error finishing task:', error.message);
    else if (data) dispatch({ type: ActionKinds.FINISHED_TASK, payload: data });
  };

  const handleDeleteTask = async (taskId: number) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) console.error('Error deleting task:', error.message);
    else dispatch({ type: ActionKinds.DELETE_TASK, payload: taskId });
  };

  const taskHandlers: TaskHandlers = {
    finishTask: handleFinishTask,
    deleteTask: handleDeleteTask,
  };

  return (
    <div className="flex flex-col min-h-[90vh]">
      <header className="bg-slate-800 text-white shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">BranchBoost Dashboard</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 text-sm transition-colors"
          >
            Logout
          </button>
        </nav>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
              <TaskForm handleAddTask={handleAddTask} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
              <TasksWrapper tasks={tasks} dispatch={dispatch} taskHandlers={taskHandlers} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md h-full transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-bold text-slate-700 mb-4">✨ AI Mentor</h2>
              {isLoadingSuggestion && <p className="text-slate-500 animate-pulse">Generating advice...</p>}
              {errorSuggestion && <p className="text-red-500">{errorSuggestion}</p>}
              {suggestion && (
                <article className="prose prose-sm max-w-none text-slate-600">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {suggestion}
                  </ReactMarkdown>
                </article>
              )}
              {!isLoadingSuggestion && !suggestion && !errorSuggestion && (
                <p className="text-slate-500">Add a new task to get personalized steps and suggestions from your AI mentor!</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}