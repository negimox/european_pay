"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Matches the EventCategory enum in schema.prisma
const EVENT_CATEGORIES = [
  "ACADEMIC",
  "CULTURAL",
  "SPORTS",
  "TECHNICAL",
  "WORKSHOP",
  "SOCIAL",
  "OTHER",
] as const;

// Nicely formatted labels for display
const CATEGORY_LABELS: Record<string, string> = {
  ACADEMIC: "Academic",
  CULTURAL: "Cultural",
  SPORTS: "Sports",
  TECHNICAL: "Technical",
  WORKSHOP: "Workshop",
  SOCIAL: "Social",
  OTHER: "Other",
};

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    Promise.all([
      fetch("/api/events")
        .then((r) => r.json())
        .then((data) => setEvents(data.events || []))
        .catch((err) => console.error("Failed to fetch events", err))
        .finally(() => setLoading(false)),

      fetch("/api/user/registrations")
        .then((r) => r.json())
        .then((data) => {
          const ids = new Set<string>(
            (data.registrations || []).map((r: any) => r.eventId as string)
          );
          setRegisteredEventIds(ids);
        })
        .catch(console.error),
    ]);
  }, []);

  const getRelativeTime = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    return "";
  };

  const filteredEvents = events.filter((event) => {
    // Category filter — compare against the raw enum string from the API
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(event.category)
    ) {
      return false;
    }

    // Date range filter — check if the event's startAt falls within the range
    if (dateRange?.from || dateRange?.to) {
      const eventDate = new Date(event.startAt);
      // Normalise to midnight so we compare calendar days, not clock time
      const eventDay = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );
      if (dateRange.from) {
        const fromDay = new Date(
          dateRange.from.getFullYear(),
          dateRange.from.getMonth(),
          dateRange.from.getDate()
        );
        if (eventDay < fromDay) return false;
      }
      if (dateRange.to) {
        const toDay = new Date(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth(),
          dateRange.to.getDate()
        );
        if (eventDay > toDay) return false;
      }
    }

    return true;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setDateRange(undefined);
  };

  const hasActiveFilters = selectedCategories.length > 0 || dateRange?.from || dateRange?.to;

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface-bright flex-1 overflow-x-hidden">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant mb-lg">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface font-medium truncate">Events</span>
      </nav>

      <div className="mb-lg select-none">
        <h2 className="font-headline-lg text-headline-lg lg:text-display-lg text-on-surface font-bold">All Events</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
          Discover and register for upcoming events.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* ── Filters Sidebar ── */}
        <aside className="w-full lg:w-1/4">
          <Card className="bg-surface-container-lowest border-outline-variant shadow-sm sticky top-24">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                Filters
                {hasActiveFilters && (
                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary text-white text-xs font-bold">
                    {selectedCategories.length + (dateRange?.from || dateRange?.to ? 1 : 0)}
                  </span>
                )}
              </CardTitle>
              <button
                onClick={clearAll}
                className="font-label-sm text-label-sm text-secondary hover:underline disabled:opacity-40 disabled:no-underline"
                disabled={!hasActiveFilters}
              >
                Clear All
              </button>
            </CardHeader>

            <CardContent className="pt-0 flex flex-col gap-md">
              {/* ── Category Filter ── */}
              <div>
                <h4 className="font-label-md text-label-md font-semibold text-on-surface-variant mb-sm">
                  Category
                </h4>
                <div className="flex flex-col gap-sm">
                  {EVENT_CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-sm cursor-pointer w-fit select-none">
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                      />
                      <span className="font-body-md text-body-md text-on-surface">
                        {CATEGORY_LABELS[cat]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Date Range Filter ── */}
              <div>
                <h4 className="font-label-md text-label-md font-semibold text-on-surface-variant mb-sm">
                  Date Range
                </h4>
                <Popover>
                  <PopoverTrigger
                    id="date-range-picker"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-left text-sm hover:bg-surface-container transition-colors",
                      !dateRange && "text-on-surface-variant"
                    )}
                  >
                    <CalendarIcon className="size-4 shrink-0 text-on-surface-variant" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <span className="truncate text-on-surface text-sm">
                          {format(dateRange.from, "MMM d")} – {format(dateRange.to, "MMM d, yyyy")}
                        </span>
                      ) : (
                        <span className="truncate text-on-surface text-sm">
                          From {format(dateRange.from, "MMM d, yyyy")}
                        </span>
                      )
                    ) : (
                      <span className="text-sm">Pick a date range</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={1}
                    />
                    {(dateRange?.from || dateRange?.to) && (
                      <div className="border-t border-outline-variant p-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-on-surface-variant"
                          onClick={() => setDateRange(undefined)}
                        >
                          Clear dates
                        </Button>
                      </div>
                    )}

                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* ── Results Grid ── */}
        <div className="w-full lg:w-3/4 space-y-lg">
          <section>
            <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-sm mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">event</span>
              Available Events
              {!loading && (
                <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">
                  {filteredEvents.length} result{filteredEvents.length !== 1 ? "s" : ""}
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-surface-container-low h-[300px] animate-pulse w-full" />
                ))
              ) : filteredEvents.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] opacity-40">search_off</span>
                  <p className="font-body-lg text-body-lg">No events match your filters.</p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearAll}>
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                filteredEvents.map((event) => {
                  const isRegistered = registeredEventIds.has(event.id);
                  return (
                    <Card
                      key={event.id}
                      onClick={() => router.push(`/dashboard/events/${event.id}`)}
                      className={cn(
                        "rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer p-0 select-none",
                        isRegistered
                          ? "border-2 border-green-500 bg-green-50/30 dark:bg-green-950/20"
                          : "border-outline-variant bg-surface-container-lowest"
                      )}
                    >
                      {/* Thumbnail */}
                      <div className="h-40 overflow-hidden relative bg-surface-container flex items-center justify-center">
                        <img
                          src={event.bannerUrl || "/events/1.jpg"}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Date pills */}
                        <div className="absolute top-sm right-sm flex flex-col items-end gap-1">
                          <span className="bg-surface-container-lowest/90 backdrop-blur-sm font-label-sm text-label-sm text-primary rounded-full px-2 py-0.5">
                            {new Date(event.startAt).toLocaleDateString()}
                          </span>
                          <span className="bg-primary/90 backdrop-blur-sm font-label-sm text-label-sm text-white rounded-full px-2 py-0.5 font-medium">
                            {getRelativeTime(event.startAt)}
                          </span>
                        </div>

                        {/* Registered stamp */}
                        {isRegistered && (
                          <div className="absolute inset-0 bg-green-900/40 flex items-center justify-center">
                            <div className="size-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-4 ring-white/30">
                              <span
                                className="material-symbols-outlined text-white text-[32px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                how_to_reg
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Header */}
                      <CardHeader className="p-4 pb-0 flex-1">
                        <div className="flex items-center gap-sm mb-sm flex-wrap">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{ background: "hsl(217 91% 60%)", color: "#fff" }}
                          >
                            {CATEGORY_LABELS[event.category] ?? event.category ?? "Event"}
                          </span>
                          {isRegistered && (
                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-green-600 text-white">
                              <span
                                className="material-symbols-outlined text-[12px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                check_circle
                              </span>
                              Registered
                            </span>
                          )}
                        </div>
                        <CardTitle className="font-headline-md text-headline-md text-on-surface mb-sm line-clamp-1">
                          {event.title}
                        </CardTitle>
                      </CardHeader>

                      {/* Body */}
                      <CardContent className="p-4 pt-2">
                        <p className="font-body-md text-body-md text-on-surface-variant mb-md line-clamp-2">
                          {event.description}
                        </p>
                      </CardContent>

                      {/* Footer */}
                      <CardFooter
                        className={cn(
                          "p-4 pt-0 mt-auto flex items-center justify-between border-t",
                          isRegistered ? "border-green-200 dark:border-green-900" : "border-outline-variant/50"
                        )}
                      >
                        <div className="flex items-center gap-sm text-on-surface-variant font-label-sm text-label-sm mt-4">
                          <span className="material-symbols-outlined text-[18px]">location_on</span>
                          <span className="truncate max-w-[120px]">{event.venue}</span>
                        </div>
                        {isRegistered ? (
                          <span className="flex items-center gap-1 text-green-600 font-label-md text-label-md font-semibold mt-4">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check_circle
                            </span>
                            View Registration
                          </span>
                        ) : (
                          <button className="text-secondary font-label-md text-label-md hover:underline mt-4 select-none">
                            View Details
                          </button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
