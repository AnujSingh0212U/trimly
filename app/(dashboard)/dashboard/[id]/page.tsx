"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";
import { toast } from "sonner";
import type { UrlListItem } from "@/types/url";

export default function EditUrlPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [url, setUrl] = useState<UrlListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/url/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setUrl(json.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/url/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: form.get("originalUrl"),
          title: form.get("title") || null,
          isActive: form.get("isActive") === "on",
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error?.message);
        return;
      }
      toast.success("Link updated!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!url) return <p className="text-destructive">Link not found</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Link</h1>
          <p className="font-mono text-sm text-primary">/{url.slug}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{url.shortUrl}</span>
            <CopyButton text={url.shortUrl} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="originalUrl">Destination URL</Label>
              <Input id="originalUrl" name="originalUrl" defaultValue={url.originalUrl} />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={url.title ?? ""} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" name="isActive" defaultChecked={url.isActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <Button type="submit" variant="gradient" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
