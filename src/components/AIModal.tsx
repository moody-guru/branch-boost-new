import React, { useState } from "react";
// Use react-icons for better UI
import { FaCopy, FaTimes, FaRobot } from "react-icons/fa";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskName: string;
  // onSaveToNotes is removed, we don't need it anymore
}

export const AIModal = ({ isOpen, onClose, taskName }: AIModalProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Cleaner function (same as before)
  const formatResponse = (text: string) => {
    return text
      .replace(/##/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "•")
      .trim();
  };

  const handleAskAI = async () => {
    setLoading(true);
    setError("");
    setCopied(false);
    try {
      const response = await fetch("/api/suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskName: taskName }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSuggestion(formatResponse(data.suggestion));
    } catch (err: any) {
      setError(err.message || "Failed to fetch suggestion");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Handle Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied" status after 2s
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-end sm:items-center justify-center backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[85vh] sm:max-h-[80vh]">
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaRobot className="text-purple-600" /> AI Assistant
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-white flex-grow">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="animate-pulse text-purple-600 font-medium flex flex-col items-center gap-2">
                <FaRobot size={32} className="animate-bounce" /> Thinking...
              </span>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
          ) : suggestion ? (
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">
                Suggestion for: "{taskName}"
              </h4>
              <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-100">
                {suggestion}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center gap-4">
              <FaRobot size={48} className="text-slate-200" />
              <p>
                Click "Generate" to get advice for <b>{taskName}</b>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
          {!suggestion ? (
            <button
              onClick={handleAskAI}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <FaRobot /> Generate
            </button>
          ) : (
            // NEW COPY BUTTON
            <button
              onClick={handleCopy}
              className={`px-6 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2 text-white ${
                copied
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-sky-500 hover:bg-sky-600"
              }`}
            >
              <FaCopy /> {copied ? "Copied!" : "Copy All"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
