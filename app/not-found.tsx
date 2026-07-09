import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo size="lg" />
      <h1 className="mt-8 text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">This page or link doesn&apos;t exist.</p>
      <Button asChild variant="gradient" className="mt-8">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
