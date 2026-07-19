"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function VerifyUI({ success, message }: { success: boolean; message: string }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="w-[90%] max-w-[480px] bg-white rounded-lg shadow-md border border-outline-variant/30 p-8 text-center mx-auto shrink-0 min-w-[300px]">
      <div className="flex justify-center mb-6">
        <Image
          src="/web-app-manifest-512x512.png"
          alt="UniEvent Logo"
          width={48}
          height={48}
        />
      </div>
      
      {success ? (
        <div>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
          </div>
          <h1 className="font-headline-md text-headline-md mb-2">Email Verified</h1>
          <p className="text-on-surface-variant mb-6">{message}</p>
          <p className="text-on-surface-variant/70 text-sm mb-8">
            Redirecting to login in {countdown}s...
          </p>
          <Link
            href="/login"
            className="inline-flex justify-center items-center py-3 px-6 w-full sm:w-auto bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <div>
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-error text-3xl">error</span>
          </div>
          <h1 className="font-headline-md text-headline-md mb-2">Verification Failed</h1>
          <p className="text-on-surface-variant mb-6">{message}</p>
          <p className="text-on-surface-variant/70 text-sm mb-8">
            Redirecting to login in {countdown}s...
          </p>
          <Link
            href="/login"
            className="inline-flex justify-center items-center py-3 px-6 w-full sm:w-auto bg-surface-bright border border-outline-variant text-on-surface rounded font-label-md text-label-md hover:bg-surface-container transition-colors"
          >
            Return to Login
          </Link>
        </div>
      )}
    </div>
  );
}
