"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">F</div>
              <span className="font-bold text-lg tracking-tight">FeatureFlag</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button size="sm" className="rounded-full shadow-md">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground">Start for free, scale when you need to.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-card/50 border border-border/50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-muted-foreground text-sm mb-6">For small teams and side projects.</p>
            <div className="mb-6"><span className="text-4xl font-bold">$0</span> <span className="text-muted-foreground">/mo</span></div>
            <Button className="w-full mb-8 rounded-full" variant="outline">Get Started</Button>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> Up to 50,000 requests/mo</li>
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> 2 Team Members</li>
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> Basic targeting</li>
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-primary/5 border border-primary/30 shadow-2xl shadow-primary/10 rounded-3xl p-8 relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
            <h3 className="text-2xl font-bold mb-2">Professional</h3>
            <p className="text-muted-foreground text-sm mb-6">For scaling startups and companies.</p>
            <div className="mb-6"><span className="text-4xl font-bold">$99</span> <span className="text-muted-foreground">/mo</span></div>
            <Button className="w-full mb-8 rounded-full shadow-lg shadow-primary/20">Start Free Trial</Button>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> 5,000,000 requests/mo</li>
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> Unlimited Team Members</li>
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> Advanced Segmentation</li>
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> Datadog Integration</li>
            </ul>
          </div>

          {/* Enterprise */}
          <div className="bg-card/50 border border-border/50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-muted-foreground text-sm mb-6">For mission-critical global infrastructure.</p>
            <div className="mb-6"><span className="text-4xl font-bold">Custom</span></div>
            <Button className="w-full mb-8 rounded-full" variant="outline">Contact Sales</Button>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> Unlimited requests</li>
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> SAML / SSO</li>
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> Custom SLA</li>
              <li className="flex gap-3"><Check className="text-green-500 w-5 h-5" /> Autonomous AI Agents</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
