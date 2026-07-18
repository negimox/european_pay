"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { EventCard } from "@/app/components/dashboard/EventCard";
import { AnnouncementsList } from "@/app/components/dashboard/AnnouncementsList";
import { MyRegistrationsList } from "@/app/components/dashboard/MyRegistrationsList";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function DashboardContent() {
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
    fetchAnnouncements();
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoadingEvents(false);
    }
  };

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

  const handleRegister = async (eventId: string) => {
    // Note: The actual registration flow will be updated to use a modal soon.
    // For now, redirect to the event details page where they can register.
    router.push(`/dashboard/events/${eventId}`);
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
        fetchEvents();
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

  const registeredEventIds = new Set(registrations.map((r) => r.eventId));
  const upcomingSessionsCount = events.filter(
    (e) =>
      new Date(e.date) > new Date() &&
      new Date(e.date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  ).length;

  // Default Overview Dashboard
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-x-hidden bg-surface">
      {/* Greeting */}
      <section className="mb-lg">
        <h1 className="hidden md:block font-display-lg text-display-lg text-primary mb-2">
          Welcome back!
        </h1>
        <h1 className="md:hidden font-display-lg-mobile text-display-lg-mobile text-primary mb-2">
          Welcome back!
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Here is what's happening around campus today.
        </p>
      </section>

      {/* Quick Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
        <Card
          className="bg-primary text-on-primary rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)] relative overflow-hidden group cursor-pointer border-none"
          onClick={() => router.push("/dashboard/registrations")}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <CardHeader className="relative z-10 flex flex-row justify-between items-start pb-2">
            <CardTitle className="font-label-md text-label-md text-on-primary/80 uppercase tracking-wider">
              Registered Events
            </CardTitle>
            <span className="material-symbols-outlined text-on-primary/80">
              event_available
            </span>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="font-headline-lg text-headline-lg">
              {registrations.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300">
          <CardHeader className="flex flex-row justify-between items-start pb-2">
            <CardTitle className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Pending Actions
            </CardTitle>
            <span className="material-symbols-outlined text-secondary">
              pending_actions
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-on-surface">
                0
              </span>
              <Badge
                variant="outline"
                className="font-label-sm text-label-sm rounded-full"
              >
                All caught up
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-on-secondary rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)] relative overflow-hidden group border-none">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-tl-full group-hover:scale-110 transition-transform duration-500 origin-bottom-right"></div>
          <CardHeader className="relative z-10 flex flex-row justify-between items-start pb-2">
            <CardTitle className="font-label-md text-label-md text-on-secondary/80 uppercase tracking-wider">
              Upcoming Sessions
            </CardTitle>
            <span className="material-symbols-outlined text-on-secondary/80">
              schedule
            </span>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="font-headline-lg text-headline-lg">
              {upcomingSessionsCount} This Week
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Layout: Events (Left) & Announcements (Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Events Section */}
        <section className="lg:col-span-8">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Upcoming Events for You
            </h2>
            <Link
              href="/dashboard/events"
              className="font-label-md text-label-md text-secondary hover:text-primary transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="flex gap-md overflow-x-auto pb-4 hide-scrollbar snap-x">
            {loadingEvents ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[280px] md:min-w-[320px] animate-pulse bg-surface-container-low rounded-xl h-[300px]"
                />
              ))
            ) : events.length === 0 ? (
              <p className="text-on-surface-variant p-4">
                No upcoming events found.
              </p>
            ) : (
              events.map((event) => (
                <Card
                  key={event.id}
                  onClick={() => router.push(`/dashboard/events/${event.id}`)}
                  className="min-w-[280px] md:min-w-[320px] bg-surface-container-lowest border-outline-variant rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col snap-start group cursor-pointer p-0"
                >
                  <div className="h-40 w-full relative overflow-hidden bg-surface-container flex items-center justify-center">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[64px] text-outline-variant">
                        event
                      </span>
                    )}
                    <Badge className="absolute top-3 left-3 bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm shadow-sm">
                      {event.category || "Event"}
                    </Badge>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="font-headline-md text-headline-md text-on-surface line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 mt-auto flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                      <span className="material-symbols-outlined text-[18px]">
                        calendar_month
                      </span>
                      <span>
                        {new Date(event.date).toLocaleDateString()}{" "}
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                      <span className="material-symbols-outlined text-[18px]">
                        location_on
                      </span>
                      <span>{event.venue}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Announcements Sidebar Section */}
        <section className="lg:col-span-4 flex flex-col">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Latest Announcements
            </h2>
            <Link
              href="/dashboard/announcements"
              className="font-label-md text-label-md text-secondary hover:text-primary transition-colors"
            >
              View All
            </Link>
          </div>

          <Card className="bg-surface-container-low rounded-xl border-outline-variant flex flex-col flex-1">
            <CardContent className="p-2 flex flex-col gap-2 flex-1">
              {loadingAnnouncements ? (
                <div className="p-4 animate-pulse bg-surface-container h-24 rounded-lg" />
              ) : announcements.length === 0 ? (
                <p className="text-on-surface-variant p-4">No announcements.</p>
              ) : (
                announcements.slice(0, 3).map((ann, idx) => (
                  <div
                    key={ann.id}
                    className="p-4 rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
                        {ann.title}
                      </h4>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                      {ann.content}
                    </p>
                    {idx < announcements.slice(0, 3).length - 1 && (
                      <Separator className="mt-4 bg-outline-variant/50" />
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-on-surface">Loading Dashboard...</div>}
    >
      <DashboardContent />
    </Suspense>
  );
}
