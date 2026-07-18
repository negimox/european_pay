import { Suspense, cache } from "react";
import { DashboardContent } from "@/app/components/dashboard/DashboardContent";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

// Mark as dynamic — reads cookies via getSession()
export const dynamic = "force-dynamic";

/**
 * Wrap all DB fetches in React's cache() so that if this function is called
 * multiple times within the same render pass (e.g. due to Suspense boundaries
 * or layout re-renders), Prisma is only hit once.
 */
const getDashboardData = cache(async (userId: string | undefined) => {
  const [user, events, registrations, announcements] = await Promise.all([
    // Only fetch user name when logged in
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          select: { firstName: true, lastName: true },
        })
      : Promise.resolve(null),

    // Upcoming events with active registration count
    prisma.event.findMany({
      where: { startAt: { gt: new Date() } },
      orderBy: { startAt: "asc" },
      include: {
        _count: { select: { registrations: { where: { status: "ACTIVE" } } } },
      },
    }),

    // User registrations — no include: { event: true } to avoid the
    // "WHERE id IN (NULL)" wasted query when the user has no registrations.
    // Event details needed by the UI are already covered by the events query above.
    userId
      ? prisma.registration.findMany({
          where: { userId, status: "ACTIVE" },
          orderBy: { registeredAt: "desc" },
        })
      : Promise.resolve([]),

    // Latest 10 announcements
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return { user, events, registrations, announcements };
});

export default async function DashboardPage() {
  const session = await getSession();
  const { user, events, registrations, announcements } = await getDashboardData(
    session?.userId
  );

  const userName = user ? `${user.firstName} ${user.lastName}` : "Student";

  return (
    <Suspense fallback={<div className="p-8 text-on-surface">Loading Dashboard...</div>}>
      <DashboardContent
        userName={userName}
        initialEvents={events}
        initialRegistrations={registrations}
        initialAnnouncements={announcements}
      />
    </Suspense>
  );
}
