"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import { AnalyticsCharts } from "@/components/dashboard/analytics-chart";
import { StatsSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: stats, isLoading } = useAnalytics(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed click analytics for your link.</p>
        </div>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatNumber(stats.totalClicks)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Unique Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatNumber(stats.uniqueClicks)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Returning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatNumber(stats.returningClicks)}</p>
              </CardContent>
            </Card>
          </div>
          <AnalyticsCharts stats={stats} />
        </>
      ) : (
        <p className="text-muted-foreground">No analytics data available.</p>
      )}
    </div>
  );
}
