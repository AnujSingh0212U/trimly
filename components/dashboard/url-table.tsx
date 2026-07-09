"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  ExternalLink,
  MoreHorizontal,
  QrCode,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { formatDate, truncate } from "@/lib/utils";
import { useDeleteUrl } from "@/hooks/use-urls";
import type { UrlListItem } from "@/types/url";

interface UrlTableProps {
  urls: UrlListItem[];
}

export function UrlTable({ urls }: UrlTableProps) {
  const deleteUrl = useDeleteUrl();

  return (
    <div className="space-y-3">
      {urls.map((url, i) => (
        <motion.div
          key={url.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-primary">
                    /{url.slug}
                  </span>
                  {!url.isActive && (
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                      Inactive
                    </span>
                  )}
                  {url.hasPassword && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                      Protected
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground truncate">
                  {truncate(url.originalUrl, 60)}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{url.clickCount} clicks</span>
                  <span>{formatDate(url.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <CopyButton text={url.shortUrl} />
                <Button variant="ghost" size="icon" asChild>
                  <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/${url.id}/analytics`}>
                    <BarChart3 className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/api/qr/${url.id}`} target="_blank" rel="noopener noreferrer">
                    <QrCode className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/${url.id}`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteUrl.mutate(url.id)}
                  disabled={deleteUrl.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
