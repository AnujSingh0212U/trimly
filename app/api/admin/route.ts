import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth";
import { adminService } from "@/services/admin.service";
import { getClientIp } from "@/lib/utils";
import { siteSettingsSchema } from "@/lib/validators/url.schema";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await adminService.getStats();
    return apiSuccess(stats);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const input = siteSettingsSchema.parse(body);
    const settings = await adminService.updateSettings(
      admin.id,
      input,
      getClientIp(request.headers)
    );
    return apiSuccess(settings);
  } catch (error) {
    return apiError(error);
  }
}
