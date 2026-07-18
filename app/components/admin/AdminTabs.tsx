"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: "Events", href: "/dashboard/admin/events" },
    { name: "Announcements", href: "/dashboard/admin/announcements" },
  ];

  return (
    <div className="flex space-x-1 border-b border-outline-variant mb-6">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline"
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
