"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsStats } from "@/types/url";

async function fetchAnalytics(id: string): Promise<AnalyticsStats> {
  const res = await fetch(`/api/analytics/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
}

export function useAnalytics(urlId: string) {
  return useQuery({
    queryKey: ["analytics", urlId],
    queryFn: () => fetchAnalytics(urlId),
    enabled: !!urlId,
  });
}
