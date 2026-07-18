import { AdminEventForm } from "@/app/components/admin/AdminEventForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewEventPage() {
  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface-bright flex-1 overflow-x-hidden">
      <div className="mb-lg select-none flex items-center gap-4">
        <Link href="/dashboard/admin/events">
          <Button variant="ghost" size="icon">
            <span className="material-symbols-outlined">arrow_back</span>
          </Button>
        </Link>
        <div>
          <h2 className="font-headline-lg text-headline-lg lg:text-display-lg text-on-surface font-bold">
            Create New Event
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
            Fill in the details below to publish a new event.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AdminEventForm />
      </div>
    </div>
  );
}
