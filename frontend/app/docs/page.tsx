"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, AlertTriangle, ShieldCheck, Zap, Server, Code, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DocsPage() {
  const router = useRouter();
  const [understood, setUnderstood] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">F</div>
              <span className="font-bold text-lg tracking-tight">FeatureFlag</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              size="sm" 
              className="rounded-full shadow-md transition-all"
              disabled={!understood}
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-32 max-w-4xl mx-auto px-6">
        <div className="mb-12 border-b border-border/50 pb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">Platform Documentation</h1>
          <p className="text-xl text-muted-foreground">A comprehensive guide to Feature Flags, CI/CD boundaries, and Autonomous Deployment Safety.</p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none space-y-16">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-primary text-glow">
              <BookOpen className="h-8 w-8" /> What is a Feature Flag?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A <strong>Feature Flag</strong> (or Feature Toggle) is a software development technique that allows teams to turn certain functionality on and off during runtime, without deploying new code. Instead of waiting for a massive release, developers wrap new features in conditional statements controlled by an external dashboard.
            </p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">Example 1: UI Rollout</h3>
            <p className="text-sm text-muted-foreground mb-4">Gradually exposing a new checkout button to users to ensure it converts better without breaking.</p>
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 font-mono text-sm text-muted-foreground shadow-inner">
              <p><span className="text-purple-400">if</span> (featureFlags.isEnabled(<span className="text-green-400">'new-checkout-ui'</span>)) {'{'}</p>
              <p className="pl-4 text-blue-400">renderNewCheckout();</p>
              <p>{'}'} <span className="text-purple-400">else</span> {'{'}</p>
              <p className="pl-4 text-blue-400">renderLegacyCheckout();</p>
              <p>{'}'}</p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Example 2: Database Migration</h3>
            <p className="text-sm text-muted-foreground mb-4">Testing a new database indexing strategy. You can enable it for 5% of background jobs to monitor latency before a full rollout.</p>
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 font-mono text-sm text-muted-foreground shadow-inner">
              <p><span className="text-purple-400">if</span> (featureFlags.isEnabled(<span className="text-green-400">'use-new-postgres-index'</span>)) {'{'}</p>
              <p className="pl-4 text-blue-400">results = await db.queryNewIndex();</p>
              <p>{'}'} <span className="text-purple-400">else</span> {'{'}</p>
              <p className="pl-4 text-blue-400">results = await db.queryLegacyIndex();</p>
              <p>{'}'}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <ShieldCheck className="h-8 w-8" /> Feature Flags vs. CI/CD
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Many teams confuse CI/CD (Continuous Integration / Continuous Deployment) with Feature Flagging. They are distinct concepts that operate at different boundaries:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-card/50 border border-border/50 rounded-xl p-6 shadow-md hover:border-border transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Server className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">CI/CD = Deployment</h3>
                <p className="text-sm text-muted-foreground">The process of moving code from a developer's machine to the production server. The code is physically running in production, but users may not see it yet.</p>
              </div>
              <div className="bg-card/50 border border-blue-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(59,130,246,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
                  <Code className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-blue-400">Feature Flags = Release</h3>
                <p className="text-sm text-muted-foreground">The business decision to expose that deployed code to actual users. Flags separate deployment from release, allowing you to test code in production silently.</p>
              </div>
            </div>
            <div className="bg-blue-500/5 border-l-4 border-blue-500 p-4 mt-6 rounded-r-lg">
              <p className="text-muted-foreground leading-relaxed text-sm">
                <strong>Rule of Thumb:</strong> Feature flags happen <strong>AFTER</strong> the CI/CD pipeline finishes. Your pipeline ships the binary; the feature flag platform orchestrates the user experience dynamically.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              <AlertTriangle className="h-8 w-8" /> The Knight Capital Incident
            </h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
              <p className="text-red-200 leading-relaxed font-medium text-lg">
                In 2012, Knight Capital Group (a massive global financial firm) deployed new trading software to production without proper feature flagging or phased rollouts.
              </p>
              <ul className="mt-6 space-y-4 text-red-200/80 list-none">
                <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>An obsolete piece of code called "Power Peg" was accidentally activated.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>Because they had no rapid kill-switch (feature flag), they could not turn off the broken logic without rolling back entire server clusters manually.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>In just 45 minutes, the rogue algorithm executed millions of trades, resulting in a staggering loss of <strong className="text-red-400 text-xl">$460 million</strong>.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>The company went bankrupt shortly after.</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-red-500/20">
                <p className="text-red-400 font-bold uppercase tracking-widest text-center">
                  Lesson: Never deploy global changes without a kill switch.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
              <Zap className="h-8 w-8" /> Autonomous AI Rollouts
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform takes feature flags a step further by implementing <strong>Autonomous AI Telemetry</strong>. Instead of a human manually moving a slider from 10% to 100%, our system uses a Reinforcement Learning Agent (PPO-Master) to monitor live application health.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-card/30 border border-border/50 rounded-xl p-6 text-center">
                <div className="text-xl font-bold mb-2">1. Monitor</div>
                <p className="text-xs text-muted-foreground">The AI constantly ingests metrics like P99 latency and error rates.</p>
              </div>
              <div className="bg-card/30 border border-border/50 rounded-xl p-6 text-center">
                <div className="text-xl font-bold mb-2 text-green-400">2. Accelerate</div>
                <p className="text-xs text-muted-foreground">If systems are healthy, the AI increases the flag rollout percentage safely.</p>
              </div>
              <div className="bg-card/30 border border-border/50 rounded-xl p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-red-500/5" />
                <div className="text-xl font-bold mb-2 text-red-400 relative z-10">3. Intervene</div>
                <p className="text-xs text-muted-foreground relative z-10">If errors spike, the AI instantly executes a ROLLBACK action to 0%.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-3xl font-bold border-b border-border/50 pb-4 mb-6">
              How to Run the System
            </h2>
            <p className="text-muted-foreground mb-8">Follow these exact steps to start the complete full-stack environment locally.</p>
            
            <div className="space-y-8">
              {/* Backend Steps */}
              <div className="relative">
                <div className="absolute -left-10 top-0 bottom-0 w-px bg-border/50" />
                <div className="absolute -left-11 top-1 w-3 h-3 rounded-full bg-primary" />
                <h3 className="font-bold text-xl mb-4">Step 1: Start the Python Backend</h3>
                <p className="text-sm text-muted-foreground mb-4">The FastAPI backend houses the Reinforcement Learning simulation, telemetry endpoints, and the API.</p>
                <div className="bg-background rounded-xl p-6 font-mono text-sm border border-border/50 text-muted-foreground shadow-inner">
                  <p className="text-gray-500 mb-2"># Navigate to the backend directory</p>
                  <p className="text-white mb-4">cd backend</p>
                  
                  <p className="text-gray-500 mb-2"># Create and activate a virtual environment</p>
                  <p className="text-white mb-1">python -m venv venv</p>
                  <p className="text-gray-500 mb-1"># For Mac/Linux:</p>
                  <p className="text-white mb-1">source venv/bin/activate</p>
                  <p className="text-gray-500 mb-1"># For Windows:</p>
                  <p className="text-white mb-4">.\venv\Scripts\activate</p>
                  
                  <p className="text-gray-500 mb-2"># Install dependencies</p>
                  <p className="text-white mb-4">pip install -r requirements.txt</p>
                  
                  <p className="text-gray-500 mb-2"># Start the server (runs on port 8000)</p>
                  <p className="text-white text-green-400">python src/main.py</p>
                </div>
              </div>

              {/* Frontend Steps */}
              <div className="relative mt-12">
                <div className="absolute -left-10 top-0 bottom-0 w-px bg-border/50" />
                <div className="absolute -left-11 top-1 w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="font-bold text-xl mb-4">Step 2: Start the Next.js Frontend</h3>
                <p className="text-sm text-muted-foreground mb-4">The Next.js application serves the user interface and interacts with the FastAPI backend.</p>
                <div className="bg-background rounded-xl p-6 font-mono text-sm border border-border/50 text-muted-foreground shadow-inner">
                  <p className="text-gray-500 mb-2"># Open a NEW terminal tab and navigate to frontend</p>
                  <p className="text-white mb-4">cd frontend</p>
                  
                  <p className="text-gray-500 mb-2"># Install Node modules</p>
                  <p className="text-white mb-4">npm install</p>
                  
                  <p className="text-gray-500 mb-2"># Configure Environment</p>
                  <p className="text-gray-500 mb-1"># Ensure your .env.local contains the following:</p>
                  <p className="text-white mb-4">NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000</p>
                  
                  <p className="text-gray-500 mb-2"># Start the development server</p>
                  <p className="text-white text-green-400">npm run dev</p>
                </div>
              </div>
            </div>
          </section>

          {/* Acknowledgement Checkbox */}
          <section className="pt-8 border-t border-border/50">
            <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="relative flex items-center justify-center mt-1">
                  <input 
                    type="checkbox" 
                    id="understand" 
                    className="peer appearance-none w-6 h-6 border-2 border-primary rounded-md bg-background checked:bg-primary transition-colors cursor-pointer"
                    checked={understood}
                    onChange={(e) => setUnderstood(e.target.checked)}
                  />
                  <svg className="absolute w-4 h-4 text-primary-foreground pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <label htmlFor="understand" className="text-xl font-bold cursor-pointer select-none text-foreground block mb-2">
                    I have read and understood the documentation.
                  </label>
                  <p className="text-sm text-muted-foreground">
                    I comprehend the risks of deploying without feature flags, the difference between CI/CD and Release, and I know how to start the local environment.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button 
                  size="lg" 
                  className={`rounded-full px-8 h-12 text-base font-bold transition-all duration-300 ${
                    understood 
                      ? "shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105" 
                      : "opacity-50 cursor-not-allowed grayscale"
                  }`}
                  disabled={!understood}
                  onClick={() => router.push("/dashboard")}
                >
                  Proceed to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
