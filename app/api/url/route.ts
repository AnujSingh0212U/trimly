import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { getAuthUser } from "@/lib/auth";
import { urlService } from "@/services/url.service";
import { searchUrlSchema } from "@/lib/validators/url.schema";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const query = searchUrlSchema.parse(params);

    const result = await urlService.search({
      userId: user.id,
      query: query.q,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      status: query.status,
    });

    return apiSuccess(result.urls, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return apiError(error);
  }
}
