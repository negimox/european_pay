import { AppSidebar } from "@/app/components/dashboard/Sidebar";
import { TopNav } from "@/app/components/dashboard/TopNav";
import { MobileBottomNav } from "@/app/components/dashboard/MobileBottomNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  let user = null;
  if (session?.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { firstName: true, lastName: true, email: true },
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar role={session?.role} />
      <SidebarInset className="pb-16 md:pb-0">
        <TopNav user={user} />
        {children}
      </SidebarInset>
      <MobileBottomNav role={session?.role} />
    </SidebarProvider>
  );
}
