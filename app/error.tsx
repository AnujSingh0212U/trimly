"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo size="lg" />
      <h1 className="mt-8 text-6xl font-bold">500</h1>
      <p className="mt-4 text-lg text-muted-foreground">Something went wrong on our end.</p>
      <div className="mt-8 flex gap-4">
        <Button variant="gradient" onClick={reset}>
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
