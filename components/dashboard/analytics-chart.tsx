"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsStats } from "@/types/url";

interface AnalyticsChartsProps {
  stats: AnalyticsStats;
}

export function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.clicksOverTime}>
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fill: "currentColor" }} />
              <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#0D9488"
                fill="url(#clickGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.topCountries.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: "currentColor" }} />
              <YAxis dataKey="country" type="category" width={60} tick={{ fill: "currentColor" }} />
              <Tooltip />
              <Bar dataKey="clicks" fill="#7C3AED" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topDevices.map((d) => (
              <div key={d.device} className="flex items-center justify-between">
                <span className="text-sm capitalize">{d.device.toLowerCase()}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-primary" style={{
                    width: `${Math.max(20, (d.clicks / (stats.totalClicks || 1)) * 200)}px`,
                  }} />
                  <span className="text-sm font-medium">{d.clicks}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Browsers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topBrowsers.slice(0, 6).map((b) => (
              <div key={b.browser} className="flex items-center justify-between text-sm">
                <span>{b.browser}</span>
                <span className="font-medium">{b.clicks}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topReferrers.slice(0, 6).map((r) => (
              <div key={r.referrer} className="flex items-center justify-between text-sm">
                <span className="truncate">{r.referrer}</span>
                <span className="font-medium ml-2">{r.clicks}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
