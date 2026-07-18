"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminTabs } from "@/app/components/admin/AdminTabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the event "${title}"?\nThis action cannot be undone.`)) {
      return;
    }
    // Double verification
    const confirmName = window.prompt(`Please type "${title}" to confirm deletion:`);
    if (confirmName !== title) {
      toast.error("Deletion cancelled. Name did not match.");
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (err) {
      toast.error("Error deleting event");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface-bright flex-1 overflow-x-hidden">
      <div className="mb-lg select-none flex items-center justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg lg:text-display-lg text-on-surface font-bold">
            Admin Panel
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
            Manage platform resources and data.
          </p>
        </div>
        <Link href="/dashboard/admin/events/new">
          <Button>Create Event</Button>
        </Link>
      </div>

      <AdminTabs />

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container text-on-surface-variant font-label-md border-b border-outline-variant">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Registrations</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-on-surface-variant">
                    Loading events...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-on-surface-variant">
                    No events found. Create one to get started.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-medium">{event.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {format(new Date(event.startAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-surface-container-high px-2 py-1 text-xs font-medium text-on-surface">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {event._count.registrations} / {event.capacity}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/admin/events/${event.id}/registrations`}>
                          <Button variant="outline" size="sm" className="h-8">
                            Registrations
                          </Button>
                        </Link>
                        <Link href={`/dashboard/admin/events/${event.id}/edit`}>
                          <Button variant="outline" size="sm" className="h-8">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          disabled={deletingId === event.id}
                          onClick={() => handleDelete(event.id, event.title)}
                        >
                          {deletingId === event.id ? "..." : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
