"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RegistrationModalProps {
  event: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegistrationModal({ event, onClose, onSuccess }: RegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "", // User's email should ideally be pre-filled from session, but leaving blank to match design for now
    tshirtSize: "",
    dietaryRequirements: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-margin-mobile md:p-margin-desktop backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_8px_16px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row relative">
        <button onClick={onClose} className="absolute top-sm right-sm w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors z-10">
          <span className="material-symbols-outlined">close</span>
        </button>
        
        {/* Left Column: Event Summary */}
        <section className="w-full md:w-5/12 bg-surface-container-low p-lg border-b md:border-b-0 md:border-r border-outline-variant flex flex-col gap-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"></div>
          <div className="flex-grow">
            <span className="inline-block bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded-full font-label-sm text-label-sm mb-md uppercase tracking-wider">Review Registration</span>
            <h1 className="font-headline-md text-headline-md text-on-surface mb-sm">{event.title}</h1>
            <div className="flex items-start gap-sm text-on-surface-variant mb-xs">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
              <p className="font-body-md text-body-md">
                {new Date(event.date).toLocaleDateString()}<br/>
                Starts at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex items-start gap-sm text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              <p className="font-body-md text-body-md">{event.venue}</p>
            </div>
          </div>
          <div className="bg-surface-container p-sm rounded-lg border border-outline-variant mt-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Selected Ticket</h3>
            <div className="flex justify-between items-center">
              <p className="font-body-lg text-body-lg text-on-surface font-medium">Free Student Pass</p>
              <p className="font-body-lg text-body-lg text-on-surface font-medium">$0.00</p>
            </div>
          </div>
        </section>
        
        {/* Right Column: Form */}
        <section className="w-full md:w-7/12 p-lg flex flex-col relative">
          {!success ? (
            <>
              <h2 className="font-headline-md text-headline-md mb-md">Attendee Details</h2>
              <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="firstName">First Name *</label>
                    <Input name="firstName" value={formData.firstName} onChange={handleChange} id="firstName" required type="text" />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="lastName">Last Name *</label>
                    <Input name="lastName" value={formData.lastName} onChange={handleChange} id="lastName" required type="text" />
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">University Email *</label>
                  <Input name="email" value={formData.email} onChange={handleChange} id="email" required type="email" />
                </div>
                <hr className="border-outline-variant my-xs"/>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="tshirtSize">T-Shirt Size</label>
                  <select name="tshirtSize" value={formData.tshirtSize} onChange={handleChange} className="w-full border border-outline-variant rounded bg-surface p-sm font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all appearance-none" id="tshirtSize">
                    <option value="">Select a size...</option>
                    <option value="s">Small</option>
                    <option value="m">Medium</option>
                    <option value="l">Large</option>
                    <option value="xl">X-Large</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="dietaryRequirements">Dietary Requirements</label>
                  <Input name="dietaryRequirements" value={formData.dietaryRequirements} onChange={handleChange} id="dietaryRequirements" placeholder="e.g., Vegetarian, Gluten-free" type="text"/>
                </div>
                <div className="mt-auto pt-lg flex items-center justify-end gap-sm">
                  <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
                  <Button disabled={loading} type="submit" className="font-label-md text-label-md flex items-center gap-xs">
                    {loading ? "Processing..." : "Confirm Registration"}
                    {!loading && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="absolute inset-0 bg-surface-container-lowest z-20 flex flex-col items-center justify-center p-lg text-center">
              <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-md scale-100 transition-transform duration-500 ease-out">
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg mb-sm">You're all set!</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-lg">
                Your registration for {event.title} is confirmed. A ticket has been sent to {formData.email}.
              </p>
              <div className="flex gap-sm">
                <Button onClick={onSuccess}>Return to Event</Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
