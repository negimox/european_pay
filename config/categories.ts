// Matches the EventCategory enum in schema.prisma
export const EVENT_CATEGORIES = [
  "ACADEMIC",
  "CULTURAL",
  "SPORTS",
  "TECHNICAL",
  "WORKSHOP",
  "SOCIAL",
  "OTHER",
] as const;

// Nicely formatted labels for display
export const CATEGORY_LABELS: Record<string, string> = {
  ALL: "All events",
  ACADEMIC: "Academic",
  CULTURAL: "Cultural",
  SPORTS: "Sports",
  TECHNICAL: "Technical",
  WORKSHOP: "Workshop",
  SOCIAL: "Social",
  OTHER: "Other",
};

// Material icons for each category
export const CATEGORY_ICONS: Record<string, string> = {
  ALL: "campaign",
  ACADEMIC: "school",
  CULTURAL: "palette",
  SPORTS: "sports_basketball",
  TECHNICAL: "computer",
  WORKSHOP: "build",
  SOCIAL: "groups",
  OTHER: "category",
};

// Colors for each category icon
export const CATEGORY_COLORS: Record<string, string> = {
  ALL: "text-blue-500",
  ACADEMIC: "text-indigo-500",
  CULTURAL: "text-pink-500",
  SPORTS: "text-orange-500",
  TECHNICAL: "text-emerald-500",
  WORKSHOP: "text-amber-500",
  SOCIAL: "text-purple-500",
  OTHER: "text-slate-500",
};

// Background colors for category icons (useful for floating cards and badges)
export const CATEGORY_BG_COLORS: Record<string, string> = {
  ALL: "bg-blue-500/10",
  ACADEMIC: "bg-indigo-500/10",
  CULTURAL: "bg-pink-500/10",
  SPORTS: "bg-orange-500/10",
  TECHNICAL: "bg-emerald-500/10",
  WORKSHOP: "bg-amber-500/10",
  SOCIAL: "bg-purple-500/10",
  OTHER: "bg-slate-500/10",
};
