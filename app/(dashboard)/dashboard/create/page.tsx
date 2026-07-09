"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shortenUrlSchema, type ShortenUrlInput } from "@/lib/validators/url.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateLinkPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShortenUrlInput>({
    resolver: zodResolver(shortenUrlSchema),
  });

  const onSubmit = async (data: ShortenUrlInput) => {
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error?.message ?? "Failed to create link");
        return;
      }
      toast.success("Link created!");
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Link</h1>
        <p className="text-muted-foreground">Shorten a URL with custom options.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link Details</CardTitle>
          <CardDescription>Enter the URL you want to shorten.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="originalUrl">Destination URL</Label>
              <Input
                id="originalUrl"
                placeholder="https://example.com/very-long-url"
                {...register("originalUrl")}
              />
              {errors.originalUrl && (
                <p className="mt-1 text-sm text-destructive">{errors.originalUrl.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="customSlug">Custom Slug</Label>
                <Input id="customSlug" placeholder="my-link" {...register("customSlug")} />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="My Link" {...register("title")} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Optional" {...register("password")} />
              </div>
              <div>
                <Label htmlFor="maxClicks">Max Clicks</Label>
                <Input id="maxClicks" type="number" placeholder="Unlimited" {...register("maxClicks", { valueAsNumber: true })} />
              </div>
            </div>

            <div>
              <Label htmlFor="expiresAt">Expiration Date</Label>
              <Input id="expiresAt" type="datetime-local" {...register("expiresAt")} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="gradient" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Link"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
