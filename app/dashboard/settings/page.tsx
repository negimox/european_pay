import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SettingsForm } from "./SettingsForm";
import { LinkBreadcrumb } from "@/app/components/dashboard/LinkBreadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and profile information.",
};

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full h-full p-[16px] md:p-[24px] lg:p-[32px] max-w-4xl mx-auto flex-1 overflow-x-hidden bg-surface">
      {/* Breadcrumbs */}
      <LinkBreadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", icon: "settings" }]} />

      <div className="mb-8">
        <h1 className="font-display-lg text-display-lg text-primary mb-2">
          Settings
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Manage your account settings and profile information.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h2 className="text-xl font-semibold mb-6 text-on-surface border-b border-outline-variant/30 pb-4">
          Profile Information
        </h2>

        <SettingsForm
          initialFirstName={user.firstName}
          initialLastName={user.lastName}
          email={user.email}
        />
      </div>
    </div>
  );
}
