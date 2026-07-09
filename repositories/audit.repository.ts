import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const auditRepository = {
  async create(data: {
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Prisma.InputJsonValue;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.auditLog.create({ data });
  },

  async list(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true } } },
      }),
      prisma.auditLog.count(),
    ]);
    return { logs, total };
  },
};

export const siteSettingsRepository = {
  async get() {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "default" } });
    }
    return settings;
  },

  async update(data: Prisma.SiteSettingsUpdateInput) {
    return prisma.siteSettings.upsert({
      where: { id: "default" },
      create: { id: "default" },
      update: data,
    });
  },
};
