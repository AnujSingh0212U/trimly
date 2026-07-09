"use client";

import dynamic from "next/dynamic";

const UserProfile = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserProfile),
  { ssr: false, loading: () => <p className="text-muted-foreground">Loading settings...</p> }
);

import { HAS_CLERK } from "@/lib/clerk";

export default function SettingsPage() {
  if (!HAS_CLERK) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Authentication is not configured yet. Add Clerk keys in your Vercel environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and security.</p>
      </div>
      <UserProfile routing="hash" />
    </div>
  );
}
