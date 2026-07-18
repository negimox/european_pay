"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RegistrationModalProps {
  event: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  tshirtSize?: string;
  dietaryRequirements?: string;
}

export default function RegistrationModal({
  event,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Prefilled from /api/user/me — locked, user cannot edit
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Editable fields requiring validation
  const [formData, setFormData] = useState({
    tshirtSize: "",
    dietaryRequirements: "",
  });

  // ── Fetch current user profile on mount ──────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setUserProfile({
            firstName: data.user.firstName ?? "",
            lastName: data.user.lastName ?? "",
            email: data.user.email ?? "",
          });
        }
      } catch {
        // Non-critical: form still works without prefill
      } finally {
        setUserLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Field validation ──────────────────────────────────────────────────────
  const validate = (fields = formData): FormErrors => {
    const errs: FormErrors = {};
    if (!fields.tshirtSize) {
      errs.tshirtSize = "Please select a T-Shirt size.";
    }
    if (!fields.dietaryRequirements.trim()) {
      errs.dietaryRequirements =
        'Please enter your dietary requirements (or write "None").';
    }
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    // Re-validate the changed field immediately once it's been touched
    if (touched[e.target.name]) {
      setErrors(validate(updated));
    }
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
    // Mark all fields as touched so errors show on submit attempt
    setTouched({ tshirtSize: true, dietaryRequirements: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}/register`, {
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
        toast.error(data.error || "Registration failed");
      }
    } catch {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  // ── Helper: field error display ───────────────────────────────────────────
  const FieldError = ({ name }: { name: keyof FormErrors }) =>
    touched[name] && errors[name] ? (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
        <span className="material-symbols-outlined text-[14px]">error</span>
        {errors[name]}
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-margin-mobile md:p-margin-desktop backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_8px_16px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row relative min-h-[420px]">
        <button
          onClick={onClose}
          className="absolute top-sm right-sm w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors z-10 select-none"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* ── Left Column: Event Summary ── */}
        <section className="w-full md:w-5/12 bg-surface-container-low p-lg border-b md:border-b-0 md:border-r border-outline-variant flex flex-col gap-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary" />
          <div className="flex-grow">
            <span className="inline-block bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded-full font-label-sm text-label-sm mb-md uppercase tracking-wider">
              Review Registration
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface mb-sm">
              {event.title}
            </h1>
            <div className="flex items-start gap-sm text-on-surface-variant mb-xs">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                calendar_today
              </span>
              <p className="font-body-md text-body-md">
                {new Date(event.startAt).toLocaleDateString()}
                <br />
                Starts at{" "}
                {new Date(event.startAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-start gap-sm text-on-surface-variant">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
              <p className="font-body-md text-body-md">{event.venue}</p>
            </div>
          </div>
          <div className="bg-surface-container p-sm rounded-lg border border-outline-variant mt-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-xs">
              Selected Ticket
            </h3>
            <div className="flex justify-between items-center">
              <p className="font-body-lg text-body-lg text-on-surface font-medium">
                Free Student Pass
              </p>
              <p className="font-body-lg text-body-lg text-on-surface font-medium">
                $0.00
              </p>
            </div>
          </div>
        </section>

        {/* ── Form (always in right column) ── */}
        <section className="w-full md:w-7/12 p-lg flex flex-col relative">
          <h2 className="font-headline-md text-headline-md mb-md">
            Attendee Details
          </h2>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex-grow flex flex-col gap-md"
          >
            {/* ── Prefilled locked user info ── */}
            <div className="rounded-lg border border-outline-variant bg-surface-container p-md flex flex-col gap-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  lock
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Auto-filled from your account — cannot be changed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* First Name */}
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-xs"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      value={userLoading ? "" : userProfile.firstName}
                      readOnly
                      disabled
                      placeholder={userLoading ? "Loading…" : ""}
                      className="pr-9 bg-surface-container-low text-on-surface-variant cursor-not-allowed select-none"
                    />
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant/50">
                      lock
                    </span>
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-xs"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      value={userLoading ? "" : userProfile.lastName}
                      readOnly
                      disabled
                      placeholder={userLoading ? "Loading…" : ""}
                      className="pr-9 bg-surface-container-low text-on-surface-variant cursor-not-allowed select-none"
                    />
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant/50">
                      lock
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
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
                      className="pr-9 bg-surface-container-low text-on-surface-variant cursor-not-allowed select-none"
                    />
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant/50">
                      lock
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-outline-variant" />

            {/* ── T-Shirt Size (required) ── */}
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
                className={`w-full border rounded bg-surface p-sm font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none ${
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

            {/* ── Dietary Requirements (required) ── */}
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
                Write &ldquo;None&rdquo; if you have no dietary requirements.
              </p>
            </div>

            {/* ── Actions ── */}
            <div className="mt-auto pt-lg flex items-center justify-end gap-sm">
              <Button
                variant="ghost"
                onClick={onClose}
                type="button"
                className="select-none"
              >
                Cancel
              </Button>
              <Button
                disabled={loading || userLoading}
                type="submit"
                className="font-label-md text-label-md flex items-center gap-xs select-none"
                style={{ background: "hsl(217 91% 60%)", color: "#fff" }}
              >
                {loading ? (
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
        </section>

        {/* ── Success Overlay — spans the FULL modal (absolute relative to outer div) ── */}
        {success && (
          <div className="absolute inset-0 bg-surface-container-lowest z-20 rounded-xl flex flex-col items-center justify-center p-lg text-center">
            <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-md">
              <span
                className="material-symbols-outlined text-[40px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                task_alt
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg mb-sm">
              You&apos;re all set!
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant w-full mb-lg px-md">
              Your registration for <strong>{event.title}</strong> is confirmed.
              A confirmation will be sent to{" "}
              <strong>{userProfile.email}</strong>.
            </p>
            <Button
              onClick={onSuccess}
              className="select-none"
              style={{ background: "hsl(217 91% 60%)", color: "#fff" }}
            >
              Return to Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
