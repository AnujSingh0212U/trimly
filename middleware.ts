import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/clerk";

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

const RESERVED_PATHS = new Set([
  "/dashboard",
  "/profile",
  "/admin",
  "/sign-in",
  "/sign-up",
  "/pricing",
  "/about",
  "/settings",
]);

function isSlugRoute(pathname: string): boolean {
  return (
    /^\/[a-zA-Z0-9_-]+$/.test(pathname) &&
    !pathname.startsWith("/api") &&
    !RESERVED_PATHS.has(pathname)
  );
}

function passthroughMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (isSlugRoute(pathname) || isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Auth not configured — allow browsing but block protected API/dashboard server routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, error: { code: "AUTH_NOT_CONFIGURED", message: "Authentication is not configured yet." } },
      { status: 503 }
    );
  }

  return NextResponse.redirect(new URL("/", request.url));
}

const clerkHandler = clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  if (isSlugRoute(pathname)) {
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

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | NextResponse> {
  if (!isClerkConfigured()) {
    return passthroughMiddleware(request);
  }

  try {
    return (await clerkHandler(request, event)) as Response;
  } catch (error) {
    console.error("[middleware] Clerk error:", error);
    return passthroughMiddleware(request);
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
