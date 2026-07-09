import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["100 links", "Basic analytics", "QR codes", "Guest shortening"],
  },
  {
    name: "Pro",
    price: "$12",
    description: "For power users and marketers",
    features: ["Unlimited links", "Advanced analytics", "Custom domains", "Password protection", "API access"],
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    description: "For teams and organizations",
    features: ["Everything in Pro", "Team management", "SSO", "Priority support", "Audit logs"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "gradient-border ring-2 ring-primary/20" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <p className="text-4xl font-bold mt-4">
                  {plan.price}<span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {f}
                  </div>
                ))}
                <Button asChild variant={plan.popular ? "gradient" : "outline"} className="w-full mt-4">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
