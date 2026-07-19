"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LocationInput } from "./LocationInput";
import EventMap from "@/app/components/events/EventMap";
import { toast } from "sonner";
import { CalendarIcon, Users, IndianRupee, Image as ImageIcon, FileText, Tag, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@/components/ui/attachment";
import { DateTimePicker } from "@/components/datetime-picker";

type EventCategory = "ACADEMIC" | "CULTURAL" | "SPORTS" | "TECHNICAL" | "WORKSHOP" | "SOCIAL" | "OTHER";

const CATEGORIES: EventCategory[] = [
  "ACADEMIC", "CULTURAL", "SPORTS", "TECHNICAL", "WORKSHOP", "SOCIAL", "OTHER"
];

export function AdminEventForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [venue, setVenue] = useState(initialData?.venue || "");
  const [bannerUrl, setBannerUrl] = useState(initialData?.bannerUrl || "");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");

  const [startAt, setStartAt] = useState<Date | undefined>(initialData?.startAt ? new Date(initialData.startAt) : undefined);
  const [endAt, setEndAt] = useState<Date | undefined>(initialData?.endAt ? new Date(initialData.endAt) : undefined);
  const [registrationDeadline, setRegistrationDeadline] = useState<Date | undefined>(initialData?.registrationDeadline ? new Date(initialData.registrationDeadline) : undefined);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    setUploadingBanner(true);
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Ensure file name is unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('unievents') // assuming 'unievents' bucket exists
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('unievents')
        .getPublicUrl(filePath);

      setBannerUrl(data.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!startAt || !endAt || !registrationDeadline) {
      toast.error("Please fill in all date and time fields");
      setLoading(false);
      return;
    }

    if (registrationDeadline > startAt) {
      toast.error("Registration deadline must be on or before the event start time");
      setLoading(false);
      return;
    }

    if (endAt <= startAt) {
      toast.error("Event end time must be after the start time");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      bannerUrl: bannerUrl || "/events/1.jpg",
      category: formData.get("category"),
      venue,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      registrationDeadline: registrationDeadline.toISOString(),
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

          {/* Start Time */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">Start Time *</label>
            <DateTimePicker 
              value={startAt}
              onChange={setStartAt}
              use12HourFormat
            />
          </div>

          {/* End Time */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">End Time *</label>
            <DateTimePicker 
              value={endAt}
              onChange={setEndAt}
              min={startAt}
              use12HourFormat
            />
          </div>

          {/* Registration Deadline */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">Registration Deadline *</label>
            <DateTimePicker 
              value={registrationDeadline}
              onChange={setRegistrationDeadline}
              max={startAt}
              use12HourFormat
            />
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

          {/* Banner URL */}
          <div className="space-y-2 relative md:col-span-2">
            <label className="text-sm font-medium text-foreground">Banner Image *</label>
            
            {!bannerUrl && !uploadingBanner ? (
              <div className="relative">
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="pl-10 py-2 w-full file:bg-transparent file:border-0 file:text-sm file:font-medium text-foreground"
                />
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            ) : (
              <div className="flex gap-4 items-start flex-col">
                <Attachment state={uploadingBanner ? "uploading" : "done"}>
                  <AttachmentMedia variant={bannerUrl ? "image" : "icon"}>
                    {bannerUrl ? (
                      <img src={bannerUrl} alt="Banner" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>
                      {uploadingBanner ? uploadFileName : bannerUrl.split('/').pop()}
                    </AttachmentTitle>
                    <AttachmentDescription>
                      {uploadingBanner ? "Uploading to Supabase Storage..." : "Banner uploaded successfully."}
                    </AttachmentDescription>
                  </AttachmentContent>
                  {bannerUrl && !uploadingBanner && (
                    <AttachmentActions>
                      <AttachmentAction
                        variant="ghost"
                        type="button"
                        onClick={() => setBannerUrl("")}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </AttachmentAction>
                    </AttachmentActions>
                  )}
                </Attachment>
                <Input 
                  type="hidden"
                  name="bannerUrl"
                  value={bannerUrl}
                />
              </div>
            )}
          </div>

          {/* Venue */}
          <div className="space-y-4 md:col-span-2">
            <LocationInput 
              name="venue" 
              label="Venue (OpenStreetMap) *" 
              placeholder="Search location..." 
              value={venue}
              onChange={setVenue}
            />
            {venue && (
              <div className="h-72 rounded-xl overflow-hidden border border-outline-variant shadow-sm relative isolate z-0">
                <EventMap venue={venue} />
              </div>
            )}
          </div>
        </div>

      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading || uploadingBanner}>
          {loading ? "Saving..." : initialData ? "Update Event" : "Publish Event"}
        </Button>
      </div>
    </form>
  );
}
