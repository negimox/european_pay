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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DashboardContent({ 
  userName,
  initialEvents = [],
  initialRegistrations = [],
  initialAnnouncements = []
}: { 
  userName: string;
  initialEvents?: any[];
  initialRegistrations?: any[];
  initialAnnouncements?: any[];
}) {
  const router = useRouter();

  const [events, setEvents] = useState<any[]>(initialEvents);
  const [registrations, setRegistrations] = useState<any[]>(initialRegistrations);
  const [announcements, setAnnouncements] = useState<any[]>(initialAnnouncements);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const getRelativeTime = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    return "";
  };

  const handleRegister = async (eventId: string) => {
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
        // refresh data
        setLoadingEvents(true);
        fetch("/api/events")
          .then((res) => res.json())
          .then((data) => setEvents(data.events || []))
          .finally(() => setLoadingEvents(false));
        setLoadingRegistrations(true);
        fetch("/api/user/registrations")
          .then((res) => res.json())
          .then((data) => setRegistrations(data.registrations || []))
          .finally(() => setLoadingRegistrations(false));
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
      new Date(e.startAt) > new Date() &&
      new Date(e.startAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  ).length;

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-x-hidden bg-surface">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant mb-lg"
      >
        <Link
          href="/dashboard"
          prefetch={false}
          className="hover:text-primary transition-colors"
        >
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface font-medium truncate">Overview</span>
      </nav>

      {/* Greeting */}
      <section className="mb-lg select-none">
        <h1 className="hidden md:block font-display-lg text-display-lg text-primary mb-2">
          Welcome back {userName}
        </h1>
        <h1 className="md:hidden font-display-lg-mobile text-display-lg-mobile text-primary mb-2">
          Welcome back {userName}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Here is what's happening around campus today.
        </p>
      </section>

      {/* Quick Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
        <Card
          className="bg-primary text-on-primary rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)] relative overflow-hidden group cursor-pointer border-none select-none"
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
        <section className="lg:col-span-8 min-w-0">
          <Carousel className="w-full">
            <div className="flex justify-between items-center mb-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Upcoming Events for You
              </h2>
              <div className="flex items-center gap-4">
                <div className="hidden xl:flex items-center gap-2">
                  <CarouselPrevious className="static translate-y-0" />
                  <CarouselNext className="static translate-y-0" />
                </div>
                <Link
                  href="/dashboard/events"
                  className="font-label-md text-label-md text-secondary hover:text-primary transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>

            <CarouselContent className="-ml-4">
              {loadingEvents ? (
                [...Array(3)].map((_, i) => (
                  <CarouselItem
                    key={i}
                    className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="animate-pulse bg-surface-container-low rounded-xl h-[300px] w-full" />
                  </CarouselItem>
                ))
              ) : events.length === 0 ? (
                <p className="text-on-surface-variant p-4">
                  No upcoming events found.
                </p>
              ) : (
                events.map((event) => (
                  <CarouselItem
                    key={event.id}
                    className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3"
                  >
                    <Card
                      onClick={() =>
                        router.push(`/dashboard/events/${event.id}`)
                      }
                      className="h-full bg-surface-container-lowest border-outline-variant rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group cursor-pointer p-0 select-none"
                    >
                      <div className="h-40 w-full relative overflow-hidden bg-surface-container flex items-center justify-center">
                        <img
                          src={event.bannerUrl || "/events/1.jpg"}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
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
                            {new Date(event.startAt).toLocaleDateString()}{" "}
                            {new Date(event.startAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            <span className="font-medium text-primary">({getRelativeTime(event.startAt)})</span>
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
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
          </Carousel>
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

          <Card className="bg-surface-container-low rounded-xl border-outline-variant flex flex-col h-[400px]">
            <ScrollArea className="h-full rounded-xl">
              <CardContent className="p-2 flex flex-col gap-2">
                {loadingAnnouncements ? (
                  <div className="p-4 animate-pulse bg-surface-container h-24 rounded-lg" />
                ) : announcements.length === 0 ? (
                  <p className="text-on-surface-variant p-4">
                    No announcements.
                  </p>
                ) : (
                  announcements.map((ann, idx) => (
                    <div
                      key={ann.id}
                      className="p-4 rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer group select-none"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
                          {ann.title}
                        </h4>
                        <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 ml-2">
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                        {ann.content}
                      </p>
                      {idx < announcements.length - 1 && (
                        <Separator className="mt-4 bg-outline-variant/50" />
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </section>
      </div>
    </main>
  );
}
