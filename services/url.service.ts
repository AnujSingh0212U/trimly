import { urlRepository } from "@/repositories/url.repository";
import { clickRepository } from "@/repositories/click.repository";
import { generateSlug, normalizeSlug, isValidSlugFormat } from "@/lib/slug/generator";
import { isReservedSlug } from "@/lib/slug/reserved";
import { normalizeUrl } from "@/lib/security/sanitize";
import { hashPassword } from "@/lib/security/hash";
import { getShortUrl } from "@/lib/utils";
import {
  ConflictError,
  GoneError,
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "@/lib/api/errors";
import {
  MAX_COLLISION_RETRIES,
  MAX_SLUG_LENGTH,
  MIN_SLUG_LENGTH,
} from "@/lib/constants";
import type {
  CreateUrlInput,
  UpdateUrlInput,
  UrlListItem,
  UrlSearchParams,
} from "@/types/url";
import type { Url } from "@prisma/client";

function toUrlListItem(url: Url): UrlListItem {
  return {
    id: url.id,
    slug: url.slug,
    originalUrl: url.originalUrl,
    shortUrl: getShortUrl(url.slug),
    title: url.title,
    clickCount: url.clickCount,
    isActive: url.isActive,
    isCustomSlug: url.isCustomSlug,
    expiresAt: url.expiresAt,
    maxClicks: url.maxClicks,
    hasPassword: !!url.passwordHash,
    createdAt: url.createdAt,
    updatedAt: url.updatedAt,
  };
}

async function resolveSlug(customSlug?: string): Promise<{ slug: string; isCustom: boolean }> {
  if (customSlug) {
    const slug = normalizeSlug(customSlug);
    if (slug.length < MIN_SLUG_LENGTH || slug.length > MAX_SLUG_LENGTH) {
      throw new ValidationError(
        `Slug must be between ${MIN_SLUG_LENGTH} and ${MAX_SLUG_LENGTH} characters`
      );
    }
    if (!isValidSlugFormat(slug)) {
      throw new ValidationError("Invalid slug format");
    }
    if (isReservedSlug(slug)) {
      throw new ValidationError("This slug is reserved");
    }
    if (await urlRepository.slugExists(slug)) {
      throw new ConflictError("This custom slug is already taken");
    }
    return { slug, isCustom: true };
  }

  for (let i = 0; i < MAX_COLLISION_RETRIES; i++) {
    const slug = generateSlug();
    if (!isReservedSlug(slug) && !(await urlRepository.slugExists(slug))) {
      return { slug, isCustom: false };
    }
  }

  throw new ConflictError("Unable to generate unique slug. Please try again.");
}

function validateUrlAccess(url: Url): void {
  if (!url.isActive) {
    throw new GoneError("This link has been deactivated");
  }
  if (url.expiresAt && url.expiresAt < new Date()) {
    throw new GoneError("This link has expired");
  }
  if (url.maxClicks && url.clickCount >= url.maxClicks) {
    throw new GoneError("This link has reached its maximum click limit");
  }
}

export const urlService = {
  async create(input: CreateUrlInput): Promise<UrlListItem> {
    const originalUrl = normalizeUrl(input.originalUrl);
    const { slug, isCustom } = await resolveSlug(input.slug);

    const url = await urlRepository.create({
      slug,
      originalUrl,
      title: input.title,
      description: input.description,
      isCustomSlug: isCustom,
      passwordHash: input.passwordHash,
      expiresAt: input.expiresAt,
      maxClicks: input.maxClicks,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmTerm: input.utmTerm,
      utmContent: input.utmContent,
      ...(input.userId
        ? { user: { connect: { id: input.userId } } }
        : {}),
      guestSessionId: input.guestSessionId,
    });

    return toUrlListItem(url);
  },

  async getById(id: string): Promise<UrlListItem> {
    const url = await urlRepository.findById(id);
    if (!url) throw new NotFoundError("URL not found");
    return toUrlListItem(url);
  },

  async getBySlug(slug: string): Promise<Url> {
    const url = await urlRepository.findBySlug(slug);
    if (!url) throw new NotFoundError("Short link not found");
    validateUrlAccess(url);
    return url;
  },

  async update(
    id: string,
    userId: string,
    input: UpdateUrlInput,
    isAdmin = false
  ): Promise<UrlListItem> {
    const url = await urlRepository.findById(id);
    if (!url) throw new NotFoundError("URL not found");
    if (!isAdmin && url.userId !== userId) {
      throw new ForbiddenError("You do not have permission to edit this URL");
    }

    const updateData: UpdateUrlInput = { ...input };
    if (input.originalUrl) {
      updateData.originalUrl = normalizeUrl(input.originalUrl);
    }

    const updated = await urlRepository.update(id, updateData);
    return toUrlListItem(updated);
  },

  async delete(id: string, userId: string, isAdmin = false): Promise<void> {
    const url = await urlRepository.findById(id);
    if (!url) throw new NotFoundError("URL not found");
    if (!isAdmin && url.userId !== userId) {
      throw new ForbiddenError("You do not have permission to delete this URL");
    }
    await urlRepository.delete(id);
  },

  async search(params: UrlSearchParams) {
    const { urls, total } = await urlRepository.search(params);
    return {
      urls: urls.map(toUrlListItem),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
    };
  },

  async verifyPassword(url: Url, password: string): Promise<boolean> {
    if (!url.passwordHash) return true;
    const { verifyPassword } = await import("@/lib/security/hash");
    return verifyPassword(password, url.passwordHash);
  },

  toUrlListItem,
};

export const urlServiceHelpers = {
  createWithPassword: async (
    input: CreateUrlInput & { password?: string }
  ): Promise<UrlListItem> => {
    const passwordHash = input.password
      ? await hashPassword(input.password)
      : undefined;
    return urlService.create({ ...input, passwordHash });
  },

  updateWithPassword: async (
    id: string,
    userId: string,
    input: UpdateUrlInput & { password?: string | null },
    isAdmin = false
  ): Promise<UrlListItem> => {
    const updateData: UpdateUrlInput = { ...input };
    if (input.password === null) {
      updateData.passwordHash = null;
    } else if (input.password) {
      updateData.passwordHash = await hashPassword(input.password);
    }
    delete (updateData as { password?: string }).password;
    return urlService.update(id, userId, updateData, isAdmin);
  },
};
