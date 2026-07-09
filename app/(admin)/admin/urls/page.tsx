"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { UrlListItem } from "@/types/url";

export default function AdminUrlsPage() {
  const [urls, setUrls] = useState<(UrlListItem & { userEmail?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUrls = () => {
    fetch("/api/admin/list?type=urls")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setUrls(json.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUrls(); }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/urls/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!json.success) {
      toast.error(json.error?.message);
      return;
    }
    toast.success("Link deleted");
    fetchUrls();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Links</h1>
      <div className="space-y-3">
        {urls.map((url) => (
          <Card key={url.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="min-w-0">
                <p className="font-mono text-sm text-primary">/{url.slug}</p>
                <p className="text-sm text-muted-foreground truncate">{url.originalUrl}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {url.clickCount} clicks · {url.userEmail ?? "Guest"}
                </p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(url.id)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
