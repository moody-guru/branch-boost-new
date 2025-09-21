import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskHandlers } from "./TasksWrapper";
import {
  FaGripVertical,
  FaArrowUp,
  FaEquals,
  FaArrowDown,
} from "react-icons/fa";

interface TaskProps {
  id: number;
  taskName: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "finished";
  startedAt: string;
  finishedAt: string | null;
  taskHandlers: TaskHandlers;
}

// Helper to get priority icon and color
const PriorityIcon = ({ priority }: { priority: TaskProps["priority"] }) => {
  const styles = "mr-2 flex-shrink-0";
  if (priority === "high")
    return <FaArrowUp className={`text-red-500 ${styles}`} />;
  if (priority === "medium")
    return <FaEquals className={`text-yellow-500 ${styles}`} />;
  return <FaArrowDown className={`text-green-500 ${styles}`} />;
};

export const Task = ({
  id,
  taskName,
  priority,
  status,
  startedAt,
  finishedAt,
  taskHandlers,
}: TaskProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms ease",
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusColor =
    status === "pending" ? "border-sky-500" : "border-green-500";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative flex items-center bg-white p-4 rounded-lg shadow-sm border-l-4 ${statusColor} gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="cursor-grab touch-none text-slate-400 hover:text-slate-900 transition-colors"
      >
        <FaGripVertical size={16} />
      </div>

      {/* Main Info Section */}
      <div className="flex-grow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="flex items-center font-bold text-slate-800">
            <PriorityIcon priority={priority} />
            {taskName}
          </p>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 pl-6">
            <span>Started: {formatDate(startedAt)}</span>
            {status === "finished" && (
              <span>Finished: {formatDate(finishedAt)}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 self-end sm:self-center">
          {status === "pending" && (
            <button
              className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105"
              onClick={() => taskHandlers.finishTask(id)}
            >
              Finish
            </button>
          )}
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white text-xs font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105"
            onClick={() => taskHandlers.deleteTask(id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
