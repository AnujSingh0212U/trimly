"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import { useUrls } from "@/hooks/use-urls";
import { useDebounce } from "@/hooks/use-debounce";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UrlTable } from "@/components/dashboard/url-table";
import { StatsSkeleton, TableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2 } from "lucide-react";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { data: dashboard, isLoading: dashLoading } = useDashboard();
  const { data: urlsData, isLoading: urlsLoading } = useUrls({
    q: debouncedSearch || undefined,
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    status: "all",
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your shortened links.</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/dashboard/create">
            <Plus className="h-4 w-4" />
            Create Link
          </Link>
        </Button>
      </div>

      {dashLoading ? <StatsSkeleton /> : dashboard && <StatsCards stats={dashboard} />}

      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {urlsLoading ? (
          <TableSkeleton />
        ) : urlsData?.data.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="No links yet"
            description="Create your first shortened link to get started."
            action={{ label: "Create Link", href: "/dashboard/create" }}
          />
        ) : (
          urlsData && <UrlTable urls={urlsData.data} />
        )}
      </div>
    </div>
  );
}
