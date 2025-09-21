// src/components/ui/Footer.tsx
import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full text-center p-4 mt-auto">
      <p className="text-sm text-slate-500">
        Made with ❤️ by{" "}
        <a
          href="https://github.com/moody-guru" // Change this to your link
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-600 hover:text-sky-500 transition-colors"
        >
          moody-guru
        </a>
      </p>
    </footer>
  );
};
