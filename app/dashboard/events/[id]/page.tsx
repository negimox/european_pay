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

// Dynamically import the map to avoid SSR issues with Leaflet
const EventMap = dynamic(() => import("@/app/components/events/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[220px] rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center">
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
    <main className="flex-1 w-full max-w-7xl mx-auto py-lg px-margin-mobile md:px-margin-desktop lg:px-gutter">
      {/* Breadcrumbs */}
      <LinkBreadcrumb items={[{ label: "Events", href: "/dashboard/events" }, { label: event.title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter relative items-start">
        {/* ── Left Column ── */}
        <div className="lg:col-span-8 flex flex-col gap-xl">
          {/* Hero Banner */}
          <section className="flex flex-col gap-md">
            <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden relative shadow-sm group bg-surface-container flex items-center justify-center">
              <img
                src={event.bannerUrl || "/events/1.jpg"}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-md left-md flex gap-sm">
                {/* FIX: force white text for all category badges — use explicit inline style
                    since bg-primary-container in some themes renders dark bg with dark text */}
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm tracking-wide"
                  style={{ background: "hsl(217 91% 60%)", color: "#fff" }}
                >
                  {event.category || "Event"}
                </span>
              </div>
            </div>

            <div>
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface mb-xs">
                {event.title}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl line-clamp-3">
                {event.description}
              </p>
            </div>
          </section>

          {/* About the Event */}
          <Card className="bg-surface-container-lowest border-outline-variant shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">
                  info
                </span>
                About the Event
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body-md text-body-md text-on-surface-variant space-y-6 pt-0">
              <p>{event.description}</p>

              {/* Detail rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Category */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container border border-outline-variant">
                  <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
                    category
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wide mb-0.5">
                      Category
                    </p>
                    <p className="font-medium text-on-surface truncate">
                      {event.category || "—"}
                    </p>
                  </div>
                </div>

                {/* Registration Deadline */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container border border-outline-variant">
                  <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
                    event_busy
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wide mb-0.5">
                      Registration Deadline
                    </p>
                    <p className="font-medium text-on-surface">
                      {event.registrationDeadline
                        ? new Date(
                            event.registrationDeadline,
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </p>
                    {event.registrationDeadline && (
                      <p className="text-xs text-on-surface-variant">
                        {getRelativeTime(event.registrationDeadline)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container border border-outline-variant sm:col-span-2">
                  <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
                    location_on
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wide mb-0.5">
                      Venue
                    </p>
                    <p className="font-medium text-on-surface">
                      {event.venue || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* OpenStreetMap embed for the venue */}
              <div className="flex flex-col gap-2">
                <EventMap venue={event.venue} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column: Sticky Registration Card ── */}
        <div className="lg:col-span-4 relative">
          <Card className="sticky top-[100px] bg-surface-container-lowest border-outline-variant shadow-sm flex flex-col z-10">
            <CardHeader className="border-b border-outline-variant pb-md">
              {/* FIX: Replace Badge component (broken primary-color contrast) with
                  explicitly-styled status pill so text is always readable */}
              <div className="mb-sm">
                {registrationStatus === "registered" && (
                  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-green-600 text-white">
                    <span className="material-symbols-outlined text-[14px]">
                      check_circle
                    </span>
                    Registered
                  </span>
                )}
                {registrationStatus === "full" && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-red-600 text-white">
                    Full
                  </span>
                )}
                {registrationStatus === "open" && (
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
                    style={{ background: "hsl(217 91% 60%)" }}
                  >
                    Registration Open
                  </span>
                )}
              </div>

              <div className="flex items-end gap-xs mt-sm">
                <span className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary">
                  Free
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant pb-1">
                  for Students
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-lg flex flex-col gap-lg">
              {/* Logistics */}
              <ul className="flex flex-col gap-md font-body-md text-body-md text-on-surface">
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">
                    calendar_today
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">
                        {new Date(event.startAt).toLocaleDateString()}
                      </span>
                      {getRelativeTime(event.startAt) && (
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                          style={{ background: "hsl(217 91% 60%)" }}
                        >
                          {getRelativeTime(event.startAt)}
                        </span>
                      )}
                    </div>
                    <span className="text-on-surface-variant text-sm">
                      Starts at{" "}
                      {new Date(event.startAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">
                    location_on
                  </span>
                  <div>
                    <span className="block font-medium">{event.venue}</span>
                  </div>
                </li>
              </ul>

              {/* Capacity & Action */}
              <div className="flex flex-col gap-sm pt-sm border-t border-outline-variant">
                <div className="flex justify-between items-center font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">
                    Seats Available
                  </span>
                  {/* FIX: was reading event.registrationsCount (undefined → NaN).
                      Now correctly reads event._count.registrations from Prisma. */}
                  <span className="text-on-surface font-bold">
                    {seatsAvailable} / {event.capacity}
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  className={`h-2 ${isFull ? "[&>div]:bg-red-500" : "[&>div]:bg-secondary"}`}
                />

                {!isRegistered ? (
                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboard/events/${resolvedParams.id}/register`,
                      )
                    }
                    disabled={isFull}
                    className="mt-md w-full font-label-md text-label-md font-bold shadow-sm text-white"
                    style={
                      !isFull
                        ? { background: "hsl(217 91% 60%)", color: "#fff" }
                        : {}
                    }
                  >
                    {isFull ? "Event Full" : "Register Now"}
                    {!isFull && (
                      <span className="material-symbols-outlined text-sm ml-2">
                        arrow_forward
                      </span>
                    )}
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="secondary"
                    className="mt-md w-full font-label-md text-label-md font-bold shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px] mr-2">
                      check_circle
                    </span>
                    You are registered
                  </Button>
                )}

                <p className="text-center text-xs text-on-surface-variant mt-xs">
                  Registration closes{" "}
                  {new Date(event.registrationDeadline).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
