import React, { useReducer, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// 1. Supabase Client
import { createClient } from "@/lib/supabase/client";

// 2. Import Types/Store
import {
  TasksReducer,
  ActionKinds,
  TaskHandlers,
  TaskType,
  TasksCollection,
  initialState,
} from "../store";

// 3. Components
import { ListOfTasks } from "./ListOfTasks";
import { TaskForm } from "./TaskForm";
import { AIModal } from "../../../components/AIModal";
import { NotesModal } from "../../../components/NotesModal";

export const TasksWrapper = () => {
  const supabase = createClient();
  const [tasks, dispatch] = useReducer(TasksReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [showTaskCreation, setShowTaskCreation] = useState(false);

  // Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeAiTask, setActiveAiTask] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [activeNotesTask, setActiveNotesTask] = useState<{
    id: string;
    name: string;
    notes: string;
  } | null>(null);

  // --- MOBILE SENSORS ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        const mappedTasks: TasksCollection = data.map((t: any) => ({
          id: t.id,
          taskName: t.task_name,
          priority: t.priority,
          status: t.status,
          startedAt: t.started_at,
          finishedAt: t.finished_at,
          notes: t.notes,
        }));
        dispatch({ type: ActionKinds.SET_TASKS, payload: mappedTasks });
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  // --- HANDLERS ---
  const handleAddTask = async (task: TaskType) => {
    // 1. Get the current logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to create a task");
      return;
    }

    // 2. Add to Supabase
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          task_name: task.taskName,
          priority: task.priority,
          status: task.status,
          started_at: task.startedAt,
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding task:", error);
    } else {
      // 3. UPDATE LOCAL STATE (FIXED: Uses ADD_NEW_TASK now)
      if (data && data.length > 0) {
        const newTaskFromDB = data[0];

        const newTaskForUI: TaskType = {
          id: newTaskFromDB.id,
          taskName: newTaskFromDB.task_name,
          priority: newTaskFromDB.priority,
          status: newTaskFromDB.status,
          startedAt: newTaskFromDB.started_at,
          finishedAt: newTaskFromDB.finished_at,
          notes: newTaskFromDB.notes || "",
        };

        // This line is now corrected to match your Store file:
        dispatch({ type: ActionKinds.ADD_NEW_TASK, payload: newTaskForUI });

        setShowTaskCreation(false);
      }
    }
  };

  const finishTask = async (status: string, id: string) => {
    if (status === "pending") {
      const finishedAt = new Date();
      const task = tasks.find((t) => t.id === id);
      if (task)
        dispatch({
          type: ActionKinds.FINISHED_TASK,
          payload: { ...task, status: "finished", finishedAt },
        });
      await supabase
        .from("tasks")
        .update({ status: "finished", finished_at: finishedAt.toISOString() })
        .eq("id", id);
    }
  };

  const deleteTask = async (id: string) => {
    dispatch({ type: ActionKinds.DELETE_TASK, payload: id });
    await supabase.from("tasks").delete().eq("id", id);
  };

  const updateNotes = async (id: string, newNotes: string) => {
    dispatch({
      type: ActionKinds.UPDATE_TASK_NOTES,
      payload: { id, notes: newNotes },
    });
    await supabase.from("tasks").update({ notes: newNotes }).eq("id", id);
  };

  const reorder = (
    list: TasksCollection,
    startIndex: number,
    endIndex: number,
  ) => {
    return arrayMove(list, startIndex, endIndex);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
      dispatch({ type: ActionKinds.ORDER_ITEMS, payload: reorderedTasks });
    }
  }

  // --- MODAL HANDLERS ---
  const handleAskAI = (taskName: string, id: string) => {
    setActiveAiTask({ id, name: taskName });
    setAiModalOpen(true);
  };

  const handleOpenNotes = (taskName: string, notes: string, id: string) => {
    setActiveNotesTask({ id, name: taskName, notes });
    setNotesModalOpen(true);
  };

  const handleSaveNotes = (newNotes: string) => {
    if (activeNotesTask) updateNotes(activeNotesTask.id, newNotes);
  };

  const taskHandlers: TaskHandlers = {
    finishTask,
    deleteTask,
    updateNotes,
    reorder,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            My Tasks
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Manage your engineering tasks efficiently.
          </p>
        </div>
        <button
          onClick={() => setShowTaskCreation(!showTaskCreation)}
          className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          {showTaskCreation ? "Close Form" : "+ New Task"}
        </button>
      </div>

      {/* Task Form */}
      {showTaskCreation && (
        <TaskForm showTaskCreation={true} onAddTask={handleAddTask} />
      )}

      {/* Task List */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-slate-100 min-h-[400px]">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading...</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <ListOfTasks
              tasks={tasks}
              taskHandlers={taskHandlers}
              onAskAI={handleAskAI}
              onOpenNotes={handleOpenNotes}
            />
          </DndContext>
        )}
      </div>

      <AIModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        taskName={activeAiTask?.name || ""}
      />
      <NotesModal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        taskName={activeNotesTask?.name || ""}
        initialNotes={activeNotesTask?.notes || ""}
        onSave={handleSaveNotes}
      />
    </div>
  );
};
