import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Ticket, CalendarClock, IndianRupee, Plus, Megaphone } from "lucide-react";
import { RegistrationTrendsChart } from "@/app/components/admin/RegistrationTrendsChart";
import { EventsByCategoryChart } from "@/app/components/admin/EventsByCategoryChart";
import { LinkBreadcrumb } from "@/app/components/dashboard/LinkBreadcrumb";

export default async function AdminDashboardPage() {
  // 1. Total Users
  const totalUsers = await prisma.user.count({
    where: { role: "STUDENT" },
  });

  // 2. Total Registrations & Active Registrations
  const totalRegistrations = await prisma.registration.count({
    where: { status: "ACTIVE" },
  });

  // 3. Active Events
  const now = new Date();
  const activeEvents = await prisma.event.count({
    where: {
      endAt: { gt: now },
    },
  });

  // 4. Ticket Revenue
  // Fetch all active events and their registration counts
  const eventsForRevenue = await prisma.event.findMany({
    select: {
      fees: true,
      _count: {
        select: {
          registrations: {
            where: { status: "ACTIVE" },
          },
        },
      },
    },
  });
  
  const ticketRevenue = eventsForRevenue.reduce(
    (acc, event) => acc + (event.fees * event._count.registrations),
    0
  );

  // 5. Registration Trends (Group by date over the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentRegistrations = await prisma.registration.findMany({
    where: {
      registeredAt: { gte: thirtyDaysAgo },
    },
    select: {
      registeredAt: true,
    },
    orderBy: {
      registeredAt: 'asc',
    }
  });

  // Process data for trend chart
  const trendsMap = new Map<string, number>();
  recentRegistrations.forEach((reg) => {
    const date = reg.registeredAt.toISOString().split("T")[0]; // YYYY-MM-DD
    trendsMap.set(date, (trendsMap.get(date) || 0) + 1);
  });
  
  const trendData = Array.from(trendsMap.entries()).map(([date, count]) => ({
    date,
    registrations: count,
  }));

  // 6. Events by Category (Pie Chart)
  const eventsByCategoryRaw = await prisma.event.groupBy({
    by: ["category"],
    _count: {
      _all: true,
    },
  });
  
  const categoryData = eventsByCategoryRaw.map((item) => ({
    category: item.category,
    value: item._count._all,
  }));

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface-bright flex-1 overflow-x-hidden">
      {/* Breadcrumbs */}
      <LinkBreadcrumb items={[{ label: "Dashboard" }]} />

      <div className="mb-lg select-none flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg lg:text-display-lg text-on-surface font-bold">
            Analytics Dashboard
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
            Platform overview and key performance indicators.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/announcements">
            <Button variant="outline" className="gap-2">
              <Megaphone className="w-4 h-4" />
              New Announcement
            </Button>
          </Link>
          <Link href="/dashboard/admin/events/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-surface-container-lowest border-outline-variant shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Total Users</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">{totalUsers}</div>
            <p className="text-xs text-on-surface-variant mt-1">Registered student accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Total Registrations</CardTitle>
            <Ticket className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">{totalRegistrations}</div>
            <p className="text-xs text-on-surface-variant mt-1">Active event tickets</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Active Events</CardTitle>
            <CalendarClock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">{activeEvents}</div>
            <p className="text-xs text-on-surface-variant mt-1">Upcoming or ongoing</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Ticket Revenue</CardTitle>
            <IndianRupee className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">
              ₹{ticketRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">Total fees collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegistrationTrendsChart data={trendData} />
        <EventsByCategoryChart data={categoryData} />
      </div>
    </div>
  );
}
