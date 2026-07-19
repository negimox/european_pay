"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomCalendar, CalendarEvent } from "@/components/calendar/CustomCalendar";
import { LinkBreadcrumb } from "@/app/components/dashboard/LinkBreadcrumb";
import { EventCard } from "@/app/components/dashboard/EventCard";

export default function CalendarPage() {
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [fallbackEvents, setFallbackEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user registrations
      const regRes = await fetch("/api/user/registrations");
      let userRegistrations: any[] = [];
      if (regRes.ok) {
        const data = await regRes.json();
        userRegistrations = data.registrations || [];
      }

      if (userRegistrations.length > 0) {
        // Map registrations to CalendarEvents
        const calendarEvents: CalendarEvent[] = userRegistrations.map((reg: any) => ({
          id: reg.eventId,
          title: reg.event.title,
          date: reg.event.startAt,
          color: "bg-green-500/10 text-green-700 border-green-500/20 border"
        }));
        setEvents(calendarEvents);
      } else {
        // 2. Fetch all events for fallback if no registrations
        const eventRes = await fetch("/api/events");
        if (eventRes.ok) {
          const data = await eventRes.json();
          const allEvents = data.events || [];
          const randomEvents = allEvents.sort(() => 0.5 - Math.random()).slice(0, 3);
          
          const calendarEvents: CalendarEvent[] = randomEvents.map((ev: any) => ({
            id: ev.id,
            title: ev.title,
            date: ev.startAt,
            color: "bg-surface-variant text-on-surface-variant opacity-70 border-outline-variant border-dashed border"
          }));
          
          setEvents(calendarEvents);
          setFallbackEvents(randomEvents);
        }
      }
    } catch (error) {
      console.error("Failed to fetch calendar data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    router.push(`/dashboard/events/${event.id}`);
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-x-hidden bg-surface pb-32">
      <LinkBreadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Calendar View" }]} />
      
      <h1 className="font-display-lg text-display-lg text-primary mb-6 mt-2">
        Calendar View
      </h1>

      {loading ? (
        <div className="w-full h-[600px] bg-surface-container animate-pulse rounded-2xl"></div>
      ) : (
        <div className="flex flex-col gap-12">
          <CustomCalendar events={events} onEventClick={handleEventClick} />

          {fallbackEvents.length > 0 && (
            <div className="flex flex-col gap-4 pt-8 border-t border-outline-variant">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Discover Events
                  </h2>
                  <p className="text-body-md text-on-surface-variant mt-1">
                    You haven't registered for any events yet. Here are some you might like:
                  </p>
                </div>
                <Link
                  href="/dashboard/events"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                {fallbackEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => router.push(`/dashboard/events/${event.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
