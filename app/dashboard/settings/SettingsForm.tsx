"use client";

import { useActionState, useEffect } from "react";
import { updateProfile, UpdateProfileState } from "@/app/actions/user";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SettingsForm({ 
  initialFirstName, 
  initialLastName,
  email
}: { 
  initialFirstName: string; 
  initialLastName: string | null;
  email: string;
}) {
  const [state, formAction, pending] = useActionState<UpdateProfileState, FormData>(
    updateProfile, 
    {}
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Profile updated successfully");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-on-surface">
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={initialFirstName}
            required
            disabled={pending}
            className="w-full bg-surface-bright border-outline-variant text-on-surface"
          />
          {state.fieldErrors?.firstName && (
            <p className="text-xs text-error">{state.fieldErrors.firstName[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-on-surface">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={initialLastName || ""}
            disabled={pending}
            className="w-full bg-surface-bright border-outline-variant text-on-surface"
          />
          {state.fieldErrors?.lastName && (
            <p className="text-xs text-error">{state.fieldErrors.lastName[0]}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-on-surface">
          Email Address <span className="text-on-surface-variant font-normal text-xs">(Cannot be changed)</span>
        </label>
        <Input
          id="email"
          type="email"
          defaultValue={email}
          disabled
          className="w-full bg-surface-container border-outline-variant/50 text-on-surface-variant cursor-not-allowed opacity-70"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="bg-primary text-on-primary hover:bg-primary/90"
        >
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
