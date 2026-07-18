"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

// ─── Validation Schemas ───────────────────────────────────────────────────────

const signUpSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name too long"),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password too long"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

// ─── Action Result Type ───────────────────────────────────────────────────────

export interface AuthActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email, password } = parsed.data;

  // Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { firstName, lastName, email, passwordHash, role: Role.STUDENT },
  });

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

// ─── Sign In ─────────────────────────────────────────────────────────────────

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  // If user exists but has no password hash, they registered via SSO.
  if (!user.passwordHash) {
    return { error: "This account uses Google SSO. Please sign in with Google." };
  }

  // Use constant-time comparison pattern — don't reveal whether user exists
  if (!(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id, user.role);

  // Redirect based on role
  if (user.role === Role.ADMIN) {
    redirect("/admin");
  }
  redirect("/dashboard");
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
