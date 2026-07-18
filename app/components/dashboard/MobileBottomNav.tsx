"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: "dashboard" },
    { name: "Events", href: "/dashboard/events", icon: "event" },
    {
      name: "Tickets",
      href: "/dashboard/registrations",
      icon: "how_to_reg",
    },
    {
      name: "Notices",
      href: "/dashboard/announcements",
      icon: "campaign",
    },
    { name: "Admin", href: "/admin", icon: "admin_panel_settings" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t bg-surface shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-outline-variant">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            prefetch={false}
            data-active={isActive}
            className="flex flex-col items-center justify-center gap-1 text-on-surface-variant transition-colors hover:text-on-surface data-[active=true]:text-primary w-full h-full"
          >
            <span className="material-symbols-outlined text-[24px]">
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
