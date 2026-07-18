import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  
  if (!clientId || !redirectUri) {
    return new Response("Missing Google SSO configuration", { status: 500 });
  }

  const searchParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${searchParams.toString()}`;
  
  redirect(url);
}
