import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { getAuthUser } from "@/lib/auth";
import { analyticsService } from "@/services/analytics.service";
import { urlRepository } from "@/repositories/url.repository";
import { analyticsQuerySchema } from "@/lib/validators/url.schema";
import { ForbiddenError, NotFoundError } from "@/lib/api/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    const { id } = await params;
    const url = await urlRepository.findById(id);
    if (!url) throw new NotFoundError("URL not found");
    if (url.userId !== user.id && user.role !== "ADMIN") {
      throw new ForbiddenError();
    }

    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = analyticsQuerySchema.parse(queryParams);
    const stats = await analyticsService.getStats(id, query);

    return apiSuccess(stats);
  } catch (error) {
    return apiError(error);
  }
}
