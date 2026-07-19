import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { VerifyUI } from "./VerifyUI";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let message = "";
  let success = false;

  if (!token) {
    message = "No verification token provided.";
  } else {
    // Check if token exists and is valid
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      message = "Invalid or expired verification token.";
    } else if (verificationToken.expires < new Date()) {
      message = "This verification link has expired. Please register again or request a new link.";
      // Clean up expired token
      await prisma.verificationToken.delete({ where: { token } });
    } else {
      // Valid token! Update user
      const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier },
      });

      if (!user) {
        message = "User associated with this token not found.";
      } else if (user.isVerified) {
        message = "Your email is already verified. You can log in.";
        success = true;
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true },
        });
        
        await prisma.verificationToken.delete({ where: { token } });
        
        message = "Your email has been successfully verified! You can now log in.";
        success = true;
      }
    }
  }

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex w-full items-center justify-center p-4">
      <VerifyUI success={success} message={message} />
    </div>
  );
}
