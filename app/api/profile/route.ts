import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { getAuthUser } from "@/lib/auth";
import { dashboardService } from "@/services/dashboard.service";
import { profileUpdateSchema } from "@/lib/validators/url.schema";

export async function GET() {
  try {
    const user = await getAuthUser();
    const profile = await dashboardService.getProfile(user.id);
    return apiSuccess(profile);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();
    const body = await request.json();
    const input = profileUpdateSchema.parse(body);
    const profile = await dashboardService.updateProfile(user.id, input);
    return apiSuccess(profile);
  } catch (error) {
    return apiError(error);
  }
}
