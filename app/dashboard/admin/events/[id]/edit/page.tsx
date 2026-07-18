"use client";

import { useState, useEffect } from "react";
import { AdminEventForm } from "@/app/components/admin/AdminEventForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function EditEventPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setEvent(data.event);
      } catch (err) {
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  if (loading) {
    return <div className="p-margin-mobile md:p-margin-desktop">Loading event details...</div>;
  }

  if (!event) {
    return <div className="p-margin-mobile md:p-margin-desktop text-destructive">Event not found.</div>;
  }

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface-bright flex-1 overflow-x-hidden">
      <div className="mb-lg select-none flex items-center gap-4">
        <Link href="/dashboard/admin/events">
          <Button variant="ghost" size="icon">
            <span className="material-symbols-outlined">arrow_back</span>
          </Button>
        </Link>
        <div>
          <h2 className="font-headline-lg text-headline-lg lg:text-display-lg text-on-surface font-bold">
            Edit Event
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
            Make changes to the event details.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AdminEventForm initialData={event} />
      </div>
    </div>
  );
}
