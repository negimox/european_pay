"use client";

import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LinkBreadcrumb } from "@/app/components/dashboard/LinkBreadcrumb";
import { EventCard } from "@/app/components/dashboard/EventCard";
import { ShareModal } from "@/app/components/events/ShareModal";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the map to avoid SSR issues with Leaflet
const EventMap = dynamic(() => import("@/app/components/events/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex items-center gap-2 text-on-surface-variant text-sm">
        <span className="material-symbols-outlined text-[18px] animate-spin">
          progress_activity
        </span>
        Loading map…
      </div>
    </div>
  ),
});

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    checkRegistration();
  }, [resolvedParams.id]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/events`);
      if (res.ok) {
        const data = await res.json();
        const found = data.events?.find((e: any) => e.id === resolvedParams.id);
        if (found) {
          setEvent(found);
          let related =
            data.events?.filter(
              (e: any) => e.category === found.category && e.id !== found.id,
            ) || [];
          if (related.length === 0) {
            related = data.events?.filter((e: any) => e.id !== found.id) || [];
          }
          setRelatedEvents(related.slice(0, 2));
        } else {
          toast.error("Event not found");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const res = await fetch("/api/user/registrations");
      if (res.ok) {
        const data = await res.json();
        setIsRegistered(
          data.registrations?.some((r: any) => r.eventId === resolvedParams.id),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 w-full max-w-7xl mx-auto py-lg px-margin-mobile md:px-margin-desktop lg:px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 flex flex-col gap-xl">
            <div className="w-full h-[400px] rounded-xl bg-surface-container animate-pulse" />
            <div className="h-8 w-3/4 rounded-lg bg-surface-container animate-pulse" />
            <div className="h-48 rounded-xl bg-surface-container animate-pulse" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-64 rounded-xl bg-surface-container animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return <div className="p-8 text-on-surface">Event not found.</div>;
  }

  // FIX: The API returns _count.registrations (via Prisma _count include),
  // NOT a flat registrationsCount field. Read it correctly.
  const registrationCount: number = event._count?.registrations ?? 0;

  const getRelativeTime = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
    );
    const diffDays = Math.round(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    return "";
  };
  const seatsAvailable = Math.max(0, event.capacity - registrationCount);
  const isFull = seatsAvailable === 0;
  const progressPercentage =
    event.capacity > 0
      ? Math.min(100, (registrationCount / event.capacity) * 100)
      : 0;

  // Badge variant logic: map to explicit status strings for styling
  const registrationStatus = isRegistered
    ? "registered"
    : isFull
      ? "full"
      : "open";

  return (
    <>
      <main className="flex-1 w-full max-w-7xl mx-auto py-lg px-margin-mobile md:px-margin-desktop lg:px-gutter pb-40 md:pb-32">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <LinkBreadcrumb
            items={[
              { label: "Events", href: "/dashboard/events" },
              { label: event.title },
            ]}
          />
        </div>

        {/* Mobile Title (appears above the right column on mobile) */}
        <h1 className="lg:hidden font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface font-bold tracking-tight leading-tight mb-8">
          {event.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start">
          {/* ── Left Column ── */}
          <div className="lg:col-span-7 flex flex-col gap-10 order-2 lg:order-1">
            {/* Desktop Title */}
            <h1 className="hidden lg:block font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface font-bold tracking-tight leading-tight">
              {event.title}
            </h1>

            {/* Details */}
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 font-bold border-b pb-2 border-outline-variant w-max">
                Details
              </h2>
              <div className="font-body-md text-body-md text-on-surface-variant space-y-4 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 font-bold">
                Location{" "}
              </h2>
              {event.venue.toLowerCase().includes("online") || event.venue.toLowerCase().includes("zoom") ? (
                <div className="mt-4 mb-8">
                  <p className="text-on-surface-variant font-medium">Online Event</p>
                </div>
              ) : (
                <div className="relative w-full h-[300px] mt-4 mb-8 rounded-2xl overflow-hidden border border-outline-variant shadow-sm z-10 bg-surface-container">
                  <EventMap venue={event.venue} />
                </div>
              )}
            </div>

          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-5 relative flex flex-col gap-4 order-1 lg:order-2">
            {/* Hero Banner Image */}
            <div className="w-full rounded-2xl overflow-hidden relative shadow-sm group bg-surface-container border border-outline-variant/30">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={event.bannerUrl || "/events/1.jpg"}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </AspectRatio>
            </div>

            {/* Floating Card: Date/Time and Location */}
            <Card className="bg-surface-container-lowest border border-outline-variant shadow-md rounded-[20px] p-2 sticky top-[100px]">
              <CardContent className="p-4 space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-secondary/10 text-secondary p-2.5 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">
                      calendar_today
                    </span>
                  </div>
                  <div className="mt-0.5">
                    <h3 className="font-semibold text-on-surface text-sm">
                      Event Timings
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {new Date(event.startAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      •{" "}
                      {new Date(event.startAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      to{" "}
                      {event.endAt
                        ? new Date(event.endAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "TBD"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-orange-500/10 text-orange-600 p-2.5 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">
                      alarm
                    </span>
                  </div>
                  <div className="mt-0.5">
                    <h3 className="font-semibold text-on-surface text-sm">
                      Registration Deadline
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {new Date(event.registrationDeadline).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" },
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-green-500/10 text-green-600 p-2.5 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">
                      {event.venue.toLowerCase().includes("online") ||
                      event.venue.toLowerCase().includes("zoom") ? "videocam" : "location_on"}
                    </span>
                  </div>
                  <div className="mt-0.5">
                    <h3 className="font-semibold text-on-surface text-sm">
                      {event.venue.toLowerCase().includes("online") ||
                      event.venue.toLowerCase().includes("zoom")
                        ? "Online event"
                        : event.venue}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {event.venue.toLowerCase().includes("online") ||
                      event.venue.toLowerCase().includes("zoom")
                        ? "Virtual"
                        : "In-Person"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* You may also like */}
        {relatedEvents.length > 0 && (
          <div className="flex flex-col gap-4 mt-16 pt-8 border-t border-outline-variant">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                You may also like
              </h2>
              <Link
                href="/dashboard/events"
                className="text-primary hover:underline text-sm font-medium"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
              {relatedEvents.map((relatedEvent) => (
                <EventCard
                  key={relatedEvent.id}
                  event={relatedEvent}
                  onClick={() =>
                    router.push(`/dashboard/events/${relatedEvent.id}`)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Floating Bottom Bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] p-4 px-margin-mobile md:px-margin-desktop lg:px-gutter">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Info */}
          <div className="hidden md:flex flex-col flex-1 min-w-0 pr-4">
            <p className="text-xs font-semibold text-on-surface-variant mb-0.5">
              {new Date(event.startAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              •{" "}
              {new Date(event.startAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p className="text-[15px] font-bold text-on-surface truncate">
              {event.title}
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-on-surface mr-1">
                Free
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 text-on-surface-variant hover:text-red-500 hover:bg-red-50"
              >
                <span className="material-symbols-outlined text-[20px]">
                  favorite
                </span>
              </Button>
              <ShareModal eventId={resolvedParams.id}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-10 w-10 text-on-surface-variant bg-surface-container-highest hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    ios_share
                  </span>
                </Button>
              </ShareModal>
            </div>

            {!isRegistered ? (
              <Button
                onClick={() =>
                  router.push(`/dashboard/events/${resolvedParams.id}/register`)
                }
                disabled={isFull}
                className="bg-pink-400 rounded-xl px-8 py-6 text-[15px] font-bold shadow-md"
              >
                {isFull ? "Event Full" : "Register"}
              </Button>
            ) : (
              <Button
                disabled
                variant="secondary"
                className="rounded-xl px-8 py-6 text-[15px] font-bold shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px] mr-2">
                  check_circle
                </span>
                Registered
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
