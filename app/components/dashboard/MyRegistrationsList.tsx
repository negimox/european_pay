import { EventCard } from "./EventCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Registration {
  id: string;
  eventId: string;
  status: string;
  event: {
    id: string;
    title: string;
    description: string;
    category: string;
    startAt: string;
    venue: string;
    capacity: number;
    bannerUrl: string | null;
  };
}

interface MyRegistrationsListProps {
  registrations: Registration[];
  onCancel: (eventId: string) => void;
  loading?: boolean;
  actionLoading?: string | null;
}

export function MyRegistrationsList({
  registrations,
  onCancel,
  loading = false,
  actionLoading = null,
}: MyRegistrationsListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col h-[320px] w-full">
            <Skeleton className="h-[140px] w-full rounded-none" />
            <div className="p-4 flex flex-col gap-4 flex-1">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="mt-auto space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-center w-full">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 mb-4">
          event_busy
        </span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
          No Registered Events
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant w-full max-w-[400px] mt-2">
          You haven't registered for any upcoming events yet. Check out the "Upcoming Events" tab to find something interesting!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {registrations.map((registration) => (
        <EventCard
          key={registration.id}
          event={registration.event}
          isRegistered={true}
          onCancel={onCancel}
          isActionLoading={actionLoading === registration.eventId}
        />
      ))}
    </div>
  );
}
