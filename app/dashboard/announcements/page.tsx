"use client";

import { useState, useEffect } from "react";
import { AnnouncementsList } from "@/app/components/dashboard/AnnouncementsList";
import { LinkBreadcrumb } from "@/app/components/dashboard/LinkBreadcrumb";

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
      <LinkBreadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Announcements" }]} />
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
