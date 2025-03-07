import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes should be public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

// Define which routes should bypass authentication check but still have auth context
const isApiRoute = createRouteMatcher([
  "/api/(.*)", // All API routes
]);

// Protect all routes except public ones
export default clerkMiddleware((auth, request) => {
  // Allow API routes to proceed with auth context but without requiring authentication
  if (isApiRoute(request)) {
    return;
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
