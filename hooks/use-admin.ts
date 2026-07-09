"use client";

import { useQuery } from "@tanstack/react-query";
import type { AdminStats } from "@/types/url";

async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch("/api/admin");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
  });
}
