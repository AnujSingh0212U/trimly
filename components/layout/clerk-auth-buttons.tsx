"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function ClerkAuthButtons() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="gradient" size="sm">
            Get Started
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Button asChild variant="gradient" size="sm">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </SignedIn>
    </>
  );
}
