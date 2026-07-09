import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Clock } from "lucide-react";

export default function GonePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo size="lg" />
      <Clock className="mt-8 h-16 w-16 text-muted-foreground" />
      <h1 className="mt-4 text-4xl font-bold">Link Expired</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        This link is no longer available. It may have expired or reached its click limit.
      </p>
      <Button asChild variant="gradient" className="mt-8">
        <Link href="/">Create a New Link</Link>
      </Button>
    </div>
  );
}
