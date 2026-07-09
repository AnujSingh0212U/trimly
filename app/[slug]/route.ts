import { NextRequest, NextResponse } from "next/server";
import { urlService } from "@/services/url.service";
import { analyticsService } from "@/services/analytics.service";
import { GoneError, NotFoundError } from "@/lib/api/errors";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const url = await urlService.getBySlug(slug);

    if (url.passwordHash) {
      const password = request.nextUrl.searchParams.get("password");
      if (!password) {
        const gateUrl = new URL(`/gate/${slug}`, request.url);
        return NextResponse.redirect(gateUrl);
      }
      const valid = await urlService.verifyPassword(url, password);
      if (!valid) {
        const gateUrl = new URL(`/gate/${slug}?error=invalid`, request.url);
        return NextResponse.redirect(gateUrl);
      }
    }

    analyticsService
      .recordClick(url.id, request.headers, request.url)
      .catch(console.error);

    return NextResponse.redirect(url.originalUrl, 302);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
    if (error instanceof GoneError) {
      return NextResponse.redirect(new URL("/gone", request.url));
    }
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
