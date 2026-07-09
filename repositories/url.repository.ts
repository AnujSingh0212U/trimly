import type { Url, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UrlSearchParams } from "@/types/url";

export const urlRepository = {
  async findById(id: string): Promise<Url | null> {
    return prisma.url.findUnique({ where: { id } });
  },

  async findBySlug(slug: string): Promise<Url | null> {
    return prisma.url.findUnique({ where: { slug: slug.toLowerCase() } });
  },

  async slugExists(slug: string): Promise<boolean> {
    const count = await prisma.url.count({ where: { slug: slug.toLowerCase() } });
    return count > 0;
  },

  async create(data: Prisma.UrlCreateInput): Promise<Url> {
    return prisma.url.create({ data: { ...data, slug: data.slug.toLowerCase() } });
  },

  async update(id: string, data: Prisma.UrlUpdateInput): Promise<Url> {
    return prisma.url.update({ where: { id }, data });
  },

  async delete(id: string): Promise<void> {
    await prisma.url.delete({ where: { id } });
  },

  async incrementClickCount(id: string): Promise<void> {
    await prisma.url.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  },

  async search(params: UrlSearchParams) {
    const { userId, guestSessionId, query, page, limit, sortBy, sortOrder, status } =
      params;

    const where: Prisma.UrlWhereInput = {};
    if (userId) where.userId = userId;
    if (guestSessionId) where.guestSessionId = guestSessionId;

    if (status === "active") {
      where.isActive = true;
      where.OR = [{ expiresAt: null }, { expiresAt: { gt: new Date() } }];
    } else if (status === "inactive") {
      where.isActive = false;
    } else if (status === "expired") {
      where.expiresAt = { lt: new Date() };
    }

    if (query) {
      const searchConditions: Prisma.UrlWhereInput[] = [
        { slug: { contains: query, mode: "insensitive" } },
        { originalUrl: { contains: query, mode: "insensitive" } },
        { title: { contains: query, mode: "insensitive" } },
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    const [urls, total] = await Promise.all([
      prisma.url.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.url.count({ where }),
    ]);

    return { urls, total };
  },

  async count(where?: Prisma.UrlWhereInput): Promise<number> {
    return prisma.url.count({ where });
  },

  async countByUser(userId: string): Promise<number> {
    return prisma.url.count({ where: { userId } });
  },

  async getTotalClicks(userId?: string): Promise<number> {
    const result = await prisma.url.aggregate({
      where: userId ? { userId } : undefined,
      _sum: { clickCount: true },
    });
    return result._sum.clickCount ?? 0;
  },

  async adminList(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const where: Prisma.UrlWhereInput = search
      ? {
          OR: [
            { slug: { contains: search, mode: "insensitive" } },
            { originalUrl: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [urls, total] = await Promise.all([
      prisma.url.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
      }),
      prisma.url.count({ where }),
    ]);

    return { urls, total };
  },
};
