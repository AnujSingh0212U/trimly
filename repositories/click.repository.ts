import type { Click, DeviceType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { RecordClickInput } from "@/types/url";

export const clickRepository = {
  async create(data: RecordClickInput): Promise<Click> {
    return prisma.click.create({
      data: {
        urlId: data.urlId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        browser: data.browser,
        os: data.os,
        device: data.device ?? "UNKNOWN",
        country: data.country,
        city: data.city,
        region: data.region,
        referrer: data.referrer,
        language: data.language,
        screenSize: data.screenSize,
        platform: data.platform,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmTerm: data.utmTerm,
        utmContent: data.utmContent,
        visitorHash: data.visitorHash,
        isUnique: data.visitorHash
          ? !(await this.hasVisited(data.urlId, data.visitorHash))
          : true,
        isReturning: data.visitorHash
          ? await this.hasVisited(data.urlId, data.visitorHash)
          : false,
      },
    });
  },

  async hasVisited(urlId: string, visitorHash: string): Promise<boolean> {
    const count = await prisma.click.count({
      where: { urlId, visitorHash },
    });
    return count > 0;
  },

  async countByUrl(urlId: string, from?: Date, to?: Date): Promise<number> {
    return prisma.click.count({
      where: {
        urlId,
        ...(from || to
          ? {
              createdAt: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
    });
  },

  async countUniqueByUrl(urlId: string, from?: Date, to?: Date): Promise<number> {
    return prisma.click.count({
      where: {
        urlId,
        isUnique: true,
        ...(from || to
          ? {
              createdAt: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
    });
  },

  async getClicksOverTime(
    urlId: string,
    from: Date,
    to: Date
  ): Promise<Array<{ date: string; clicks: number; unique: number }>> {
    const clicks = await prisma.click.findMany({
      where: { urlId, createdAt: { gte: from, lte: to } },
      select: { createdAt: true, isUnique: true },
      orderBy: { createdAt: "asc" },
    });

    const grouped = new Map<string, { clicks: number; unique: number }>();
    for (const click of clicks) {
      const date = click.createdAt.toISOString().split("T")[0] ?? "";
      const existing = grouped.get(date) ?? { clicks: 0, unique: 0 };
      existing.clicks++;
      if (click.isUnique) existing.unique++;
      grouped.set(date, existing);
    }

    return Array.from(grouped.entries()).map(([date, stats]) => ({
      date,
      ...stats,
    }));
  },

  async getTopByField(
    urlId: string,
    field: keyof Pick<Click, "country" | "city" | "browser" | "os" | "referrer" | "device">,
    limit = 10
  ) {
    const clicks = await prisma.click.groupBy({
      by: [field],
      where: { urlId, [field]: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: limit,
    });

    return clicks.map((c) => ({
      name: String(c[field] ?? "Unknown"),
      clicks: c._count.id,
    }));
  },

  async getUtmBreakdown(urlId: string, limit = 10) {
    return prisma.click.groupBy({
      by: ["utmSource", "utmMedium", "utmCampaign"],
      where: { urlId, utmSource: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: limit,
    });
  },

  async countToday(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return prisma.click.count({ where: { createdAt: { gte: startOfDay } } });
  },

  async getClicksGrowth(days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);
    from.setHours(0, 0, 0, 0);

    const clicks = await prisma.click.findMany({
      where: { createdAt: { gte: from } },
      select: { createdAt: true },
    });

    const grouped = new Map<string, number>();
    for (const click of clicks) {
      const date = click.createdAt.toISOString().split("T")[0] ?? "";
      grouped.set(date, (grouped.get(date) ?? 0) + 1);
    }

    return Array.from(grouped.entries()).map(([date, count]) => ({ date, clicks: count }));
  },

  async count(where?: Prisma.ClickWhereInput): Promise<number> {
    return prisma.click.count({ where });
  },
};
