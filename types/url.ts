import type { Url, Click, User, DeviceType } from "@prisma/client";

export type UrlWithUser = Url & { user?: User | null };

export interface UrlListItem {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  title: string | null;
  clickCount: number;
  isActive: boolean;
  isCustomSlug: boolean;
  expiresAt: Date | null;
  maxClicks: number | null;
  hasPassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUrlInput {
  originalUrl: string;
  slug?: string;
  title?: string;
  description?: string;
  userId?: string;
  guestSessionId?: string;
  passwordHash?: string;
  expiresAt?: Date;
  maxClicks?: number;
  isCustomSlug?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface UpdateUrlInput {
  originalUrl?: string;
  title?: string | null;
  description?: string | null;
  passwordHash?: string | null;
  expiresAt?: Date | null;
  maxClicks?: number | null;
  isActive?: boolean;
}

export interface UrlSearchParams {
  userId?: string;
  guestSessionId?: string;
  query?: string;
  page: number;
  limit: number;
  sortBy: "createdAt" | "clickCount" | "slug" | "originalUrl";
  sortOrder: "asc" | "desc";
  status: "active" | "inactive" | "expired" | "all";
}

export interface RecordClickInput {
  urlId: string;
  ipAddress?: string;
  userAgent?: string;
  browser?: string;
  os?: string;
  device?: DeviceType;
  country?: string;
  city?: string;
  region?: string;
  referrer?: string;
  language?: string;
  screenSize?: string;
  platform?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  visitorHash?: string;
}

export interface AnalyticsStats {
  totalClicks: number;
  uniqueClicks: number;
  returningClicks: number;
  clicksOverTime: Array<{ date: string; clicks: number; unique: number }>;
  topCountries: Array<{ country: string; clicks: number }>;
  topCities: Array<{ city: string; clicks: number }>;
  topBrowsers: Array<{ browser: string; clicks: number }>;
  topOs: Array<{ os: string; clicks: number }>;
  topDevices: Array<{ device: string; clicks: number }>;
  topReferrers: Array<{ referrer: string; clicks: number }>;
  utmBreakdown: Array<{ source: string; medium: string; campaign: string; clicks: number }>;
}

export interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  clicksToday: number;
  recentUrls: UrlListItem[];
  clicksChart: Array<{ date: string; clicks: number }>;
}

export interface AdminStats {
  totalUsers: number;
  totalUrls: number;
  totalClicks: number;
  clicksToday: number;
  activeUsers: number;
  suspendedUsers: number;
  revenuePlaceholder: number;
  usersGrowth: Array<{ date: string; count: number }>;
  clicksGrowth: Array<{ date: string; clicks: number }>;
}

export interface ProfileData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  bio: string | null;
  website: string | null;
  role: string;
  createdAt: Date;
  urlCount: number;
  totalClicks: number;
}

export type { Url, Click, User };
