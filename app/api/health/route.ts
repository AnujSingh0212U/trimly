import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db-health";

export async function GET() {
  const dbOk = await checkDatabaseConnection();
  return NextResponse.json({
    status: dbOk ? "ok" : "degraded",
    service: "trimly",
    database: dbOk ? "connected" : "disconnected",
  });
}
