import { userRepository } from "@/repositories/user.repository";
import { urlRepository } from "@/repositories/url.repository";
import { clickRepository } from "@/repositories/click.repository";
import { urlService } from "@/services/url.service";
import type { DashboardStats, ProfileData } from "@/types/url";
import { NotFoundError } from "@/lib/api/errors";

export const dashboardService = {
  async getStats(userId: string): Promise<DashboardStats> {
    const [totalUrls, totalClicks, activeUrls, clicksToday, recentResult, clicksGrowth] =
      await Promise.all([
        urlRepository.countByUser(userId),
        urlRepository.getTotalClicks(userId),
        urlRepository.count({ userId, isActive: true }),
        clickRepository.count({
          url: { userId },
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }),
        urlRepository.search({
          userId,
          page: 1,
          limit: 5,
          sortBy: "createdAt",
          sortOrder: "desc",
          status: "all",
        }),
        clickRepository.getClicksGrowth(7),
      ]);

    return {
      totalUrls,
      totalClicks,
      activeUrls,
      clicksToday,
      recentUrls: recentResult.urls.map(urlService.toUrlListItem),
      clicksChart: clicksGrowth,
    };
  },

  async getProfile(userId: string): Promise<ProfileData> {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const [urlCount, totalClicks] = await Promise.all([
      urlRepository.countByUser(userId),
      urlRepository.getTotalClicks(userId),
    ]);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      bio: user.bio,
      website: user.website,
      role: user.role,
      createdAt: user.createdAt,
      urlCount,
      totalClicks,
    };
  },

  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; bio?: string; website?: string }
  ): Promise<ProfileData> {
    await userRepository.update(userId, data);
    return this.getProfile(userId);
  },
};
