import { NextRequest, NextResponse } from "next/server";
import { qrService } from "@/services/qr.service";
import { getAuthUser } from "@/lib/auth";
import { urlRepository } from "@/repositories/url.repository";
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

    const format = request.nextUrl.searchParams.get("format") ?? "png";
    if (format === "svg") {
      const svg = await qrService.generateSvg(url.slug);
      return new NextResponse(svg, {
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    const png = await qrService.generatePng(url.slug);
    return new NextResponse(new Uint8Array(png), {
      headers: { "Content-Type": "image/png" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
