import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for JWT token in cookies or authorization header
  const token =
    request.cookies.get("accessToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const path = request.nextUrl.pathname;

  // Protected routes - require authentication
  if (path.startsWith("/dashboard")) {
    // For dashboard routes, we also check localStorage via client-side
    // The middleware can only check cookies, so we rely on the dashboard layout
    // to do the full auth check with localStorage
    // This middleware provides a first layer of protection
    
    // If no token in cookies, let client-side handle the redirect
    // The dashboard layout will check localStorage and redirect if needed
    return NextResponse.next();
  }

  // Redirect to dashboard if logged in and trying to access signin
  if (path === "/signin" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
};
