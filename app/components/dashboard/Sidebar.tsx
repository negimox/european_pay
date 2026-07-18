"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Events", href: "/dashboard/events", icon: "event" },
    {
      name: "My Registrations",
      href: "/dashboard/registrations",
      icon: "how_to_reg",
    },
    {
      name: "Announcements",
      href: "/dashboard/announcements",
      icon: "campaign",
    },
    { name: "Admin Tools", href: "/admin", icon: "admin_panel_settings" },
  ];

  return (
    <Sidebar className="bg-surface-container-low border-r border-outline-variant">
      <SidebarHeader className="p-md">
        <div className="mb-sm mt-2 px-2">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            UniEvent
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
            Student Portal
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-sm px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    className="p-0 h-auto w-full rounded-lg transition-all duration-200 data-active:bg-primary data-active:text-on-primary data-active:hover:bg-primary data-active:hover:text-on-primary hover:bg-surface-container-high hover:text-on-surface overflow-hidden"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 w-full h-full"
                    >
                      <span className="material-symbols-outlined text-[22px] shrink-0">
                        {item.icon}
                      </span>
                      <span className="font-label-md text-label-md">
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2 mt-2">
          <Link
            href="/admin"
            className="bg-primary text-on-primary font-label-md text-label-md py-sm px-md rounded-lg hover:shadow-md transition-all duration-200 w-full text-center block"
          >
            Create Event
          </Link>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-outline-variant p-4">
        <SidebarMenu className="gap-sm">
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/settings"}
              className="p-0 h-auto w-full rounded-lg transition-all duration-200 data-active:bg-primary data-active:text-on-primary data-active:hover:bg-primary data-active:hover:text-on-primary hover:bg-surface-container-high hover:text-on-surface overflow-hidden"
            >
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 w-full h-full text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[22px] shrink-0">
                  settings
                </span>
                <span className="font-label-md text-label-md">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
