"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from "@/config/navigation";

export function MobileBottomNav({ role }: { role?: string }) {
  const pathname = usePathname();

  const navItems = role === "ADMIN" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t bg-surface shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-outline-variant">
      {navItems.map((item) => {
        const isActive = (item.href === "/dashboard" || item.href === "/dashboard/admin")
          ? pathname === item.href
          : pathname.startsWith(item.href);
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
