"use client";

import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

function AlertContent({ serverError }: { serverError?: string }) {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const error = serverError || urlError;

  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-6 bg-red-950/20 border-red-500/50 text-red-200">
      <AlertCircle className="h-4 w-4" color="#f87171" />
      <AlertTitle className="text-red-400">Authentication Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

export function AuthAlert({ serverError }: { serverError?: string }) {
  return (
    <Suspense fallback={null}>
      <AlertContent serverError={serverError} />
    </Suspense>
  );
}
