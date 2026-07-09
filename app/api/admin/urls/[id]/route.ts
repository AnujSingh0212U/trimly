import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth";
import { adminService } from "@/services/admin.service";
import { getClientIp } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    await adminService.deleteUrl(admin.id, id, getClientIp(request.headers));
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
