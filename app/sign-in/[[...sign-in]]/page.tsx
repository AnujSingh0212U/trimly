"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignIn),
  { ssr: false }
);

import { HAS_CLERK } from "@/lib/clerk";

export default function SignInPage() {
  if (!HAS_CLERK) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Sign in unavailable</h1>
        <p className="text-muted-foreground max-w-md">
          Authentication is not configured yet. The site owner needs to add Clerk API keys.
        </p>
        <Button asChild variant="gradient">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <SignIn />
    </div>
  );
}
