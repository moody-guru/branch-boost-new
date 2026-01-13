// "use client";

// import React, { useEffect, useReducer } from "react";
// import { createClient } from "@/lib/supabase/client";
// import {
//   TasksReducer,
//   ActionKinds,
//   initialState,
// } from "@/features/tasks/store";
// import {
//   TasksWrapper,
//   TaskHandlers,
// } from "@/features/tasks/components/TasksWrapper";
// import { TaskForm } from "@/features/tasks/components/TaskForm";
// import { TaskType } from "@/features/tasks/types";

// export default function DashboardPage() {
//   const supabase = createClient();
//   const [tasks, dispatch] = useReducer(TasksReducer, initialState);

//   // 1. FETCH TASKS ON LOAD
//   useEffect(() => {
//     const fetchTasks = async () => {
//       const { data, error } = await supabase
//         .from("tasks")
//         .select("*")
//         .order("created_at", { ascending: false }); // Newest first

//       if (error) {
//         console.error("Error fetching tasks:", error);
//       } else if (data) {
//         // We cast the data to match your TaskType interface
//         dispatch({ type: ActionKinds.SET_TASKS, payload: data as any });
//       }
//     };

//     fetchTasks();
//   }, []);

//   // 2. DEFINE HANDLERS (The "Smart" Logic)

//   // Add Task Handler
//   const handleAddTask = async (
//     taskData: Omit<
//       TaskType,
//       "id" | "created_at" | "user_id" | "startedAt" | "finishedAt" | "status"
//     >
//   ) => {
//     // Prepare object for Supabase
//     const newTaskPayload = {
//       taskName: taskData.taskName,
//       priority: taskData.priority,
//       status: "pending",
//       startedAt: new Date().toISOString(),
//       finishedAt: null,
//     };

//     const { data, error } = await supabase
//       .from("tasks")
//       .insert(newTaskPayload)
//       .select()
//       .single();

//     if (error) {
//       console.error("Error adding task:", error);
//       alert("Failed to add task. See console for details.");
//     } else if (data) {
//       // Update local state immediately so user sees it
//       dispatch({ type: ActionKinds.ADD_NEW_TASK, payload: data });
//     }
//   };

//   // Finish Task Handler
//   const finishTask = async (id: number) => {
//     const finishedAt = new Date().toISOString();

//     const { error } = await supabase
//       .from("tasks")
//       .update({ status: "finished", finishedAt: finishedAt })
//       .eq("id", id);

//     if (error) {
//       console.error("Error finishing task:", error);
//     } else {
//       // Find the task in local state to update it correctly in reducer
//       const taskToUpdate = tasks.find((t) => t.id === id);
//       if (taskToUpdate) {
//         const updatedTask = { ...taskToUpdate, status: "finished", finishedAt };
//         dispatch({
//           type: ActionKinds.FINISHED_TASK,
//           payload: updatedTask as any,
//         });
//       }
//     }
//   };

//   // Delete Task Handler
//   const deleteTask = async (id: number) => {
//     const { error } = await supabase.from("tasks").delete().eq("id", id);

//     if (error) {
//       console.error("Error deleting task:", error);
//     } else {
//       dispatch({ type: ActionKinds.DELETE_TASK, payload: id.toString() });
//     }
//   };

//   // Bundle handlers to pass to TasksWrapper
//   const taskHandlers: TaskHandlers = {
//     finishTask,
//     deleteTask,
//   };

//   // 3. RENDER THE DASHBOARD
//   return (
//     <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
//       <div className="max-w-4xl mx-auto space-y-8">
//         {/* Header Section */}
//         <div className="text-center">
//           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
//             BranchBoost <span className="text-sky-500">Dashboard</span>
//           </h1>
//           <p className="mt-2 text-lg text-slate-600">
//             Manage your engineering tasks efficiently.
//           </p>
//         </div>

//         {/* Form Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
//           <TaskForm handleAddTask={handleAddTask} />
//         </div>

//         {/* Tasks List Section */}
//         <TasksWrapper
//           tasks={tasks}
//           dispatch={dispatch}
//           taskHandlers={taskHandlers}
//         />
//       </div>
//     </main>
//   );
// }


//src\app\page.tsx

//Is this person logged in? If yes, go to Dashboard. If no, go to Login.

//Server-Side Redirect.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If logged in, send to the GOOD dashboard
    redirect("/dashboard");
  } else {
    // If NOT logged in, send to Login
    redirect("/login");
  }
}