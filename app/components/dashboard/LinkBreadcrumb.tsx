import Link from "next/link";
import { ALL_NAV_ITEMS } from "@/config/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export function LinkBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-xs font-display-md text-label-md text-on-surface-variant mb-lg"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        let icon = item.icon;
        if (!icon) {
          const configItem = ALL_NAV_ITEMS.find(
            (nav) => nav.href === item.href || nav.name === item.label || nav.mobileName === item.label
          );
          if (configItem) {
            icon = configItem.icon;
          }
        }

        const content = (
          <span className="flex items-center gap-1">
            {icon && (
              <span className="material-symbols-outlined text-[18px]">
                {icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
          </span>
        );

        return (
          <div key={index} className="flex items-center gap-xs">
            {isLast ? (
              <span className="text-on-surface font-display-md">
                {content}
              </span>
            ) : (
              <>
                <Link
                  href={item.href || "#"}
                  prefetch={false}
                  className="hover:text-primary transition-colors flex items-center"
                >
                  {content}
                </Link>
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
