import { clickRepository } from "@/repositories/click.repository";
import { urlRepository } from "@/repositories/url.repository";
import {
  parseUserAgent,
  parseGeoFromHeaders,
  parseReferrer,
  parseUtmParams,
} from "@/lib/analytics/parser";
import { hashVisitor } from "@/lib/utils";
import type { AnalyticsStats, RecordClickInput } from "@/types/url";
import type { AnalyticsQueryInput } from "@/lib/validators/url.schema";

export const analyticsService = {
  async recordClick(
    urlId: string,
    headers: Headers,
    requestUrl: string
  ): Promise<void> {
    const userAgent = headers.get("user-agent") ?? "";
    const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const parsed = parseUserAgent(userAgent);
    const geo = parseGeoFromHeaders(headers);
    const utm = parseUtmParams(requestUrl);

    const clickData: RecordClickInput = {
      urlId,
      ipAddress: ip,
      userAgent,
      browser: parsed.browser,
      os: parsed.os,
      device: parsed.device,
      platform: parsed.platform,
      country: geo.country,
      city: geo.city,
      region: geo.region,
      referrer: parseReferrer(headers.get("referer")),
      language: headers.get("accept-language")?.split(",")[0]?.trim(),
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      utmTerm: utm.utmTerm,
      utmContent: utm.utmContent,
      visitorHash: hashVisitor(ip, userAgent),
    };

    await clickRepository.create(clickData);
    await urlRepository.incrementClickCount(urlId);
  },

  async getStats(urlId: string, query: AnalyticsQueryInput): Promise<AnalyticsStats> {
    const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ? new Date(query.to) : new Date();

    const [
      totalClicks,
      uniqueClicks,
      clicksOverTime,
      topCountries,
      topCities,
      topBrowsers,
      topOs,
      topDevices,
      topReferrers,
      utmRaw,
    ] = await Promise.all([
      clickRepository.countByUrl(urlId, from, to),
      clickRepository.countUniqueByUrl(urlId, from, to),
      clickRepository.getClicksOverTime(urlId, from, to),
      clickRepository.getTopByField(urlId, "country"),
      clickRepository.getTopByField(urlId, "city"),
      clickRepository.getTopByField(urlId, "browser"),
      clickRepository.getTopByField(urlId, "os"),
      clickRepository.getTopByField(urlId, "device"),
      clickRepository.getTopByField(urlId, "referrer"),
      clickRepository.getUtmBreakdown(urlId),
    ]);

    const returningClicks = totalClicks - uniqueClicks;

    return {
      totalClicks,
      uniqueClicks,
      returningClicks,
      clicksOverTime,
      topCountries: topCountries.map((c) => ({ country: c.name, clicks: c.clicks })),
      topCities: topCities.map((c) => ({ city: c.name, clicks: c.clicks })),
      topBrowsers: topBrowsers.map((c) => ({ browser: c.name, clicks: c.clicks })),
      topOs: topOs.map((c) => ({ os: c.name, clicks: c.clicks })),
      topDevices: topDevices.map((c) => ({ device: c.name, clicks: c.clicks })),
      topReferrers: topReferrers.map((c) => ({ referrer: c.name, clicks: c.clicks })),
      utmBreakdown: utmRaw.map((u) => ({
        source: u.utmSource ?? "direct",
        medium: u.utmMedium ?? "none",
        campaign: u.utmCampaign ?? "none",
        clicks: u._count.id,
      })),
    };
  },
};
