import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth";
import { adminService } from "@/services/admin.service";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10);
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "10", 10);
    const search = request.nextUrl.searchParams.get("search") ?? undefined;
    const type = request.nextUrl.searchParams.get("type") ?? "users";

    if (type === "urls") {
      const result = await adminService.listUrls(page, limit, search);
      return apiSuccess(result.urls, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      });
    }

    const result = await adminService.listUsers(page, limit, search);
    return apiSuccess(result.users, {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (error) {
    return apiError(error);
  }
}
