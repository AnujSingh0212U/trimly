"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
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
        </div>
      </div>
    </header>
  );
}
