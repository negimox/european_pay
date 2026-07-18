"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MyRegistrationsList } from "@/app/components/dashboard/MyRegistrationsList";
import { LinkBreadcrumb } from "@/app/components/dashboard/LinkBreadcrumb";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const res = await fetch("/api/user/registrations");
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error("Failed to fetch registrations", error);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Registration cancelled successfully");
        fetchRegistrations();
      } else {
        toast.error(data.error || "Failed to cancel registration");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-x-hidden bg-surface">
      {/* Breadcrumbs */}
<LinkBreadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "My Events" }]} />

      <h1 className="font-display-lg text-display-lg text-primary mb-6">
        My Events
      </h1>
      <MyRegistrationsList
        registrations={registrations}
        loading={loadingRegistrations}
        onCancel={handleCancelRegistration}
      />
    </main>
  );
}
