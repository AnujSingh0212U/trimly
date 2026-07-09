"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardStats } from "@/types/url";

async function fetchDashboard(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
}
