import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=No+authorization+code+provided", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return new Response("Missing Google SSO configuration", { status: 500 });
  }

  try {
    // 1. Exchange code for token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token error:", await tokenRes.text());
      return NextResponse.redirect(new URL("/login?error=Failed+to+exchange+token", request.url));
    }

    const tokenData = await tokenRes.json();
    const { access_token } = tokenData;

    // 2. Fetch user profile
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userRes.ok) {
      console.error("Google userinfo error:", await userRes.text());
      return NextResponse.redirect(new URL("/login?error=Failed+to+fetch+user+profile", request.url));
    }

    const userData = await userRes.json();
    const { email, given_name, family_name, name, picture } = userData;

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=Google+account+missing+email", request.url));
    }

    // 3. Find or Create User
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName: given_name || name?.split(" ")[0] || email.split("@")[0],
          lastName: family_name || name?.split(" ").slice(1).join(" ") || null,
          avatarUrl: picture,
          role: Role.STUDENT,
        },
      });
    } else {
      // Update avatar if provided and not already set
      if (picture && !user.avatarUrl) {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: picture },
        });
      }
    }

    // 4. Create session & redirect to dashboard
    await createSession(user.id, user.role);
    
    // Redirect securely (absolute URL to avoid relative path issues)
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err) {
    console.error("Google SSO Callback Error:", err);
    return NextResponse.redirect(new URL("/login?error=Internal+server+error+during+SSO", request.url));
  }
}
