"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest font-body-md text-on-surface">
      <header className="w-full border-b border-outline-variant/20 bg-surface px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/web-app-manifest-512x512.png" alt="UniEvent Logo" width={32} height={32} />
          <span className="font-headline-md text-headline-md font-bold text-primary">UniEvent</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-error text-on-error rounded-lg font-label-md transition-all hover:bg-error/90 active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          {loading ? "Signing out..." : "Sign Out"}
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="font-display-md text-display-md text-on-surface mb-2">Student Dashboard</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Welcome to the UniEvent portal! Soon you will be able to discover and manage your campus events here.
          </p>
        </div>

        <div className="p-8 rounded-xl border border-outline-variant/30 bg-surface shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center">
          <span className="material-symbols-outlined text-[64px] text-primary/30 mb-4">
            event_upcoming
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Events Coming Soon</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            We are currently working on Phase 2 of the portal. Check back later to register for events!
          </p>
        </div>
      </main>
    </div>
  );
}
