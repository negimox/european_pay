"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp, AuthActionState } from "@/app/actions/auth";
import { AuthAlert } from "@/app/components/auth/AuthAlert";

// ─── Password Strength ────────────────────────────────────────────────────────

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–4
}

const strengthConfig = [
  { label: "Too weak", color: "bg-red-500" },
  { label: "Weak", color: "bg-orange-500" },
  { label: "Fair", color: "bg-yellow-500" },
  { label: "Good", color: "bg-emerald-400" },
  { label: "Strong", color: "bg-green-500" },
];

// ─── Brand Left Panel ─────────────────────────────────────────────────────────

function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1e1b4b] to-[#312e81] z-0" />
      <div
        className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen blur-[128px] opacity-40 animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-violet-400 rounded-full mix-blend-screen blur-[128px] opacity-30 animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div className="relative z-10 flex flex-col h-full p-12 lg:p-20 justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="material-symbols-outlined text-white text-xl">
              local_library
            </span>
          </div>
          <span className="font-[family-name:var(--font-outfit)] font-bold text-2xl tracking-tight text-white">
            UniEvents
          </span>
        </div>
        {/* Hero Copy */}
        <div className="space-y-8">
          <h1 className="font-[family-name:var(--font-outfit)] font-extrabold text-5xl xl:text-6xl leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Discover.
            <br />
            Register.
            <br />
            Celebrate.
          </h1>
          <p className="text-lg text-white/60 max-w-md">
            Your unified portal for everything happening on campus. Connect,
            engage, and make the most of your college experience.
          </p>
          {/* Feature List */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            {[
              {
                icon: "school",
                title: "Browse Events",
                desc: "Find seminars, parties, and club meetings all in one place.",
              },
              {
                icon: "event_available",
                title: "Register Easily",
                desc: "Secure your spot with one-click RSVP functionality.",
              },
              {
                icon: "campaign",
                title: "Stay Updated",
                desc: "Get real-time notifications about event changes and updates.",
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all duration-300">
                  <span className="material-symbols-outlined text-indigo-400">
                    {f.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-outfit)] font-bold text-lg text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-white/50 text-sm">{f.desc}</p>
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

// ─── Register Page ────────────────────────────────────────────────────────────

const initialState: AuthActionState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const strength = getPasswordStrength(password);
  const strengthInfo = strengthConfig[strength] ?? strengthConfig[0];

  return (
    <div className="flex min-h-screen w-full selection:bg-indigo-500/30 selection:text-indigo-200">
      <BrandPanel />

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile glow */}
        <div className="absolute inset-0 bg-[#0a0a0f] lg:hidden" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-700/20 rounded-full blur-[100px] lg:hidden" />

        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2 z-20">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">
              local_library
            </span>
          </div>
          <span className="font-[family-name:var(--font-outfit)] font-bold text-xl text-white">
            UniEvents
          </span>
        </div>

        <div className="w-full max-w-md relative z-10 mt-16 lg:mt-0">
          {/* Glass Card */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

            <div className="relative z-10">
              {/* Header */}
              <div className="mb-7">
                <h2 className="font-[family-name:var(--font-outfit)] font-extrabold text-3xl text-white mb-1.5">
                  Create your account
                </h2>
                <p className="text-slate-400 text-sm">
                  Join your campus community today and never miss out.
                </p>
              </div>

              {/* Error Banner */}
              <AuthAlert serverError={state?.error} />

              {/* Form */}
              <form action={formAction} className="space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="firstName"
                      className="block text-xs font-medium text-white/70 ml-1"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Jane"
                      autoComplete="given-name"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                    {state?.fieldErrors?.name && (
                      <p className="text-xs text-red-400">
                        {state.fieldErrors.name[0]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="lastName"
                      className="block text-xs font-medium text-white/70 ml-1"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      autoComplete="family-name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Hidden combined name field */}
                <input type="hidden" name="name" id="name-combined" />

                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-white/70 ml-1"
                  >
                    University Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-white/40 text-[20px]">
                        mail
                      </span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane.doe@university.edu"
                      autoComplete="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  {state?.fieldErrors?.email && (
                    <p className="text-xs text-red-400 ml-1">
                      {state.fieldErrors.email[0]}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-white/70 ml-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-white/40 text-[20px]">
                        lock
                      </span>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>

                  {/* Strength Bar */}
                  {password.length > 0 && (
                    <div className="pt-1 px-1">
                      <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-white/10">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthInfo.color : ""}`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-white/40 mt-1 text-right">
                        {strengthInfo.label}
                      </p>
                    </div>
                  )}
                  {state?.fieldErrors?.password && (
                    <p className="text-xs text-red-400 ml-1">
                      {state.fieldErrors.password[0]}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-white/70 ml-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-white/40 text-[20px]">
                        verified_user
                      </span>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showConfirm ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 transition-colors cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-white/60 cursor-pointer leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={isPending}
                  onClick={(e) => {
                    // Combine first + last name into hidden field before submit
                    const form = e.currentTarget.form;
                    if (form) {
                      const first =
                        (form.querySelector("#firstName") as HTMLInputElement)
                          ?.value ?? "";
                      const last =
                        (form.querySelector("#lastName") as HTMLInputElement)
                          ?.value ?? "";
                      const combined = `${first} ${last}`.trim();
                      const hidden = form.querySelector(
                        "#name-combined",
                      ) as HTMLInputElement;
                      if (hidden) hidden.value = combined;
                    }
                  }}
                  className="w-full mt-2 flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-[family-name:var(--font-outfit)] font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isPending ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-7 mb-5 flex items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink-0 mx-4 text-xs text-white/40 uppercase tracking-wider">
                  or sign up with
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              {/* Google SSO */}
              <a
                href="/api/auth/google"
                className="w-full flex justify-center items-center gap-3 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-300"
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
                Continue with Google
              </a>

              {/* Sign In Link */}
              <p className="mt-7 text-center text-sm text-white/50">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-white hover:text-indigo-400 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
