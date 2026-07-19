"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LinkBreadcrumb } from "@/app/components/dashboard/LinkBreadcrumb";
import { EventCard } from "@/app/components/dashboard/EventCard";

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
  ALL: "All events",
  ACADEMIC: "Academic",
  CULTURAL: "Cultural",
  SPORTS: "Sports",
  TECHNICAL: "Technical",
  WORKSHOP: "Workshop",
  SOCIAL: "Social",
  OTHER: "Other",
};

// Material icons for each category
const CATEGORY_ICONS: Record<string, string> = {
  ALL: "campaign",
  ACADEMIC: "school",
  CULTURAL: "palette",
  SPORTS: "sports_basketball",
  TECHNICAL: "computer",
  WORKSHOP: "build",
  SOCIAL: "groups",
  OTHER: "category",
};

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(
    new Set(),
  );

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
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
            (data.registrations || []).map((r: any) => r.eventId as string),
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

  const filteredEvents = events.filter((event) => {
    // Category filter — compare against the raw enum string from the API
    if (
      selectedCategory !== "ALL" &&
      event.category !== selectedCategory
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
        eventDate.getDate(),
      );
      if (dateRange.from) {
        const fromDay = new Date(
          dateRange.from.getFullYear(),
          dateRange.from.getMonth(),
          dateRange.from.getDate(),
        );
        if (eventDay < fromDay) return false;
      }
      if (dateRange.to) {
        const toDay = new Date(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth(),
          dateRange.to.getDate(),
        );
        if (eventDay > toDay) return false;
      }
    }

    return true;
  });

  const clearAll = () => {
    setSelectedCategory("ALL");
    setDateRange(undefined);
  };

  const hasActiveFilters =
    selectedCategory !== "ALL" || dateRange?.from || dateRange?.to;

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface-bright flex-1 overflow-x-hidden">
      {/* Breadcrumbs */}
      <LinkBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Events" },
        ]}
      />

      <div className="mb-lg select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg lg:text-display-lg text-on-surface font-bold">
              All Events
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
              Discover and register for upcoming events.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Date Range Filter */}
            <Popover>
              <PopoverTrigger className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                {dateRange?.from ? (
                  dateRange.to ? (
                    <span className="truncate">
                      {format(dateRange.from, "MMM d")} –{" "}
                      {format(dateRange.to, "MMM d")}
                    </span>
                  ) : (
                    <span className="truncate">
                      From {format(dateRange.from, "MMM d")}
                    </span>
                  )
                ) : (
                  <span>Any day</span>
                )}
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
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

            {/* Clear All */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-8">
          <ScrollArea className="w-full whitespace-nowrap border-b border-gray-200 dark:border-gray-800">
            <div className="flex w-max min-w-full items-center justify-between gap-4">
              {["ALL", ...EVENT_CATEGORIES].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-2 min-w-[80px] pb-3 px-2 border-b-[3px] transition-all",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    )}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {CATEGORY_ICONS[cat]}
                    </span>
                    <span className="text-[13.5px] font-medium">
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      </div>

      <div className="w-full space-y-lg mt-6">
        <section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-surface-container-low h-[320px] animate-pulse w-full"
                />
              ))
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] opacity-40">
                  search_off
                </span>
                <p className="font-body-lg text-body-lg">
                  No events match your filters.
                </p>
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
                  <div key={event.id}>
                    <EventCard
                      event={event}
                      isRegistered={isRegistered}
                      onClick={() => router.push(`/dashboard/events/${event.id}`)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
