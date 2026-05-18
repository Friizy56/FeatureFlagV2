"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Shield, Zap, Code2, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const handleNotIntegrated = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Not integrated for MVP version");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      {/* Premium Floating Navigation */}
      <div className="fixed top-6 w-full z-50 px-6 flex justify-center pointer-events-none">
        <nav className="w-full max-w-5xl border border-border/40 bg-background/60 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto transition-all hover:border-primary/30 hover:bg-background/80">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                F
              </div>
              <span className="font-black text-lg tracking-tight text-foreground/90">FeatureFlag</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-muted-foreground bg-background/50 px-7 py-2 rounded-lg border border-border/30">
              <Link href="/product" className="hover:text-primary transition-colors cursor-pointer hover:-translate-y-0.5 active:scale-95">Product</Link>
              <Link href="/docs" className="hover:text-primary transition-colors cursor-pointer hover:-translate-y-0.5 active:scale-95">Docs</Link>
              <Link href="/pricing" className="hover:text-primary transition-colors cursor-pointer hover:-translate-y-0.5 active:scale-95">Pricing</Link>
              <Link href="/enterprise" className="hover:text-primary transition-colors cursor-pointer hover:-translate-y-0.5 active:scale-95">Enterprise</Link>
            </div>
            <div className="flex items-center gap-5">
              <button onClick={handleNotIntegrated} className="text-sm font-bold hover:text-primary transition-all hidden md:block cursor-pointer hover:-translate-y-0.5 active:scale-95 text-muted-foreground">
                Sign In
              </button>
              <Link href="/dashboard" className="cursor-pointer">
                <Button size="sm" className="rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer font-bold px-6 bg-primary hover:bg-primary/90 text-white">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Advanced Ambient Aurora Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#030303]">
          {/* Animated Mesh Gradients */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 45, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none mix-blend-screen" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, 100, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
              y: [0, -50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none mix-blend-screen" 
          />

          {/* Perspective Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/dashboard" className="group inline-flex items-center gap-3 px-3 py-1 rounded-full bg-background/90 border border-border/60 text-xs font-semibold hover:border-primary/50 transition-all mb-8 shadow-sm cursor-pointer">
              <span className="px-2 py-0.5 rounded-full bg-primary text-white font-bold text-[10px] tracking-wider uppercase shadow-[0_0_10px_rgba(139,92,246,0.5)]">New</span>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">Introducing Autonomous Rollouts</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-6"
          >
            Deploy instantly. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-primary text-glow">
              Control universally.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            The enterprise feature flag platform built for modern development teams. Manage rollouts, run A/B tests, and safely deploy code at scale.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/dashboard" className="w-full sm:w-auto cursor-pointer">
              <Button size="lg" className="w-full sm:w-auto rounded-lg px-8 h-12 text-base font-bold shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer">
                Start Deploying <ArrowRight className="ml-2 h-4 w-4 inline" />
              </Button>
            </Link>
            <Link href="/docs" className="w-full sm:w-auto cursor-pointer">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-lg px-8 h-12 text-base font-bold border-border/50 hover:bg-muted/50 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer">
                Read Documentation
              </Button>
            </Link>
          </motion.div>

        {/* Unified Hero Dashboard Layout */}
        <div className="w-full max-w-[1400px] mx-auto mt-20 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 relative z-20 px-6">
          
          {/* Left Side Tech Panel (Widescreen only) */}
          <div className="hidden xl:flex flex-col gap-6 w-72 shrink-0 opacity-80 mt-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
              className="p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-green-500 inline" />
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Global Edge Network</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">US-East (N.VA)</span>
                  <span className="text-green-400 font-bold">12ms</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">EU-West (Ireland)</span>
                  <span className="text-green-400 font-bold">18ms</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">AP-South (Mumbai)</span>
                  <span className="text-green-400 font-bold">24ms</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.8 }}
              className="p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-xl"
            >
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Rollout Pipeline</div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] inline-block" />
                  <div className="text-xs font-medium text-muted-foreground inline">Build passing</div>
                </div>
                <div className="w-0.5 h-4 bg-border/50 ml-1 -my-2" />
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] inline-block" />
                  <div className="text-xs font-medium text-muted-foreground inline">Tests passing</div>
                </div>
                <div className="w-0.5 h-4 bg-border/50 ml-1 -my-2" />
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.6)] inline-block" />
                  <div className="text-xs font-bold text-foreground inline">AI evaluating...</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
              className="p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400 inline" />
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider inline">Targeting</div>
                </div>
                <div className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">RULE MATCH</div>
              </div>
              <div className="space-y-3">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
                  <div className="bg-purple-500 h-full w-[15%]" />
                  <div className="bg-blue-500 h-full w-[85%]" />
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Internal Team</span>
                  <span className="text-purple-400 font-bold">15%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Global Traffic</span>
                  <span className="text-blue-400 font-bold">85%</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Clean, Centered Code Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-4xl flex-1 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 to-transparent rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
            
            {/* Animated Conic Border Container */}
            <div className="relative p-[1px] rounded-xl overflow-hidden shadow-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(139,92,246,1)_360deg)] opacity-40"
              />
              
              <div className="relative rounded-xl border border-border/50 bg-card/90 backdrop-blur-2xl overflow-hidden flex flex-col h-full w-full">
                {/* Window Header */}
                <div className="h-12 border-b border-border/50 bg-background/50 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors inline-block" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors inline-block" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors inline-block" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-3 py-1 rounded-md bg-muted/50 border border-border/30 text-[10px] text-muted-foreground font-mono flex items-center gap-2 uppercase tracking-wider font-bold">
                      <Shield className="w-3 h-3 text-primary inline" /> featureflag-client.ts
                    </div>
                  </div>
                </div>
                {/* Code Body */}
                <div className="p-8 text-left font-mono text-sm leading-relaxed overflow-x-auto text-muted-foreground">
                  <p><span className="text-purple-400 font-medium">import</span> {'{ FeatureFlag }'} <span className="text-purple-400 font-medium">from</span> <span className="text-green-400">'@featureflag/sdk'</span>;</p>
                  <p className="mt-4"><span className="text-purple-400 font-medium">const</span> client = <span className="text-purple-400 font-medium">new</span> <span className="text-blue-400 font-medium">FeatureFlag</span>({'{'}</p>
                  <p className="pl-6">environment: <span className="text-green-400">'production'</span>,</p>
                  <p className="pl-6">apiKey: process.env.<span className="text-blue-300">FF_API_KEY</span></p>
                  <p>{'}'});</p>
                  <p className="mt-6"><span className="text-purple-400 font-medium">const</span> isEnabled = <span className="text-purple-400 font-medium">await</span> client.<span className="text-blue-400 font-medium">evaluate</span>(<span className="text-green-400">'new-checkout-flow'</span>, {'{'}</p>
                  <p className="pl-6">userId: <span className="text-green-400">'user_12345'</span>,</p>
                  <p className="pl-6">attributes: {'{'} plan: <span className="text-green-400">'enterprise'</span> {'}'}</p>
                  <p>{'}'});</p>
                  <p className="mt-6"><span className="text-purple-400 font-medium">if</span> (isEnabled) {'{'}</p>
                  <p className="pl-6 text-gray-500 italic">{'// Initialize new checkout experience'}</p>
                  <p className="pl-6"><span className="text-blue-400 font-medium">renderNewCheckout</span>();</p>
                  <p>{'}'} <span className="text-purple-400 font-medium">else</span> {'{'}</p>
                  <p className="pl-6 text-gray-500 italic">{'// Fallback to legacy checkout'}</p>
                  <p className="pl-6"><span className="text-blue-400 font-medium">renderLegacyCheckout</span>();</p>
                  <p>{'}'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side Tech Panel (Widescreen only) */}
          <div className="hidden xl:flex flex-col gap-6 w-72 shrink-0 opacity-80 mt-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
              className="p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500 inline" />
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider inline">Telemetry</div>
                </div>
                <div className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">LIVE</div>
              </div>
              <div className="h-16 flex items-end gap-1.5 mb-3 w-full">
                {[40, 35, 50, 45, 60, 40, 30, 45, 55, 30, 40, 65].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/50 rounded-t-sm hover:bg-blue-400 transition-colors" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground text-right w-full">Metric: P99 Latency</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.8 }}
              className="p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-emerald-500 inline" />
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider inline">Risk Assessment</div>
              </div>
              <div className="text-2xl font-bold text-emerald-500 mb-2 tracking-wide">SAFE</div>
              <div className="text-xs text-muted-foreground leading-relaxed">No anomalies detected in current rollout trajectory. System stable.</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.8 }}
              className="p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-500 inline" />
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider inline">Experiments</div>
                </div>
                <div className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">A/B TEST</div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-foreground">Variant A (Control)</span>
                    <span className="text-muted-foreground">45%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1"><div className="bg-muted-foreground h-full w-[45%]" /></div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-500 font-bold">Variant B (New UI)</span>
                    <span className="text-amber-500 font-bold">55%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1"><div className="bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] h-full w-[55%]" /></div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 border-t border-border/40 bg-muted/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-glow">Built for scale. Designed for speed.</h2>
            <p className="text-muted-foreground text-lg">Everything you need to manage feature flags across your entire infrastructure, from frontend to backend.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Zero Latency",
                desc: "Evaluate flags locally with our edge-optimized SDKs. No network hops required for flag resolution.",
                icon: <Zap className="h-6 w-6 text-primary inline" />,
                delay: 0.1
              },
              {
                title: "Developer First",
                desc: "Type-safe SDKs, comprehensive REST APIs, and native integrations with your favorite frameworks.",
                icon: <Terminal className="h-6 w-6 text-primary inline" />,
                delay: 0.2
              },
              {
                title: "Autonomous Rollouts",
                desc: "Connect your telemetry and let our system automatically halt or accelerate rollouts based on metrics.",
                icon: <Code2 className="h-6 w-6 text-primary inline" />,
                delay: 0.3
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/40 transition-colors shadow-lg backdrop-blur-sm"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/20 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-background text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} FeatureFlag Platform. Built for Enterprise scale.
        </p>
      </footer>
    </div>
  );
}
