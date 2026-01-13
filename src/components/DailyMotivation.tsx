"use client";
import React, { useEffect, useState } from "react";
import { FaLightbulb, FaQuoteLeft } from "react-icons/fa";

const quotes = [
  "The only way to do great work is to love what you do.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "Make it work, make it right, make it fast.",
  "Simplicity is the soul of efficiency.",
  "Before software can be reusable it first has to be usable.",
  "It’s not a bug; it’s an undocumented feature.",
  "Talk is cheap. Show me the code.",
  "Programming isn't about what you know; it's about what you can figure out.",
  "Action is the foundational key to all success.",
  "Don't watch the clock; do what it does. Keep going.",
];

export const DailyMotivation = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Select a random quote only on the client-side
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <FaLightbulb className="text-amber-400 text-xl" />
        <h2 className="text-lg font-bold text-slate-800">Daily Fuel</h2>
      </div>

      <div className="bg-slate-50 p-5 rounded-lg relative">
        <FaQuoteLeft className="text-slate-200 text-4xl absolute -top-2 -left-2 opacity-50" />
        <p className="text-slate-600 italic relative z-10 font-medium text-lg leading-relaxed">
          "{quote}"
        </p>
      </div>

      <p className="text-right text-xs text-slate-400 mt-3 font-semibold uppercase tracking-wider">
        - Keep Pushing
      </p>
    </div>
  );
};
