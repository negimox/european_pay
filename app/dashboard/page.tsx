"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/app/components/dashboard/EventCard";
import { AnnouncementsList } from "@/app/components/dashboard/AnnouncementsList";
import { MyRegistrationsList } from "@/app/components/dashboard/MyRegistrationsList";

export default function DashboardPage() {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Data states
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
    fetchAnnouncements();
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const res = await fetch("/api/user/registrations");
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error("Failed to fetch registrations", error);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (e) {
      console.error(e);
      setLogoutLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Successfully registered for event!");
        // Refresh data
        fetchEvents();
        fetchRegistrations();
      } else {
        toast.error(data.error || "Failed to register");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Registration cancelled successfully");
        // Refresh data
        fetchEvents();
        fetchRegistrations();
      } else {
        toast.error(data.error || "Failed to cancel registration");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  // Extract registered event IDs for quick lookup
  const registeredEventIds = new Set(registrations.map((r) => r.eventId));

  return (
    <div className="min-h-screen bg-surface-container-lowest font-body-md text-on-surface">
      <header className="sticky top-0 z-10 w-full border-b border-outline-variant/20 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/web-app-manifest-512x512.png" alt="UniEvent Logo" width={32} height={32} />
          <span className="font-headline-md text-headline-md font-bold text-primary">UniEvents</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error rounded-lg font-label-md transition-all hover:bg-error hover:text-on-error active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          {logoutLoading ? "Signing out..." : "Sign Out"}
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="font-display-sm md:font-display-md text-display-sm md:text-display-md text-on-surface mb-2">
            Student Dashboard
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Welcome to your portal. Discover new campus events, manage your registrations, and stay updated with the latest announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming" className="font-label-lg">Upcoming Events</TabsTrigger>
                <TabsTrigger value="registered" className="font-label-lg">My Registrations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-0">
                {loadingEvents ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-surface-container-low rounded-xl h-[380px]" />
                    ))}
                  </div>
                ) : events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-center">
                    <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 mb-4">
                      event_available
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                      No Upcoming Events
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Check back later for new events on campus.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        isRegistered={registeredEventIds.has(event.id)}
                        loading={actionLoading === event.id}
                        onRegister={handleRegister}
                        onCancel={handleCancelRegistration}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="registered" className="mt-0">
                <MyRegistrationsList
                  registrations={registrations}
                  loading={loadingRegistrations}
                  onCancel={handleCancelRegistration}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar / Announcements */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AnnouncementsList
                announcements={announcements}
                loading={loadingAnnouncements}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
