"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signUp, AuthActionState } from "@/app/actions/auth";
import { AuthAlert } from "@/app/components/auth/AuthAlert";
import { LegalModal } from "@/app/components/auth/LegalModal";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<
    AuthActionState,
    FormData
  >(signUp, {});

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex selection:bg-secondary-container selection:text-on-secondary-container">
      <main className="flex w-full min-h-screen">
        {/* Left Side: Inspirational Imagery (Hidden on smaller screens) */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-surface-container overflow-hidden items-end p-[64px]">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMvnOJROQCSy8BBr1Gafo8fSnIq4S1W8WVHfVkC8Qtnzp9RNRhRFfjbqfd6t53YnGh8kny8rkd-SoRNx8Gaqxnf6exfyp1YwQU8O-fFe2t8CB68YdnCTpWO4oHCaBkQrzybA-Mfjw8MnAnuStXlHLQkGjwF5hk1Y7yAn5saG28dFMoB9A3Vgt6xaD5ynIZqu8YCEwQFgsRrpsEsuO1fATGqDB8QlSB16Bw3CqNUfRD9OCNfQTdjBb2ug")',
            }}
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-on-surface/80 via-on-surface/30 to-transparent"></div>

          {/* Branding / Inspirational Text */}
          <div className="relative z-20 text-on-primary w-full max-w-lg">
            <div className="flex items-center gap-2 mb-[24px]">
              <Image
                src="/web-app-manifest-512x512.png"
                alt="UniEvent Logo"
                width={36}
                height={36}
              />
              <span className="font-headline-lg text-headline-lg font-bold tracking-tight">
                UniEvent
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg mb-4 text-white drop-shadow-sm">
              Join the vibrant campus ecosystem.
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 drop-shadow-sm">
              Connect with organizations, discover events, and manage your
              academic life in one modern platform.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-[16px] sm:p-[24px] lg:p-[64px] overflow-y-auto">
          <div className="w-full max-w-[480px] bg-surface rounded-lg sm:bg-white sm:shadow-[0_4px_24px_rgba(0,0,0,0.02)] sm:border sm:border-outline-variant/30 sm:p-8 transition-all duration-300">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center gap-2 mb-8 lg:hidden text-primary">
              <Image
                src="/web-app-manifest-512x512.png"
                alt="UniEvent Logo"
                width={32}
                height={32}
              />
              <span className="font-headline-sm text-headline-md font-bold">
                UniEvent
              </span>
            </div>

            {/* Form Header */}
            <div className="mb-8 text-center sm:text-left">
              <h2 className="font-headline-lg-mobile sm:font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface mb-2">
                Create Student Account
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter your details to get started.
              </p>
            </div>

            <AuthAlert serverError={state?.error} />

            {/* Registration Form */}
            <form action={formAction} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-[4px]"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    person
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-outline-variant bg-surface-bright text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    required
                    type="text"
                  />
                </div>
                {state?.fieldErrors?.name && (
                  <p className="mt-1 text-xs text-error">
                    {state.fieldErrors.name[0]}
                  </p>
                )}
              </div>

              {/* University Email */}
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-[4px]"
                  htmlFor="email"
                >
                  University Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    mail
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-outline-variant bg-surface-bright text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    id="email"
                    name="email"
                    placeholder="jane.doe@university.edu"
                    required
                    type="email"
                  />
                </div>
                {state?.fieldErrors?.email && (
                  <p className="mt-1 text-xs text-error">
                    {state.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-[4px]"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    lock
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-outline-variant bg-surface-bright text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                </div>
                {state?.fieldErrors?.password && (
                  <p className="mt-1 text-xs text-error">
                    {state.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start mt-6">
                <div className="flex items-center h-5">
                  <input
                    className="w-5 h-5 bg-surface-bright border-outline-variant rounded text-secondary focus:ring-secondary focus:ring-offset-surface cursor-pointer"
                    id="terms"
                    name="terms"
                    required
                    type="checkbox"
                  />
                </div>
                <div className="ml-3">
                  <label
                    className="font-body-md text-body-md text-on-surface-variant cursor-pointer"
                    htmlFor="terms"
                  >
                    I agree to the{" "}
                    <LegalModal
                      type="terms"
                      trigger={
                        <span className="font-medium text-secondary hover:text-primary transition-colors underline decoration-secondary/30 underline-offset-2">
                          Terms of Service
                        </span>
                      }
                    />{" "}
                    and{" "}
                    <LegalModal
                      type="privacy"
                      trigger={
                        <span className="font-medium text-secondary hover:text-primary transition-colors underline decoration-secondary/30 underline-offset-2">
                          Privacy Policy
                        </span>
                      }
                    />
                    .
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  className="w-full flex justify-center items-center py-3.5 px-4 bg-secondary text-on-secondary font-label-md text-label-md rounded shadow-sm hover:shadow-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={pending}
                >
                  {pending ? "Creating Account..." : "Create Account"}
                  {!pending && (
                    <span className="material-symbols-outlined ml-2 text-xl group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-[12px] my-[24px]">
              <div className="h-px bg-outline-variant flex-1"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                OR
              </span>
              <div className="h-px bg-outline-variant flex-1"></div>
            </div>

            {/* SSO Option */}
            <a
              href="/api/auth/google"
              className="w-full bg-transparent border border-primary text-primary font-label-md text-label-md py-3.5 rounded hover:bg-primary/5 transition-colors flex items-center justify-center gap-[12px]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              Sign in with Google
            </a>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Already have an account?{" "}
                <Link
                  className="font-label-md text-label-md text-primary hover:text-secondary transition-colors inline-flex items-center gap-1 ml-1 group"
                  href="/login"
                >
                  Log in
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
                    login
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
