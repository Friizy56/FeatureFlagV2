"use client";

import Link from "next/link";
import { Server, Lock, Network, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnterprisePage() {
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
        <div className="mb-16 max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tighter mb-6">Designed for massive scale and compliance.</h1>
          <p className="text-xl text-muted-foreground">Self-hosted or managed. SOC2 Type II certified. Granular RBAC and SAML SSO for maximum security.</p>
          <div className="mt-8">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">Contact Enterprise Sales</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-xl">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Advanced Security & SSO</h3>
              <p className="text-muted-foreground">Enforce 2FA, configure SAML SSO via Okta or Azure AD, and control exactly who can approve and deploy flags with granular RBAC.</p>
            </div>
          </div>
          
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-xl">
              <Server className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Self-Hosted Options</h3>
              <p className="text-muted-foreground">Deploy the entire FeatureFlag platform on your own infrastructure (AWS, GCP, Azure) via Kubernetes Helm charts for total data residency control.</p>
            </div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-xl">
              <Network className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">VPC Peering</h3>
              <p className="text-muted-foreground">Keep your flag evaluation traffic entirely off the public internet. Connect directly to our AWS environments via PrivateLink.</p>
            </div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-xl">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Dedicated Support SLA</h3>
              <p className="text-muted-foreground">99.99% uptime guarantee with a dedicated Technical Account Manager and 1-hour severity-1 response times.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
