import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | UniEvents",
    default: "UniEvents — Campus Event Portal",
  },
  description:
    "UniEvents — your college event management portal. Discover events, register easily, and stay updated.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
