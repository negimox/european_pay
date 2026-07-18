"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface LegalModalProps {
  type: "terms" | "privacy";
  trigger: ReactNode;
}

export function LegalModal({ type, trigger }: LegalModalProps) {
  const isTerms = type === "terms";
  const title = isTerms ? "Terms of Service" : "Privacy Policy";
  const date = "Effective Date: August 1, 2026";

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col bg-surface text-on-surface p-0 border-outline-variant/30">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-display-sm text-display-sm">
            {title}
          </DialogTitle>
          <DialogDescription className="font-body-sm text-on-surface-variant">
            {date}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-0 overflow-y-auto font-body-md text-on-surface-variant space-y-4">
          {isTerms ? (
            <>
              <h3 className="font-headline-sm text-on-surface">
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing and using UniEvent, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>

              <h3 className="font-headline-sm text-on-surface">
                2. Description of Service
              </h3>
              <p>
                UniEvent provides students, faculty, and administrators with a
                platform to manage, discover, and register for campus events.
                The university reserves the right to modify or discontinue,
                temporarily or permanently, the service with or without notice.
              </p>

              <h3 className="font-headline-sm text-on-surface">
                3. User Conduct
              </h3>
              <p>
                You agree to use the service only for lawful purposes. You are
                prohibited from violating or attempting to violate the security
                of the portal, including accessing data not intended for you or
                logging into a server or account which you are not authorized to
                access.
              </p>

              <h3 className="font-headline-sm text-on-surface">
                4. Event Registration & Attendance
              </h3>
              <p>
                Registering for an event constitutes a commitment to attend.
                Misuse of the registration system (such as repeatedly
                registering and failing to attend) may result in restricted
                access to future events.
              </p>

              <h3 className="font-headline-sm text-on-surface">
                5. Modification of Terms
              </h3>
              <p>
                We reserve the right to change these conditions from time to
                time as we see fit and your continued use of the site will
                signify your acceptance of any adjustment to these terms.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-headline-sm text-on-surface">
                1. Information Collection
              </h3>
              <p>
                When you register for a UniEvent account, we collect personal
                information such as your name, university email address, and
                department affiliation. This information is strictly used for
                portal authentication and event management.
              </p>

              <h3 className="font-headline-sm text-on-surface">
                2. Information Usage
              </h3>
              <p>
                The information we collect is used to personalize your
                experience, improve our platform, and send periodic emails
                regarding upcoming events or important university announcements.
              </p>

              <h3 className="font-headline-sm text-on-surface">
                3. Data Protection
              </h3>
              <p>
                We implement a variety of security measures to maintain the
                safety of your personal information. Your account is protected
                by an encrypted password and session management.
              </p>

              <h3 className="font-headline-sm text-on-surface">
                4. Information Sharing
              </h3>
              <p>
                We do not sell, trade, or otherwise transfer to outside parties
                your personally identifiable information. This does not include
                trusted university administrators who assist us in operating our
                portal, so long as those parties agree to keep this information
                confidential.
              </p>

              <h3 className="font-headline-sm text-on-surface">5. Consent</h3>
              <p>
                By using our campus portal, you consent to our privacy policy.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
