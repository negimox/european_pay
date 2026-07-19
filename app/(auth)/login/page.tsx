"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, AuthActionState } from "@/app/actions/auth";
import { AuthAlert } from "@/app/components/auth/AuthAlert";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<
    AuthActionState,
    FormData
  >(signIn, {});

  return (
    <div className="bg-surface text-on-surface font-body-md h-screen w-full flex overflow-hidden">
      <main className="flex w-full h-full">
        {/* Left Side: Visual / Brand Area */}
        <section className="hidden lg:flex flex-col justify-between w-1/2 p-[64px] relative bg-surface-container-lowest">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-[80px]">
              <Image
                src="/web-app-manifest-512x512.png"
                alt="UniEvent Logo"
                width={32}
                height={32}
              />
              <span className="font-headline-sm text-headline-lg text-primary">
                UniEvent
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface max-w-[512px]">
              Connect with your campus community.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-[24px] max-w-[448px]">
              Access events, clubs, and resources all in one place. Stay in the
              pulse of university life.
            </p>
          </div>
          {/* Image Container */}
          <div className="absolute inset-y-0 right-0 w-full h-full z-0 overflow-hidden shadow-xl ml-auto border-l border-outline-variant/30">
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest to-transparent z-10"></div>
            <Image
              src="/bg.jpg"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-[16px] sm:p-[24px] lg:p-[64px] overflow-y-auto bg-surface-container-lowest relative z-20">
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
                Welcome Back
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Please sign in to your account.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mt-[4px]">
                (Testing: For admin access login through - admin@test.com |
                Admin1234)
              </p>
            </div>

            <AuthAlert serverError={state?.error} />

            <form action={formAction} className="space-y-5">
              {/* Email Input */}
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
                    placeholder="student@university.edu"
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

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-[4px]">
                  <label
                    className="block font-label-md text-label-md text-on-surface"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link
                    href="#"
                    className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
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

              {/* Sign In Button */}
              <div className="pt-4">
                <button
                  className="w-full flex justify-center items-center py-3.5 px-4 bg-secondary text-on-secondary font-label-md text-label-md rounded shadow-sm hover:shadow-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={pending}
                >
                  {pending ? "Signing In..." : "Sign In"}
                  {!pending && (
                    <span className="material-symbols-outlined ml-2 text-xl group-hover:translate-x-1 transition-transform">
                      login
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
              Continue with Google
            </a>

            {/* Registration Link */}
            <div className="mt-8 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Don't have an account?{" "}
                <Link
                  className="font-label-md text-label-md text-primary hover:text-secondary transition-colors inline-flex items-center gap-1 ml-1 group"
                  href="/register"
                >
                  Register here
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
                    person_add
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
