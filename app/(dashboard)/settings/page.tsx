"use client";

import dynamic from "next/dynamic";

const UserProfile = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserProfile),
  { ssr: false, loading: () => <p className="text-muted-foreground">Loading settings...</p> }
);

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SettingsPage() {
  if (!hasClerk) {
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
