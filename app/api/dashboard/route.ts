import { apiSuccess, apiError } from "@/lib/api/response";
import { getAuthUser } from "@/lib/auth";
import { dashboardService } from "@/services/dashboard.service";

export async function GET() {
  try {
    const user = await getAuthUser();
    const stats = await dashboardService.getStats(user.id);
    return apiSuccess(stats);
  } catch (error) {
    return apiError(error);
  }
}
