"use client";

import { motion } from "framer-motion";
import { Link2, MousePointerClick, TrendingUp, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import type { DashboardStats } from "@/types/url";

interface StatsCardsProps {
  stats: DashboardStats;
}

const cards = [
  { key: "totalUrls" as const, label: "Total Links", icon: Link2, color: "text-primary" },
  { key: "totalClicks" as const, label: "Total Clicks", icon: MousePointerClick, color: "text-accent" },
  { key: "clicksToday" as const, label: "Clicks Today", icon: TrendingUp, color: "text-green-500" },
  { key: "activeUrls" as const, label: "Active Links", icon: Globe, color: "text-blue-500" },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(stats[card.key])}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
