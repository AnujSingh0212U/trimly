"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { StatsSkeleton } from "@/components/shared/loading-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AnalyticsOverviewPage() {
  const { data: dashboard, isLoading } = useDashboard();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics Overview</h1>
        <p className="text-muted-foreground">Aggregate analytics across all your links.</p>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : dashboard ? (
        <>
          <StatsCards stats={dashboard} />
          <Card>
            <CardHeader>
              <CardTitle>Clicks (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboard.clicksChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fill: "currentColor" }} />
                  <YAxis tick={{ fill: "currentColor" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="clicks" stroke="#0D9488" fill="#0D948820" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
