import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth";
import { adminService } from "@/services/admin.service";
import { getClientIp } from "@/lib/utils";
import { adminUserActionSchema } from "@/lib/validators/url.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { action } = adminUserActionSchema.parse(body);

    await adminService.updateUserStatus(
      admin.id,
      id,
      action,
      getClientIp(request.headers)
    );

    return apiSuccess({ success: true });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    await adminService.updateUserStatus(admin.id, id, "delete");
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
