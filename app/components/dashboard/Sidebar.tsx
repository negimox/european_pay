"use client";

import Link from "next/link";
import Image from "next/image";
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

import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from "@/config/navigation";

export function AppSidebar({ role }: { role?: string }) {
  const pathname = usePathname();

  const navItems = role === "ADMIN" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <Sidebar className="bg-surface-container-low border-r border-outline-variant">
      <SidebarHeader className="p-md">
        <Link
          href="/dashboard"
          prefetch={false}
          className="mb-sm mt-2 px-2 block group select-none"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/web-app-manifest-512x512.png"
              alt="UniEvent Logo"
              width={28}
              height={28}
              className="pointer-events-none"
            />
            <h1 className="font-headline-sm text-headline-md font-bold text-primary group-hover:text-primary/80 transition-colors">
              UniEvent
            </h1>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-sm px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={
                      (item.href === "/dashboard" || item.href === "/dashboard/admin") 
                        ? pathname === item.href 
                        : pathname.startsWith(item.href)
                    }
                    className="p-0 h-auto w-full rounded-lg transition-all duration-200 data-active:bg-primary data-active:text-on-primary data-active:hover:bg-primary data-active:hover:text-on-primary hover:bg-surface-container-high hover:text-on-surface overflow-hidden"
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
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

      </SidebarContent>


    </Sidebar>
  );
}
