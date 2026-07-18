"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Megaphone, Link2, Trash2 } from "lucide-react";
import Link from "next/link";
import { LinkBreadcrumb } from "@/app/components/dashboard/LinkBreadcrumb";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/admin/announcements");
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const attachmentsStr = formData.get("attachments") as string;
    
    const attachments = attachmentsStr.split(",").map(url => url.trim()).filter(url => url.length > 0);

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, attachments }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to publish announcement");
      }
      
      toast.success("Announcement published successfully!");
      setIsDialogOpen(false);
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete announcement");
      toast.success("Announcement deleted successfully");
      fetchAnnouncements();
    } catch (err) {
      toast.error("Error deleting announcement");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface-bright flex-1 overflow-x-hidden">
      {/* Breadcrumbs */}
      <LinkBreadcrumb items={[{ label: "Dashboard", href: "/dashboard/admin" }, { label: "Manage Announcements" }]} />

      <div className="mb-lg select-none flex items-center justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg lg:text-display-lg text-on-surface font-bold">
            Admin Panel
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
            Manage platform resources and data.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button />}>
            Create Announcement
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <p className="text-xs text-muted-foreground mb-1">Must be between 5 and 35 words.</p>
                <div className="relative">
                  <Input 
                    required 
                    name="title" 
                    placeholder="e.g. Important notice regarding upcoming exams and schedules" 
                    className="pl-10 py-2 w-full"
                  />
                  <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <p className="text-xs text-muted-foreground mb-1">Maximum 1000 words.</p>
                <Textarea 
                  required 
                  name="content" 
                  placeholder="Details about the announcement..." 
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-foreground">Attachments (Optional)</label>
                <p className="text-xs text-muted-foreground mb-1">Comma-separated URLs.</p>
                <div className="relative">
                  <Input 
                    name="attachments" 
                    placeholder="https://example.com/file.pdf, https://example.com/image.png" 
                    className="pl-10 py-2 w-full"
                  />
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-on-surface-variant">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface-variant">
            No announcements found. Publish one to notify students.
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{announcement.title}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Published by {announcement.publishedBy.firstName} on {format(new Date(announcement.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(announcement.id)}
                  disabled={deletingId === announcement.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-body-md text-on-surface whitespace-pre-wrap">{announcement.content}</p>
              
              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-outline-variant">
                  <h4 className="text-sm font-semibold mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {announcement.attachments.map((url: string, i: number) => (
                      <a 
                        key={i} 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline bg-primary/10 px-3 py-1 rounded-full"
                      >
                        <Link2 className="w-3 h-3" />
                        Attachment {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
