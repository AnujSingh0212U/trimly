"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Link2,
  QrCode,
  Shield,
  Zap,
  Globe,
  Lock,
  Clock,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { ShortenForm } from "@/components/marketing/shorten-form";
import { Logo } from "@/components/shared/logo";
import { APP_TAGLINE } from "@/lib/constants";

const features = [
  {
    icon: Link2,
    title: "Custom Short Links",
    description: "Create branded short URLs with custom aliases that reflect your brand.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Track clicks, geography, devices, browsers, referrers, and UTM parameters.",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Instantly generate QR codes for any shortened link.",
  },
  {
    icon: Shield,
    title: "Password Protection",
    description: "Secure sensitive links with password protection.",
  },
  {
    icon: Clock,
    title: "Link Expiration",
    description: "Set expiration dates and click limits on your links.",
  },
  {
    icon: Globe,
    title: "Geo Tracking",
    description: "See where your audience is coming from with country and city data.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Rate limiting, CSRF protection, and encrypted password storage.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-50ms redirects powered by global edge infrastructure.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="relative overflow-hidden px-4 py-20 sm:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 flex justify-center">
                <Logo size="lg" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                Trim your links.
                <br />
                <span className="gradient-text">Track everything.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                {APP_TAGLINE} Create short links, generate QR codes, and get powerful analytics — all in one beautiful dashboard.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-10"
            >
              <ShortenForm />
            </motion.div>
          </div>
        </section>

        <section id="features" className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Everything you need to <span className="gradient-text">manage links</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Powerful features designed for marketers, developers, and teams.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass group rounded-xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Trimly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
