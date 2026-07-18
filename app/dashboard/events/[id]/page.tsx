"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import RegistrationModal from "@/app/components/events/RegistrationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    checkRegistration();
  }, [resolvedParams.id]);

  const fetchEventDetails = async () => {
    try {
      // In a real app, you'd have a specific GET /api/events/[id] endpoint.
      // Since we might not have it yet, let's fetch all and filter for now, or assume it exists.
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
        setIsRegistered(data.registrations?.some((r: any) => r.eventId === resolvedParams.id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setShowRegistrationModal(false);
    // Optionally refresh event to get updated capacity
  };

  if (loading) {
    return <div className="p-8">Loading event details...</div>;
  }

  if (!event) {
    return <div className="p-8">Event not found.</div>;
  }

  const isFull = event.registrationsCount >= event.capacity;
  const progressPercentage = Math.min(100, (event.registrationsCount / event.capacity) * 100);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto py-lg px-margin-mobile md:px-margin-desktop lg:px-gutter">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant mb-lg">
        <Link href="/dashboard/events" className="hover:text-primary transition-colors">Events</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface font-medium truncate">{event.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter relative items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 flex flex-col gap-xl">
          {/* Hero Banner & Title Area */}
          <section className="flex flex-col gap-md">
            <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden relative shadow-sm group bg-surface-container flex items-center justify-center">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <span className="material-symbols-outlined text-[100px] text-outline-variant absolute">event</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-tint/60 to-transparent"></div>
              <div className="absolute bottom-md left-md flex gap-sm">
                <Badge className="bg-primary-container text-on-primary-container font-label-sm text-label-sm shadow-sm hover:bg-primary-container/80">{event.category || 'Event'}</Badge>
              </div>
            </div>
            
            <div>
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface mb-xs">{event.title}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl line-clamp-3">{event.description}</p>
            </div>
          </section>

          {/* Description */}
          <Card className="bg-surface-container-lowest border-outline-variant shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">info</span>
                About the Event
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body-md text-body-md text-on-surface-variant space-y-4 pt-0">
              <p>{event.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sticky Registration */}
        <div className="lg:col-span-4 relative">
          <Card className="sticky top-[100px] bg-surface-container-lowest border-outline-variant shadow-sm flex flex-col z-10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-surface-container-low/50 before:to-transparent before:rounded-xl before:-z-10">
            <CardHeader className="border-b border-outline-variant pb-md">
              <Badge variant={isRegistered ? "default" : isFull ? "destructive" : "secondary"} className="uppercase tracking-wider w-fit mb-sm">
                {isRegistered ? "Registered" : isFull ? "Full" : "Registration Open"}
              </Badge>
              <div className="flex items-end gap-xs mt-sm">
                <span className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary">Free</span>
                <span className="font-body-md text-body-md text-on-surface-variant pb-1">for Students</span>
              </div>
            </CardHeader>

            <CardContent className="pt-lg flex flex-col gap-lg">
              {/* Logistics List */}
              <ul className="flex flex-col gap-md font-body-md text-body-md text-on-surface">
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">calendar_today</span>
                  <div>
                    <span className="block font-medium">{new Date(event.date).toLocaleDateString()}</span>
                    <span className="text-on-surface-variant text-sm">Starts at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">location_on</span>
                  <div>
                    <span className="block font-medium">{event.venue}</span>
                  </div>
                </li>
              </ul>

              {/* Capacity & Action */}
              <div className="flex flex-col gap-sm pt-sm border-t border-outline-variant">
                <div className="flex justify-between items-center font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Seats Available</span>
                  <span className="text-on-surface font-bold">{Math.max(0, event.capacity - event.registrationsCount)} / {event.capacity}</span>
                </div>
                <Progress value={progressPercentage} className={`h-2 ${isFull ? '[&>div]:bg-error' : '[&>div]:bg-secondary'}`} />
                
                {!isRegistered ? (
                  <Button 
                    onClick={() => setShowRegistrationModal(true)}
                    disabled={isFull}
                    className="mt-md w-full font-label-md text-label-md font-bold shadow-sm"
                  >
                    {isFull ? "Event Full" : "Register Now"}
                    {!isFull && <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>}
                  </Button>
                ) : (
                  <Button 
                    disabled
                    variant="secondary"
                    className="mt-md w-full font-label-md text-label-md font-bold shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px] mr-2">check_circle</span>
                    You are registered
                  </Button>
                )}
                
                <p className="text-center text-xs text-on-surface-variant mt-xs">
                  Registration closes {new Date(event.registrationDeadline).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showRegistrationModal && (
        <RegistrationModal 
          event={event} 
          onClose={() => setShowRegistrationModal(false)} 
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </main>
  );
}
