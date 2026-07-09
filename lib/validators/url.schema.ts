import { z } from "zod";
import { MAX_SLUG_LENGTH, MIN_SLUG_LENGTH } from "@/lib/constants";

export const shortenUrlSchema = z.object({
  originalUrl: z.string().min(1, "URL is required").max(2048),
  customSlug: z
    .string()
    .min(MIN_SLUG_LENGTH)
    .max(MAX_SLUG_LENGTH)
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores")
    .optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  password: z.string().min(4).max(100).optional(),
  expiresAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
  maxClicks: z.number().int().min(1).max(1000000).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmTerm: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
});

export const updateUrlSchema = z.object({
  originalUrl: z.string().min(1).max(2048).optional(),
  title: z.string().max(200).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  password: z.string().min(4).max(100).nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  maxClicks: z.number().int().min(1).max(1000000).nullable().optional(),
  isActive: z.boolean().optional(),
});

export const searchUrlSchema = z.object({
  q: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "clickCount", "slug", "originalUrl"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(["active", "inactive", "expired", "all"]).default("all"),
});

export const analyticsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  groupBy: z.enum(["hour", "day", "week", "month"]).default("day"),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().max(200).optional().or(z.literal("")),
});

export const passwordGateSchema = z.object({
  password: z.string().min(1),
});

export const adminUserActionSchema = z.object({
  action: z.enum(["suspend", "unsuspend", "delete"]),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  siteDescription: z.string().max(500).optional(),
  allowGuestShorten: z.boolean().optional(),
  defaultSlugLength: z.number().int().min(4).max(12).optional(),
  maxUrlsPerUser: z.number().int().min(1).max(100000).optional(),
  maintenanceMode: z.boolean().optional(),
  revenuePlaceholder: z.number().min(0).optional(),
});

export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;
export type UpdateUrlInput = z.infer<typeof updateUrlSchema>;
export type SearchUrlInput = z.infer<typeof searchUrlSchema>;
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
