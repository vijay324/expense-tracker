import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Security headers
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

// Apply security headers to a response
const applySecurityHeaders = (response: NextResponse) => {
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });
  return response;
};

// Define which routes should be public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

// Protect all routes except public ones
export default clerkMiddleware(async (auth, req) => {
  // If the user is not authenticated and trying to access a protected route,
  // redirect them to the sign-in page
  if (!isPublicRoute(req)) {
    const { userId } = await auth();

    // If not authenticated, redirect to sign-in
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return applySecurityHeaders(NextResponse.redirect(signInUrl));
    }
  }

  // For all routes, add security headers
  return applySecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
