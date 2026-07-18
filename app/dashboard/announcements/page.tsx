"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnnouncementsList } from "@/app/components/dashboard/AnnouncementsList";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-x-hidden bg-surface">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant mb-lg"
      >
        <Link
          href="/dashboard"
          className="hover:text-primary transition-colors"
        >
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface font-medium truncate">
          Announcements
        </span>
      </nav>
      <h1 className="font-display-lg text-display-lg text-primary mb-6">
        Announcements
      </h1>
      <AnnouncementsList
        announcements={announcements}
        loading={loadingAnnouncements}
      />
    </main>
  );
}
