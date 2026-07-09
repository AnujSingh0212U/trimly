import { Header } from "@/components/layout/header";
import { Logo } from "@/components/shared/logo";
import { APP_TAGLINE } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-20">
        <div className="text-center mb-12">
          <Logo size="lg" className="justify-center" />
        </div>
        <h1 className="text-4xl font-bold text-center mb-6">About Trimly</h1>
        <div className="prose prose-neutral dark:prose-invert mx-auto space-y-4 text-muted-foreground">
          <p className="text-lg">{APP_TAGLINE}</p>
          <p>
            Trimly is a modern URL shortening platform built for teams who need more than just short links.
            We provide powerful analytics, QR code generation, password protection, and enterprise-grade security.
          </p>
          <p>
            Built with Next.js, PostgreSQL, and deployed on Vercel for lightning-fast global redirects.
            Every click is tracked with detailed geographic, device, and referrer data.
          </p>
        </div>
      </main>
    </div>
  );
}
