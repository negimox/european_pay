"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LocationInput } from "./LocationInput";
import { toast } from "sonner";
import { CalendarIcon, Users, IndianRupee, Image as ImageIcon, FileText, Tag, Clock } from "lucide-react";
import { format } from "date-fns";

type EventCategory = "ACADEMIC" | "CULTURAL" | "SPORTS" | "TECHNICAL" | "WORKSHOP" | "SOCIAL" | "OTHER";

const CATEGORIES: EventCategory[] = [
  "ACADEMIC", "CULTURAL", "SPORTS", "TECHNICAL", "WORKSHOP", "SOCIAL", "OTHER"
];

export function AdminEventForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [venue, setVenue] = useState(initialData?.venue || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      bannerUrl: formData.get("bannerUrl") || "/events/1.jpg",
      category: formData.get("category"),
      venue,
      startAt: formData.get("startAt"),
      endAt: formData.get("endAt"),
      registrationDeadline: formData.get("registrationDeadline"),
      capacity: formData.get("capacity"),
      fees: formData.get("fees"),
    };

    try {
      const url = initialData ? `/api/admin/events/${initialData.id}` : "/api/admin/events";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save event");
      }

      toast.success(`Event ${initialData ? "updated" : "created"} successfully`);
      router.push("/dashboard/admin/events");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    // Format to YYYY-MM-DDThh:mm
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
      <div className="space-y-4">
        
        {/* Title */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-foreground">Event Title *</label>
          <div className="relative">
            <Input 
              required 
              name="title" 
              defaultValue={initialData?.title} 
              placeholder="e.g. Annual Tech Symposium 2026" 
              className="pl-10 pr-3 py-2 w-full"
            />
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-foreground">Description *</label>
          <Textarea 
            required 
            name="description" 
            defaultValue={initialData?.description} 
            placeholder="Detailed description of the event..."
            className="min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">Category *</label>
            <div className="relative">
              <select 
                required 
                name="category" 
                defaultValue={initialData?.category || "OTHER"} 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Venue */}
          <LocationInput 
            name="venue" 
            label="Venue (OpenStreetMap)" 
            placeholder="Search location..." 
            value={venue}
            onChange={setVenue}
          />

          {/* Start Time */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">Start Time *</label>
            <div className="relative">
              <Input 
                required 
                type="datetime-local"
                name="startAt" 
                defaultValue={formatDateForInput(initialData?.startAt)} 
                className="pl-10 pr-3 py-2 w-full"
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* End Time */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">End Time *</label>
            <div className="relative">
              <Input 
                required 
                type="datetime-local"
                name="endAt" 
                defaultValue={formatDateForInput(initialData?.endAt)} 
                className="pl-10 pr-3 py-2 w-full"
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Registration Deadline */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">Registration Deadline *</label>
            <div className="relative">
              <Input 
                required 
                type="datetime-local"
                name="registrationDeadline" 
                defaultValue={formatDateForInput(initialData?.registrationDeadline)} 
                className="pl-10 pr-3 py-2 w-full"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">Total Capacity (Seats) *</label>
            <div className="relative">
              <Input 
                required 
                type="number"
                min="1"
                name="capacity" 
                defaultValue={initialData?.capacity}
                placeholder="e.g. 100" 
                className="pl-10 pr-3 py-2 w-full"
              />
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          
          {/* Fees */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">Registration Fees (INR) *</label>
            <div className="relative">
              <Input 
                required 
                type="number"
                min="0"
                step="0.01"
                name="fees" 
                defaultValue={initialData?.fees ?? 0}
                placeholder="e.g. 500" 
                className="pl-10 pr-3 py-2 w-full"
              />
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Banner URL (Mocked since no storage) */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">Banner Image URL</label>
            <div className="relative">
              <Input 
                type="url"
                name="bannerUrl" 
                defaultValue={initialData?.bannerUrl}
                placeholder="https://example.com/image.jpg" 
                className="pl-10 pr-3 py-2 w-full"
              />
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Event" : "Publish Event"}
        </Button>
      </div>
    </form>
  );
}
