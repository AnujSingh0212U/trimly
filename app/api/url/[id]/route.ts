import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { getAuthUser } from "@/lib/auth";
import { urlServiceHelpers } from "@/services/url.service";
import { updateUrlSchema } from "@/lib/validators/url.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    const { id } = await params;
    const { urlService } = await import("@/services/url.service");
    const url = await urlService.getById(id);
    const urlRecord = await import("@/repositories/url.repository").then((m) =>
      m.urlRepository.findById(id)
    );
    if (urlRecord && urlRecord.userId !== user.id && user.role !== "ADMIN") {
      const { ForbiddenError } = await import("@/lib/api/errors");
      throw new ForbiddenError();
    }
    return apiSuccess(url);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    const { id } = await params;
    const body = await request.json();
    const input = updateUrlSchema.parse(body);

    const url = await urlServiceHelpers.updateWithPassword(
      id,
      user.id,
      {
        originalUrl: input.originalUrl,
        title: input.title,
        description: input.description,
        password: input.password,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : input.expiresAt === null ? null : undefined,
        maxClicks: input.maxClicks,
        isActive: input.isActive,
      },
      false
    );

    return apiSuccess(url);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    const { id } = await params;
    const { urlService } = await import("@/services/url.service");
    await urlService.delete(id, user.id);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
