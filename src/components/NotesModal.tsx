//This is the pop-up where users will edit notes.

import React, { useState, useEffect } from "react";
import { FaRegSave, FaTimes, FaRegStickyNote } from "react-icons/fa";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskName: string;
  initialNotes: string;
  onSave: (notes: string) => void;
}

export const NotesModal = ({
  isOpen,
  onClose,
  taskName,
  initialNotes,
  onSave,
}: NotesModalProps) => {
  const [notes, setNotes] = useState(initialNotes);

  // Reset notes whenever the modal opens with new data
  useEffect(() => {
    setNotes(initialNotes || "");
  }, [initialNotes, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-end sm:items-center justify-center backdrop-blur-sm p-0 sm:p-4">
      // Modal Container
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[70vh] sm:h-auto sm:max-h-[80vh]">
        {/* Header */}
        <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2">
            <FaRegStickyNote /> Notes:{" "}
            <span className="truncate max-w-[200px]">{taskName}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content - Textarea */}
        <div className="p-4 flex-grow bg-amber-50/30">
          <textarea
            className="w-full h-full min-h-[200px] bg-white border border-amber-200 focus:border-amber-400 rounded-lg p-3 resize-none outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
            placeholder="Type your notes here or paste from AI..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 shadow-sm transition-all flex items-center gap-2"
          >
            <FaRegSave /> Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};
