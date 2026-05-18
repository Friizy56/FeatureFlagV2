"use client";

import Link from "next/link";
import { ArrowLeft, Box, LayoutGrid, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
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
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tighter mb-6">The Complete Feature Management Platform</h1>
          <p className="text-xl text-muted-foreground">Everything your engineering team needs to safely deploy, manage, and scale features globally.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all">
            <Box className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-3">Targeting Rules</h3>
            <p className="text-muted-foreground">Deliver features to specific user segments based on custom attributes, IP addresses, or subscription tiers.</p>
          </div>
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all">
            <LayoutGrid className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-3">A/B Testing</h3>
            <p className="text-muted-foreground">Run native multivariate tests with built-in statistical significance calculators and metric tracking.</p>
          </div>
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all">
            <Cpu className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-3">Edge SDKs</h3>
            <p className="text-muted-foreground">Zero-latency flag evaluations executed directly at the CDN edge, meaning no impact to your page load times.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
