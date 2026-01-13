//src\app\dashboard\page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Components
import { TasksWrapper } from "@/features/tasks/components/TasksWrapper";
import { DailyMotivation } from "@/components/DailyMotivation";
import { Footer } from "@/components/ui/Footer";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              BranchBoost
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-slate-700"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Tasks (Wider) */}
          <div className="lg:col-span-2">
            <TasksWrapper />
          </div>

          {/* Right Column: Motivation (Narrower) */}
          <div className="lg:col-span-1">
            <DailyMotivation />
          </div>
        </div>
      </main>

    </div>
  );
}
