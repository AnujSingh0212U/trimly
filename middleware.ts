import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/about",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/shorten",
  "/api/webhooks(.*)",
  "/api/health",
  "/gone",
  "/gate(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Allow slug redirects (single segment paths that aren't reserved)
  const isSlugRoute =
    /^\/[a-zA-Z0-9_-]+$/.test(pathname) &&
    !pathname.startsWith("/api") &&
    !["/dashboard", "/profile", "/admin", "/sign-in", "/sign-up", "/pricing", "/about"].includes(
      pathname
    );

  if (isSlugRoute) {
    return NextResponse.next();
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  if (isAdminRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
