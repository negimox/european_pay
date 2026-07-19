import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { ShareModal } from "@/app/components/events/ShareModal";
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
} from "@/config/categories";

interface EventProps {
  event: {
    id: string;
    title: string;
    description: string;
    category: string;
    startAt: string;
    venue: string;
    capacity: number;
    bannerUrl: string | null;
    registrationDeadline?: string;
    fees?: number;
    _count?: {
      registrations: number;
    };
  };
  isRegistered?: boolean;
  onClick?: () => void;
  className?: string;
  onCancel?: (eventId: string) => void;
  isActionLoading?: boolean;
}

export function EventCard({
  event,
  isRegistered = false,
  onClick,
  className,
  onCancel,
  isActionLoading = false,
}: EventProps) {
  const getRelativeTime = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
    );

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    return "";
  };

  const isDeadlinePassed = event.registrationDeadline ? new Date(event.registrationDeadline) < new Date() : false;

  const registrationsCount = event._count?.registrations || 0;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-0 gap-0 h-full flex flex-col transition-all duration-300 hover:scale-[0.98] border-0 bg-transparent select-none cursor-pointer group shadow-none ring-0 focus-visible:ring-offset-0",
        className,
      )}
    >
      <div className="relative w-full bg-gray-100 overflow-hidden rounded-[20px]">
        <AspectRatio ratio={16 / 10}>
          {event.bannerUrl ? (
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span className="material-symbols-outlined text-[64px]">
                event
              </span>
            </div>
          )}
        </AspectRatio>

        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 z-10"
        >
          <ShareModal eventId={event.id}>
            <button
              type="button"
              className="w-[34px] h-[34px] rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-white text-[20px] ml-[1px]">
                ios_share
              </span>
            </button>
          </ShareModal>
        </div>

        {isRegistered ? (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-green-600/90 backdrop-blur-sm text-white hover:bg-green-600 font-medium text-[11px] shadow-sm gap-1 border-0 px-2.5 py-4">
              <span
                className="material-symbols-outlined text-[12px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Registered
            </Badge>
          </div>
        ) : isDeadlinePassed ? (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gray-600/90 backdrop-blur-sm text-white hover:bg-gray-600 font-medium text-[11px] shadow-sm gap-1 border-0 px-2.5 py-4">
              <span
                className="material-symbols-outlined text-[12px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                schedule
              </span>
              Deadline Passed
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="py-3 flex flex-col flex-1">
        <CardHeader className="p-0 space-y-0">
          <CardTitle className="font-bold text-[17px] leading-[1.3] text-gray-900 dark:text-gray-100 line-clamp-2">
            {event.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 mt-1.5 flex flex-col flex-1">
          <div className="flex flex-col gap-[3px] text-[13.5px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="flex items-center">
                <span className="material-symbols-outlined pr-2.5">
                  calendar_clock
                </span>
                {new Date(event.startAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                {" • "}
                {new Date(event.startAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </span>
              {event.venue.toLowerCase().includes("online") && (
                <>
                  <span className="text-[10px]">•</span>
                  <div className="flex items-center gap-1 px-1.5 py-[2px] bg-gray-100 dark:bg-gray-800 rounded-md text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                    <span className="material-symbols-outlined text-[12px] !leading-none">
                      videocam
                    </span>
                    Online
                  </div>
                </>
              )}
            </div>

            <div className="truncate flex items-center">
              <span className={cn("material-symbols-outlined pr-2.5", event.category ? CATEGORY_COLORS[event.category] : "")}>
                {event.category ? CATEGORY_ICONS[event.category] || "category" : "category"}
              </span>{" "}
              <span className={event.category ? CATEGORY_COLORS[event.category] : ""}>
                {event.category ? CATEGORY_LABELS[event.category] || event.category : event.venue}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-auto pt-3">
            {registrationsCount > 0 ? (
              <div className="flex -space-x-1.5">
                {[...Array(Math.min(registrationsCount, 3))].map((_, i) => (
                  <div
                    key={i}
                    className="w-[26px] h-[26px] rounded-full  dark:bg-gray-700 border-2  dark:border-gray-950 flex items-center justify-center overflow-hidden z-10"
                    style={{ zIndex: 3 - i }}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${event.id}-${i}&backgroundColor=e2e8f0`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-[26px] h-[26px] rounded-full  dark:bg-gray-800 border-2  dark:border-gray-950 flex items-center justify-center z-10">
                <span className="material-symbols-outlined text-[14px] text-gray-400">
                  person_off
                </span>
              </div>
            )}
            <span className="text-[14px] font-bold ">
              {registrationsCount}{" "}
              {registrationsCount === 1 ? "attendee" : "attendees"}
            </span>
          </div>

          {isRegistered && onCancel && (
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(event.id);
                }}
                disabled={isActionLoading}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">
                    cancel
                  </span>
                )}
                {isActionLoading ? "Cancelling..." : "Cancel Registration"}
              </button>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
