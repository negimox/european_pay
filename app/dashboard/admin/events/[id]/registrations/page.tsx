"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminRegistrationsPage() {
  const params = useParams();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await fetch(`/api/admin/events/${params.id}/registrations`);
        if (!res.ok) throw new Error("Failed to fetch registrations");
        const data = await res.json();
        setRegistrations(data.registrations || []);
      } catch (err) {
        toast.error("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchRegistrations();
    }
  }, [params.id]);

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
            Event Registrations
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
            View all users registered for this event.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container text-on-surface-variant font-label-md border-b border-outline-variant">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Registration Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-on-surface-variant">
                    Loading registrations...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-on-surface-variant">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-medium flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reg.user.avatarUrl || ""} alt={reg.user.firstName} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {reg.user.firstName.charAt(0)}{reg.user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {reg.user.firstName} {reg.user.lastName || ""}
                      </span>
                    </td>
                    <td className="px-4 py-3">{reg.user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {format(new Date(reg.registeredAt), "MMM d, yyyy h:mm a")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 text-xs font-bold">
                        {reg.status}
                      </span>
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
