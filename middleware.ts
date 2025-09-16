import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Only check authentication for dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    try {
      const supabase = createMiddlewareClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const redirectUrl = new URL("/signin", req.url);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error("Middleware auth error:", error);
      const redirectUrl = new URL("/signin", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
