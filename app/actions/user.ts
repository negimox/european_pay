"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().max(50, "Last name too long").optional().or(z.literal("")),
});

export interface UpdateProfileState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
  };

  const parsed = updateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { firstName, lastName } = parsed.data;

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { 
        firstName: firstName.trim(), 
        lastName: lastName ? lastName.trim() : null 
      },
    });
    
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}
