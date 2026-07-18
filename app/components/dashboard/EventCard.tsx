import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    _count?: {
      registrations: number;
    };
  };
  isRegistered?: boolean;
  onRegister?: (id: string) => void;
  onCancel?: (id: string) => void;
  loading?: boolean;
}

export function EventCard({
  event,
  isRegistered = false,
  onRegister,
  onCancel,
  loading = false,
}: EventProps) {
  const date = new Date(event.startAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const registrationsCount = event._count?.registrations || 0;
  const isFull = registrationsCount >= event.capacity;
  const availableSeats = event.capacity - registrationsCount;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md border-outline-variant/30 bg-surface">
      <div className="relative w-full h-48 bg-surface-container-high">
        {event.bannerUrl ? (
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/50">
            <span className="material-symbols-outlined text-[64px]">
              event
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-surface/90 backdrop-blur-sm text-on-surface">
            {event.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-4">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface line-clamp-1">
          {event.title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-2">
          {event.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">calendar_today</span>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">location_on</span>
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">group</span>
            <span>
              {availableSeats} / {event.capacity} seats available
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {isRegistered ? (
          <Button
            variant="destructive"
            className="w-full font-label-lg"
            onClick={() => onCancel?.(event.id)}
            disabled={loading}
          >
            Cancel Registration
          </Button>
        ) : (
          <Button
            className="w-full font-label-lg"
            onClick={() => onRegister?.(event.id)}
            disabled={isFull || loading}
          >
            {isFull ? "Fully Booked" : "Register Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
