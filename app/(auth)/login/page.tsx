"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signIn, AuthActionState } from "@/app/actions/auth";
import { AuthAlert } from "@/app/components/auth/AuthAlert";

// ─── Brand Left Panel ─────────────────────────────────────────────────────────

function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1e1b4b] to-[#312e81] z-0" />
      {/* Animated Glows */}
      <div
        className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen blur-[128px] opacity-40 animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-screen blur-[128px] opacity-30 animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-12 lg:p-20 justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="material-symbols-outlined text-white text-xl">
              school
            </span>
          </div>
          <span className="font-[family-name:var(--font-outfit)] font-bold text-2xl tracking-tight text-white">
            UniEvents
          </span>
        </div>
        {/* Hero Copy */}
        <div className="space-y-8">
          <h1 className="font-[family-name:var(--font-outfit)] font-bold text-5xl xl:text-6xl leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Discover.
            <br />
            Register.
            <br />
            Celebrate.
          </h1>
          <p className="text-lg text-gray-400 max-w-md">
            Your ultimate portal for university events, club gatherings, and
            campus life. Stay connected, effortlessly.
          </p>
          {/* Feature List */}
          <div className="space-y-6 pt-4">
            {[
              {
                icon: "grid_view",
                title: "Browse Events",
                desc: "Find exactly what you're looking for.",
              },
              {
                icon: "event_available",
                title: "Register Easily",
                desc: "Secure your spot with one click.",
              },
              {
                icon: "notifications_active",
                title: "Stay Updated",
                desc: "Never miss a campus announcement.",
              },
            ].map((f) => (
              <div key={f.title} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-indigo-400">
                    {f.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-outfit)] font-medium text-white text-lg">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-full selection:bg-indigo-500/30 selection:text-indigo-200">
      <BrandPanel />

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile glow */}
        <div className="absolute inset-0 bg-[#0a0a0f] lg:hidden" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-700/20 rounded-full blur-[100px] lg:hidden" />

        <div className="w-full max-w-md relative z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] p-8 sm:p-10 rounded-2xl shadow-2xl">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center space-x-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">
                school
              </span>
            </div>
            <span className="font-[family-name:var(--font-outfit)] font-bold text-xl text-white">
              UniEvents
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-3xl text-white mb-2">
              Welcome back
            </h2>
            <p className="text-gray-400 text-sm">
              Sign in to your campus account
            </p>
          </div>

          {/* Error Banner */}
          <AuthAlert serverError={state?.error} />

          {/* Form */}
          <form action={formAction} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                University Email
              </label>
              <div
                className="relative group rounded-xl transition-all duration-300 border border-white/10 bg-white/5 focus-within:border-indigo-500/50"
                style={{ boxShadow: "none" }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 15px rgba(99,102,241,0.2)")
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-500 group-focus-within:text-indigo-400 transition-colors text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="student@university.edu"
                  className="block w-full pl-12 pr-4 py-3.5 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-sm rounded-xl outline-none"
                />
              </div>
              {state?.fieldErrors?.email && (
                <p className="mt-1 text-xs text-red-400">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative group rounded-xl transition-all duration-300 border border-white/10 bg-white/5 focus-within:border-indigo-500/50">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-500 group-focus-within:text-indigo-400 transition-colors text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-12 py-3.5 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-sm rounded-xl outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>
              {state?.fieldErrors?.password && (
                <p className="mt-1 text-xs text-red-400">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember-me"
                  className="h-4 w-4 rounded border-gray-600 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                />
                <span className="text-gray-400">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 text-gray-500 bg-[#0f0f1a] rounded-md">
                or continue with
              </span>
            </div>
          </div>

          {/* Google SSO */}
          <a
            href="/api/auth/google"
            className="mt-6 w-full inline-flex justify-center items-center gap-3 py-3 px-4 border border-white/10 rounded-xl bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google SSO
          </a>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
