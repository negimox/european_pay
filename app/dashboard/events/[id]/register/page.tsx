"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { LinkBreadcrumb } from "@/app/components/dashboard/LinkBreadcrumb";

const REDIRECT_DELAY = 5; // seconds

interface FormErrors {
  tshirtSize?: string;
  dietaryRequirements?: string;
}

export default function RegisterEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // ── Data state ─────────────────────────────────────────────────────────────
  const [event, setEvent] = useState<any>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({ name: "", email: "" });
  const [userLoading, setUserLoading] = useState(true);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    tshirtSize: "",
    dietaryRequirements: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // ── Success + countdown state ──────────────────────────────────────────────
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch event + user in parallel ────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch("/api/events")
        .then((r) => r.json())
        .then((data) => {
          const found = data.events?.find((e: any) => e.id === id);
          if (found) setEvent(found);
          else toast.error("Event not found");
        })
        .catch(console.error)
        .finally(() => setEventLoading(false)),

      fetch("/api/user/me")
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            setUserProfile({
              name: `${data.user.firstName}${data.user.lastName ? ` ${data.user.lastName}` : ""}`,
              email: data.user.email ?? "",
            });
          }
        })
        .catch(console.error)
        .finally(() => setUserLoading(false)),
    ]);
  }, [id]);

  // ── Auto-redirect countdown after success ─────────────────────────────────
  useEffect(() => {
    if (!success) return;
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          router.push("/dashboard/registrations");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current!);
  }, [success, router]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (fields = formData): FormErrors => {
    const errs: FormErrors = {};
    if (!fields.tshirtSize) errs.tshirtSize = "Please select a T-Shirt size.";
    if (!fields.dietaryRequirements.trim())
      errs.dietaryRequirements =
        'Please enter your dietary requirements (or write "None").';
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    if (touched[e.target.name]) setErrors(validate(updated));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setErrors(validate());
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ tshirtSize: true, dietaryRequirements: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tshirtSize: formData.tshirtSize,
          dietaryRequirements: formData.dietaryRequirements,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        toast.error(data.error || "Registration failed. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const FieldError = ({ name }: { name: keyof FormErrors }) =>
    touched[name] && errors[name] ? (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
        <span className="material-symbols-outlined text-[14px]">error</span>
        {errors[name]}
      </p>
    ) : null;

  // ── Skeleton loading ──────────────────────────────────────────────────────
  if (eventLoading) {
    return (
      <main className="flex-1 w-full max-w-7xl mx-auto py-lg px-margin-mobile md:px-margin-desktop lg:px-gutter">
        <Skeleton className="h-5 w-48 mb-6" />
        <Skeleton className="h-5 w-32 mb-xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <aside className="lg:col-span-4">
            <Card className="bg-surface-container-low border-outline-variant overflow-hidden">
              <div className="h-1 w-full bg-surface-container-high" />
              <CardHeader className="pb-2 pt-md px-md">
                <Skeleton className="h-6 w-32 mb-sm" />
                <Skeleton className="h-8 w-full" />
              </CardHeader>
              <CardContent className="px-md pb-md flex flex-col gap-md">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-full mt-1" />
                  </div>
                </div>
                <div className="pt-sm border-t border-outline-variant space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
                <Skeleton className="h-16 w-full rounded-lg" />
              </CardContent>
            </Card>
          </aside>

          <section className="lg:col-span-8">
            <Card className="bg-surface-container-lowest border-outline-variant">
              <CardHeader className="border-b border-outline-variant pb-md">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="pt-lg flex flex-col gap-lg">
                <Skeleton className="h-28 w-full rounded-lg" />
                <hr className="border-outline-variant" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="pt-sm border-t border-outline-variant">
                  <Skeleton className="h-12 w-48 rounded-md" />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex-1 p-8 text-on-surface">
        Event not found.{" "}
        <Link href="/dashboard/events" className="text-primary underline">
          Back to Events
        </Link>
      </main>
    );
  }

  const registrationCount: number = event._count?.registrations ?? 0;
  const seatsAvailable = Math.max(0, event.capacity - registrationCount);
  const progressPct =
    event.capacity > 0
      ? Math.min(100, (registrationCount / event.capacity) * 100)
      : 0;

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[70vh] px-margin-mobile">
        <div className="w-full max-w-md text-center flex flex-col items-center gap-lg">
          {/* Animated check icon */}
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
            <span
              className="material-symbols-outlined text-[52px] text-green-600"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              task_alt
            </span>
          </div>

          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
              You&apos;re registered! 🎉
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Your spot at{" "}
              <strong className="text-on-surface">{event.title}</strong> is
              confirmed. A confirmation has been sent to{" "}
              <strong className="text-on-surface">{userProfile.email}</strong>.
            </p>
          </div>

          {/* Countdown progress */}
          <div className="w-full flex flex-col items-center gap-sm">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Redirecting to My Registrations in{" "}
              <strong className="text-primary">{countdown}s</strong>…
            </p>
            <Progress
              value={((REDIRECT_DELAY - countdown) / REDIRECT_DELAY) * 100}
              className="h-1.5 w-full [&>div]:bg-primary"
            />
          </div>

          <div className="flex gap-sm flex-wrap justify-center">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/events/${id}`)}
              className="gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Back to Event
            </Button>
            <Button
              onClick={() => router.push("/dashboard/registrations")}
              className="gap-2 text-white"
              style={{ background: "hsl(217 91% 60%)" }}
            >
              <span className="material-symbols-outlined text-[18px]">
                how_to_reg
              </span>
              My Registrations
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto py-lg px-margin-mobile md:px-margin-desktop lg:px-gutter">
      {/* Breadcrumb */}
      <LinkBreadcrumb items={[
        { label: "Events", href: "/dashboard/events" }, 
        { label: event.title, href: `/dashboard/events/${id}` },
        { label: "Register" }
      ]} />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors mb-xl group"
      >
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-0.5 transition-transform">
          arrow_back
        </span>
        Back to Event
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* ── Left: Event Summary Card ── */}
        <aside className="lg:col-span-4">
          <Card className="bg-surface-container-low border-outline-variant shadow-sm sticky top-[100px] overflow-hidden">
            {/* Colour bar */}
            <div className="h-1 w-full bg-gradient-to-r from-secondary to-primary" />

            <CardHeader className="pb-2 pt-md px-md">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-sm w-fit"
                style={{ background: "hsl(217 91% 60%)" }}
              >
                Review Registration
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface leading-snug">
                {event.title}
              </h2>
            </CardHeader>

            <CardContent className="px-md pb-md flex flex-col gap-md">
              <ul className="flex flex-col gap-sm text-on-surface-variant font-body-md text-body-md">
                <li className="flex items-start gap-sm">
                  <span
                    className="material-symbols-outlined text-secondary shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    calendar_today
                  </span>
                  <span>
                    {new Date(event.startAt).toLocaleDateString()}
                    <br />
                    <span className="text-sm">
                      Starts at{" "}
                      {new Date(event.startAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-sm">
                  <span
                    className="material-symbols-outlined text-secondary shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    location_on
                  </span>
                  <span>{event.venue}</span>
                </li>
              </ul>

              {/* Seat availability */}
              <div className="flex flex-col gap-xs pt-sm border-t border-outline-variant">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">
                    Seats Available
                  </span>
                  <span className="font-bold text-on-surface">
                    {seatsAvailable} / {event.capacity}
                  </span>
                </div>
                <Progress
                  value={progressPct}
                  className="h-1.5 [&>div]:bg-secondary"
                />
              </div>

              {/* Ticket */}
              <div className="bg-surface-container p-sm rounded-lg border border-outline-variant">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
                  Selected Ticket
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    Free Student Pass
                  </span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    $0.00
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* ── Right: Form ── */}
        <section className="lg:col-span-8">
          <Card className="bg-surface-container-lowest border-outline-variant shadow-sm">
            <CardHeader className="border-b border-outline-variant pb-md">
              <h1 className="font-headline-md text-headline-md text-on-surface">
                Attendee Details
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Fill in the required details below to complete your
                registration.
              </p>
            </CardHeader>

            <CardContent className="pt-lg">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-lg"
              >
                {/* ── Locked prefilled fields ── */}
                <div className="rounded-lg border border-outline-variant bg-surface-container p-md flex flex-col gap-md">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      lock
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Auto-filled from your account — cannot be changed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-xs"
                        htmlFor="name"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <Input
                          id="name"
                          value={userLoading ? "" : userProfile.name}
                          readOnly
                          disabled
                          placeholder={userLoading ? "Loading…" : ""}
                          className="pr-9 bg-surface-container-low text-on-surface-variant cursor-not-allowed"
                        />
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant/40">
                          lock
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-xs"
                        htmlFor="email"
                      >
                        University Email
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={userLoading ? "" : userProfile.email}
                          readOnly
                          disabled
                          placeholder={userLoading ? "Loading…" : ""}
                          className="pr-9 bg-surface-container-low text-on-surface-variant cursor-not-allowed"
                        />
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant/40">
                          lock
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-outline-variant" />

                {/* ── T-Shirt Size ── */}
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-xs"
                    htmlFor="tshirtSize"
                  >
                    T-Shirt Size <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tshirtSize"
                    id="tshirtSize"
                    value={formData.tshirtSize}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-md bg-surface p-sm font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none ${
                      touched.tshirtSize && errors.tshirtSize
                        ? "border-red-500 focus:ring-red-500/30"
                        : "border-outline-variant focus:border-secondary focus:ring-secondary/30"
                    }`}
                  >
                    <option value="">Select a size…</option>
                    <option value="XS">XS — Extra Small</option>
                    <option value="S">S — Small</option>
                    <option value="M">M — Medium</option>
                    <option value="L">L — Large</option>
                    <option value="XL">XL — Extra Large</option>
                    <option value="XXL">XXL — Double Extra Large</option>
                  </select>
                  <FieldError name="tshirtSize" />
                </div>

                {/* ── Dietary Requirements ── */}
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-xs"
                    htmlFor="dietaryRequirements"
                  >
                    Dietary Requirements <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="dietaryRequirements"
                    id="dietaryRequirements"
                    value={formData.dietaryRequirements}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder='e.g. Vegetarian, Gluten-free, or "None"'
                    className={`transition-all ${
                      touched.dietaryRequirements && errors.dietaryRequirements
                        ? "border-red-500 focus-visible:ring-red-500/30"
                        : ""
                    }`}
                  />
                  <FieldError name="dietaryRequirements" />
                  <p className="mt-1 text-xs text-on-surface-variant">
                    Write &ldquo;None&rdquo; if you have no dietary
                    requirements.
                  </p>
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center justify-between gap-sm pt-sm border-t border-outline-variant">
                  <Button
                    type="submit"
                    disabled={submitting || userLoading}
                    className="gap-2 text-white font-bold"
                    style={{ background: "hsl(217 91% 60%)" }}
                  >
                    {submitting ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">
                          progress_activity
                        </span>
                        Processing…
                      </>
                    ) : (
                      <>
                        Confirm Registration
                        <span className="material-symbols-outlined text-[18px]">
                          check_circle
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
