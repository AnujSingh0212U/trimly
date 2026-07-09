"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Sparkles, Check, ExternalLink } from "lucide-react";
import { shortenUrlSchema, type ShortenUrlInput } from "@/lib/validators/url.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";
import { toast } from "sonner";
import type { UrlListItem } from "@/types/url";

interface ShortenFormProps {
  compact?: boolean;
}

export function ShortenForm({ compact = false }: ShortenFormProps) {
  const [result, setResult] = useState<UrlListItem | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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
        toast.error(json.error?.message ?? "Failed to shorten URL");
        return;
      }
      setResult(json.data);
      toast.success("Link created successfully!");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Paste your long URL here..."
              className="h-12 text-base"
              {...register("originalUrl")}
            />
            {errors.originalUrl && (
              <p className="mt-1 text-sm text-destructive">{errors.originalUrl.message}</p>
            )}
          </div>
          <Button type="submit" variant="gradient" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Trimming..." : "Trim Link"}
            <Link2 className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {!compact && (
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="h-3 w-3" />
            {showAdvanced ? "Hide" : "Show"} advanced options
          </button>
        )}

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid gap-4 overflow-hidden sm:grid-cols-2"
            >
              <div>
                <Label htmlFor="customSlug">Custom slug</Label>
                <Input id="customSlug" placeholder="my-link" {...register("customSlug")} />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="My link" {...register("title")} />
              </div>
              <div>
                <Label htmlFor="password">Password protection</Label>
                <Input id="password" type="password" placeholder="Optional" {...register("password")} />
              </div>
              <div>
                <Label htmlFor="expiresAt">Expiration date</Label>
                <Input id="expiresAt" type="datetime-local" {...register("expiresAt")} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <Card className="gradient-border">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-medium text-primary truncate">
                      {result.shortUrl}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{result.originalUrl}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <CopyButton text={result.shortUrl} />
                  <Button variant="ghost" size="icon" asChild>
                    <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
