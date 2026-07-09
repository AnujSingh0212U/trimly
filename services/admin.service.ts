import { userRepository } from "@/repositories/user.repository";
import { urlRepository } from "@/repositories/url.repository";
import { clickRepository } from "@/repositories/click.repository";
import { auditRepository, siteSettingsRepository } from "@/repositories/audit.repository";
import { urlService } from "@/services/url.service";
import type { Prisma } from "@prisma/client";
import type { AdminStats } from "@/types/url";
import { ForbiddenError, NotFoundError } from "@/lib/api/errors";
import type { UserStatus } from "@prisma/client";

export const adminService = {
  async requireAdmin(userId: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user || user.role !== "ADMIN") {
      throw new ForbiddenError("Admin access required");
    }
  },

  async getStats(): Promise<AdminStats> {
    const settings = await siteSettingsRepository.get();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalUrls,
      totalClicks,
      clicksToday,
      activeUsers,
      suspendedUsers,
      clicksGrowth,
    ] = await Promise.all([
      userRepository.count(),
      urlRepository.count(),
      clickRepository.count(),
      clickRepository.countToday(),
      userRepository.count({ status: "ACTIVE" }),
      userRepository.count({ status: "SUSPENDED" }),
      clickRepository.getClicksGrowth(30),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await userRepository.count({
      createdAt: { gte: thirtyDaysAgo },
    });

    const usersGrowth = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split("T")[0] ?? "",
        count: Math.floor(recentUsers / 30),
      };
    });

    return {
      totalUsers,
      totalUrls,
      totalClicks,
      clicksToday,
      activeUsers,
      suspendedUsers,
      revenuePlaceholder: settings.revenuePlaceholder,
      usersGrowth,
      clicksGrowth,
    };
  },

  async listUsers(page: number, limit: number, search?: string) {
    return userRepository.list({ page, limit, search });
  },

  async listUrls(page: number, limit: number, search?: string) {
    const { urls, total } = await urlRepository.adminList({ page, limit, search });
    return {
      urls: urls.map((u) => ({
        ...urlService.toUrlListItem(u),
        userEmail: u.user?.email,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async updateUserStatus(
    adminId: string,
    targetUserId: string,
    action: "suspend" | "unsuspend" | "delete",
    ipAddress?: string
  ): Promise<void> {
    const target = await userRepository.findById(targetUserId);
    if (!target) throw new NotFoundError("User not found");

    if (action === "delete") {
      await userRepository.delete(targetUserId);
    } else {
      const status: UserStatus = action === "suspend" ? "SUSPENDED" : "ACTIVE";
      await userRepository.updateStatus(targetUserId, status);
    }

    await auditRepository.create({
      userId: adminId,
      action: `USER_${action.toUpperCase()}`,
      entityType: "User",
      entityId: targetUserId,
      ipAddress,
    });
  },

  async deleteUrl(adminId: string, urlId: string, ipAddress?: string): Promise<void> {
    await urlService.delete(urlId, adminId, true);
    await auditRepository.create({
      userId: adminId,
      action: "URL_DELETE",
      entityType: "Url",
      entityId: urlId,
      ipAddress,
    });
  },

  async getSettings() {
    return siteSettingsRepository.get();
  },

  async updateSettings(
    adminId: string,
    data: Record<string, unknown>,
    ipAddress?: string
  ) {
    const settings = await siteSettingsRepository.update(data);
    await auditRepository.create({
      userId: adminId,
      action: "SETTINGS_UPDATE",
      entityType: "SiteSettings",
      metadata: data as Prisma.InputJsonValue,
      ipAddress,
    });
    return settings;
  },
};
