import { AppSidebar } from "@/app/components/dashboard/Sidebar";
import { TopNav } from "@/app/components/dashboard/TopNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNav />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
