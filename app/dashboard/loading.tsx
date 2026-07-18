import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-x-hidden bg-surface animate-in fade-in duration-500">
      {/* Breadcrumb Skeleton */}
      <nav className="flex items-center gap-xs mb-lg">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </nav>

      {/* Greeting Skeleton */}
      <section className="mb-lg">
        <Skeleton className="h-10 md:h-12 w-3/4 max-w-sm mb-2" />
        <Skeleton className="h-6 w-full max-w-md" />
      </section>

      {/* Quick Stats Bento Grid Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </section>

      {/* Main Layout: Events (Left) & Announcements (Right Sidebar) Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Events Section Skeleton */}
        <section className="lg:col-span-8">
          <div className="flex justify-between items-center mb-md">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>

          <div className="flex gap-md overflow-x-auto pb-4 hide-scrollbar">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col h-[300px]">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-4 flex flex-col gap-4 flex-1">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <div className="mt-auto space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Announcements Sidebar Section Skeleton */}
        <section className="lg:col-span-4 flex flex-col">
          <div className="flex justify-between items-center mb-md">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>

          <div className="bg-surface-container-low rounded-xl border border-outline-variant p-2 flex flex-col gap-2 h-[400px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-surface-container-lowest/50 border border-outline-variant/30 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
