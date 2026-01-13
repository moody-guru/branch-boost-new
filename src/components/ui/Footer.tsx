import React from "react";
import { FaHeart, FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center text-slate-500 text-sm gap-2">
        <p className="flex items-center gap-1">
          Made with <FaHeart className="text-rose-500" /> by{" "}
          <span className="font-bold text-slate-700">moody-guru</span>
        </p>
        <span className="hidden md:inline">•</span>
        <a
          href="#"
          className="flex items-center gap-1 hover:text-sky-600 transition-colors"
        >
          <FaGithub /> BranchBoost
        </a>
      </div>
    </footer>
  );
};
