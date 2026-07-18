import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─── Config ───────────────────────────────────────────────────────────────────

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/admin"];

// Routes that should redirect authenticated users away (login/register)
const AUTH_ROUTES = ["/login", "/register"];

const COOKIE_NAME = "campus_session";

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Verify the session token
  let session: { userId: string; role: string } | null = null;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret, {
        algorithms: ["HS256"],
      });
      session = payload as unknown as { userId: string; role: string };
    } catch {
      // Invalid / expired token — treat as unauthenticated
    }
  }

  const isAuthenticated = !!session;
  const isAdmin = session?.role === "ADMIN";

  // ── Redirect authenticated users away from auth pages ──────────────────────
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const destination = isAdmin ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // ── Protect /dashboard/* — requires authentication ─────────────────────────
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Protect /admin/* — requires ADMIN role ─────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      // Authenticated but not an admin — redirect to student dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public directory files
     * - api routes (handled by route handlers themselves)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|api/).*)",
  ],
};
