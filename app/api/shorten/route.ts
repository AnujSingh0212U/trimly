import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { shortenUrlSchema } from "@/lib/validators/url.schema";
import { urlServiceHelpers } from "@/services/url.service";
import { getOptionalAuthUser } from "@/lib/auth";
import { guestRateLimit, authRateLimit, checkRateLimit } from "@/lib/redis";
import { RateLimitError } from "@/lib/api/errors";
import { getClientIp } from "@/lib/utils";
import { GUEST_SESSION_COOKIE, GUEST_SESSION_MAX_AGE } from "@/lib/constants";
import { nanoid } from "nanoid";
import { siteSettingsRepository } from "@/repositories/audit.repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = shortenUrlSchema.parse(body);
    const user = await getOptionalAuthUser();
    const ip = getClientIp(request.headers);

    const limiter = user ? authRateLimit : guestRateLimit;
    const identifier = user ? user.id : ip;
    const rateCheck = await checkRateLimit(limiter, identifier);
    if (!rateCheck.success) throw new RateLimitError();

    if (!user) {
      const settings = await siteSettingsRepository.get();
      if (!settings.allowGuestShorten) {
        throw new RateLimitError("Guest shortening is disabled. Please sign in.");
      }
    }

    let guestSessionId: string | undefined;
    const responseHeaders: HeadersInit = {};

    if (!user) {
      guestSessionId = request.cookies.get(GUEST_SESSION_COOKIE)?.value ?? nanoid();
      responseHeaders["Set-Cookie"] = `${GUEST_SESSION_COOKIE}=${guestSessionId}; Path=/; Max-Age=${GUEST_SESSION_MAX_AGE}; HttpOnly; SameSite=Lax`;
    }

    const url = await urlServiceHelpers.createWithPassword({
      originalUrl: input.originalUrl,
      slug: input.customSlug,
      title: input.title,
      description: input.description,
      password: input.password,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      maxClicks: input.maxClicks,
      userId: user?.id,
      guestSessionId,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmTerm: input.utmTerm,
      utmContent: input.utmContent,
    });

    const response = apiSuccess(url, undefined, 201);
    Object.entries(responseHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
