import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskHandlers } from "../store";
import {
  FaRegStickyNote,
  FaMagic,
  FaCheck,
  FaTrash,
  FaGripVertical,
} from "react-icons/fa";

const MobileLabel = ({ label }: { label: string }) => (
  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider md:hidden block mb-1">
    {label}
  </span>
);

interface TaskProps {
  taskName: string;
  priority: string;
  status: string;
  startedAt?: string | Date;
  finishedAt?: string | Date;
  id: string;
  notes?: string;
  taskHandlers: TaskHandlers;
  onAskAI: (taskName: string, id: string) => void;
  onOpenNotes: (taskName: string, notes: string, id: string) => void;
}

export const Task = ({
  taskName,
  priority,
  status,
  startedAt,
  id,
  notes,
  taskHandlers,
  onAskAI,
  onOpenNotes,
}: TaskProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as "relative",
    touchAction: "none", // Critical for mobile dragging
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return "-";
    }
  };

  const priorityColor =
    priority === "high"
      ? "bg-red-100 text-red-700 border-red-200"
      : priority === "medium"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-green-100 text-green-700 border-green-200";

  const statusColor =
    status === "finished"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-slate-100 text-slate-600 border-slate-200";
  const hasNotes = notes && notes.trim().length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white hover:bg-slate-50 transition-all group rounded-lg border border-slate-200 shadow-sm mb-3 md:mb-0 md:border-0 md:shadow-none md:rounded-none md:border-b md:flex md:items-center p-4 md:p-3 gap-3 md:gap-0 relative"
    >
      {/* Drag Handle - Larger Touch Target for Mobile */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-2 md:p-0 md:static md:pr-4 cursor-grab text-slate-300 hover:text-slate-600 transition-colors z-10"
      >
        <FaGripVertical size={20} />
      </div>

      {/* Task Name */}
      <div className="md:flex-1 md:w-1/4 font-semibold text-slate-800 text-lg md:text-sm mb-3 md:mb-0 pr-10 md:pr-0">
        {taskName}
      </div>

      {/* Meta Data */}
      <div className="flex flex-wrap gap-y-3 gap-x-6 md:contents">
        <div className="md:w-1/6 flex flex-col">
          <MobileLabel label="Priority" />
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${priorityColor} w-fit`}
          >
            {priority}
          </span>
        </div>

        <div className="md:w-1/6 flex flex-col">
          <MobileLabel label="Status" />
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${statusColor} w-fit`}
          >
            {status}
          </span>
        </div>

        <div className="md:w-1/6 flex flex-col text-sm text-slate-600">
          <MobileLabel label="Started" />
          <span className="md:hidden">Started: </span>
          {formatDate(startedAt)}
        </div>
      </div>

      {/* Actions */}
      <div className="md:w-1/4 md:ml-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex gap-2 justify-center items-center">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onOpenNotes(taskName, notes || "", id)}
          className={`p-2 rounded-lg transition-all relative mr-1 ${
            hasNotes
              ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
              : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
          }`}
          title="Edit Notes"
        >
          <FaRegStickyNote size={18} />
          {hasNotes && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onAskAI(taskName, id)}
          className="flex items-center justify-center px-3 py-1.5 bg-purple-100 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-200 transition-all"
        >
          <FaMagic size={14} className="mr-1" />{" "}
          <span className="hidden lg:inline">Ask AI</span>
        </button>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => taskHandlers.finishTask(status, id)}
          className="flex items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-200 transition-all"
        >
          <FaCheck size={14} className="mr-1" />{" "}
          <span className="hidden lg:inline">Finish</span>
        </button>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => taskHandlers.deleteTask(id)}
          className="flex items-center justify-center px-3 py-1.5 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-200 transition-all"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
};
