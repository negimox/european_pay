import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

export function EventCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "p-0 gap-0 h-full flex flex-col border-0 bg-transparent shadow-none ring-0",
        className,
      )}
    >
      <div className="relative w-full overflow-hidden rounded-[20px]">
        <AspectRatio ratio={16 / 10}>
          <Skeleton className="w-full h-full" />
        </AspectRatio>
      </div>

      <div className="py-3 flex flex-col flex-1">
        <CardHeader className="p-0 space-y-0">
          <Skeleton className="h-[22px] w-3/4 mb-1" />
          <Skeleton className="h-[22px] w-1/2" />
        </CardHeader>

        <CardContent className="p-0 mt-2 flex flex-col flex-1">
          <div className="flex flex-col gap-2 mt-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <div className="flex items-center gap-2 mt-auto pt-4">
            <div className="flex -space-x-1.5">
              <Skeleton className="w-[26px] h-[26px] rounded-full border-2 border-background" />
              <Skeleton className="w-[26px] h-[26px] rounded-full border-2 border-background" />
              <Skeleton className="w-[26px] h-[26px] rounded-full border-2 border-background" />
            </div>
            <Skeleton className="h-4 w-24 ml-2" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
