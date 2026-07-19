"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface AnnouncementModalProps {
  announcement: Announcement;
  trigger: ReactNode;
}

export function AnnouncementModal({ announcement, trigger }: AnnouncementModalProps) {
  const date = new Date(announcement.createdAt).toLocaleDateString();

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col bg-surface text-on-surface p-0 border-outline-variant/30">
        <DialogHeader className="p-6 pb-2 text-left">
          <DialogTitle className="font-display-sm text-display-sm pr-6">
            {announcement.title}
          </DialogTitle>
          <DialogDescription className="font-body-sm text-on-surface-variant">
            {date}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-0 overflow-y-auto font-body-md text-on-surface-variant whitespace-pre-wrap">
          {announcement.content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
