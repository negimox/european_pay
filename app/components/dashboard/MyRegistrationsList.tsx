import { EventCard } from "./EventCard";

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
}

export function MyRegistrationsList({
  registrations,
  onCancel,
  loading = false,
}: MyRegistrationsListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-surface-container-low rounded-xl h-[380px] w-full" />
        ))}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-center">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 mb-4">
          event_busy
        </span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
          No Registered Events
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
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
        />
      ))}
    </div>
  );
}
