export type NavItem = {
  name: string;
  mobileName: string;
  href: string;
  icon: string;
};

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", mobileName: "Dashboard", href: "/dashboard/admin", icon: "dashboard" },
  { name: "Manage Events", mobileName: "Events", href: "/dashboard/admin/events", icon: "event" },
  { name: "Manage Announcements", mobileName: "Notices", href: "/dashboard/admin/announcements", icon: "campaign" },
];

export const USER_NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", mobileName: "Home", href: "/dashboard", icon: "dashboard" },
  { name: "Events", mobileName: "Events", href: "/dashboard/events", icon: "event" },
  { name: "My Registrations", mobileName: "My Events", href: "/dashboard/registrations", icon: "how_to_reg" },
  { name: "Announcements", mobileName: "Notices", href: "/dashboard/announcements", icon: "campaign" },
];

export const ALL_NAV_ITEMS: NavItem[] = [...ADMIN_NAV_ITEMS, ...USER_NAV_ITEMS];
