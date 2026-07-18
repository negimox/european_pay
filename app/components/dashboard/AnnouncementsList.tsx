import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface AnnouncementsListProps {
  announcements: Announcement[];
  loading?: boolean;
}

export function AnnouncementsList({
  announcements,
  loading = false,
}: AnnouncementsListProps) {
  return (
    <Card className="h-full border-outline-variant/30 bg-surface">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-primary">campaign</span>
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <ScrollArea className="h-[400px] px-6 pb-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-2 p-4 border border-outline-variant/20 rounded-lg">
                  <div className="h-5 bg-surface-container-high rounded w-3/4"></div>
                  <div className="h-4 bg-surface-container-high rounded w-full"></div>
                  <div className="h-4 bg-surface-container-high rounded w-1/2 mt-2"></div>
                </div>
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-on-surface-variant/70 text-center">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">
                notifications_paused
              </span>
              <p className="font-body-md">No announcements yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div key={announcement.id} className="flex flex-col gap-1">
                  {index > 0 && <Separator className="my-4 bg-outline-variant/30" />}
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-title-md text-title-md font-medium text-on-surface">
                      {announcement.title}
                    </h4>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
