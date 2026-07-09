import { UAParser } from "ua-parser-js";
import type { DeviceType } from "@prisma/client";

export interface ParsedUserAgent {
  browser: string;
  os: string;
  device: DeviceType;
  platform: string;
}

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  let deviceType: DeviceType = "UNKNOWN";
  if (device.type === "mobile") deviceType = "MOBILE";
  else if (device.type === "tablet") deviceType = "TABLET";
  else if (device.type) deviceType = "DESKTOP";
  else if (/bot|crawl|spider|slurp/i.test(userAgent)) deviceType = "BOT";
  else deviceType = "DESKTOP";

  return {
    browser: browser.name
      ? `${browser.name}${browser.version ? ` ${browser.version.split(".")[0]}` : ""}`
      : "Unknown",
    os: os.name ? `${os.name}${os.version ? ` ${os.version}` : ""}` : "Unknown",
    device: deviceType,
    platform: os.name ?? "Unknown",
  };
}

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export function parseUtmParams(url: string): UtmParams {
  try {
    const parsed = new URL(url);
    return {
      utmSource: parsed.searchParams.get("utm_source") ?? undefined,
      utmMedium: parsed.searchParams.get("utm_medium") ?? undefined,
      utmCampaign: parsed.searchParams.get("utm_campaign") ?? undefined,
      utmTerm: parsed.searchParams.get("utm_term") ?? undefined,
      utmContent: parsed.searchParams.get("utm_content") ?? undefined,
    };
  } catch {
    return {};
  }
}

export function parseReferrer(referrer: string | null): string | undefined {
  if (!referrer) return undefined;
  try {
    const parsed = new URL(referrer);
    return parsed.hostname;
  } catch {
    return referrer;
  }
}

export interface GeoData {
  country?: string;
  city?: string;
  region?: string;
}

export function parseGeoFromHeaders(headers: Headers): GeoData {
  return {
    country: headers.get("x-vercel-ip-country") ?? undefined,
    city: decodeURIComponent(headers.get("x-vercel-ip-city") ?? "") || undefined,
    region: headers.get("x-vercel-ip-country-region") ?? undefined,
  };
}
