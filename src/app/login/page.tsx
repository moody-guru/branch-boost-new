"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FaBrain, FaCodeBranch, FaChartLine } from "react-icons/fa";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  // ... (Your handleEmailSignIn and handleGoogleSignIn functions remain the same)
  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const password = (
      e.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(`Login failed: ${error.message}`);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) console.error("Google sign-in failed:", error.message);
  };

  return (
    // Main container with background image
    <div
      className="relative w-full min-h-[90vh] flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm"></div>

      {/* Login card - sits on top of the overlay */}
      <div className="relative z-10 w-full max-w-4xl bg-white/90 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden backdrop-blur-lg border border-white/20">
        {/* Left Column: Project Features */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-slate-800/80 text-white">
          <h1 className="text-4xl font-bold mb-4">BranchBoost</h1>
          <p className="mb-8 text-slate-300">
            Your personalized task manager, supercharged with AI to guide you
            through your engineering journey.
          </p>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <FaBrain className="text-sky-400 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">AI-Powered Guidance</h3>
                <p className="text-slate-400 text-sm">
                  Get actionable steps and suggestions for any task you create.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaCodeBranch className="text-sky-400 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Branch-Specific Roadmaps</h3>
                <p className="text-slate-400 text-sm">
                  Receive advice tailored to your specific engineering
                  discipline.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaChartLine className="text-sky-400 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Track Your Progress</h3>
                <p className="text-slate-400 text-sm">
                  Organize, prioritize, and accomplish your academic and career
                  goals.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Column: Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Welcome Back
          </h2>
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white/80"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white/80"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600 font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </button>
          </form>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/90 px-2 text-gray-500">Or</span>
            </div>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="mt-6 w-full flex items-center justify-center border border-gray-300 rounded-md py-2 px-4 shadow-sm hover:bg-gray-50 font-medium text-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
