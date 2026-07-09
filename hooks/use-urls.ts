"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UrlListItem } from "@/types/url";
import type { SearchUrlInput } from "@/lib/validators/url.schema";
import { toast } from "sonner";

interface UrlListResponse {
  data: UrlListItem[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

async function fetchUrls(params: Partial<SearchUrlInput>): Promise<UrlListResponse> {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params.status) searchParams.set("status", params.status);

  const res = await fetch(`/api/url?${searchParams}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return { data: json.data, meta: json.meta };
}

export function useUrls(params: Partial<SearchUrlInput> = {}) {
  return useQuery({
    queryKey: ["urls", params],
    queryFn: () => fetchUrls(params),
  });
}

export function useDeleteUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/url/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Link deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
