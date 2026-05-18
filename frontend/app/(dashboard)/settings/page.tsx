"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  Globe, 
  Webhook, 
  Save, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ExternalLink,
  Sliders
} from "lucide-react";
import { api } from "@/lib/api";
import * as React from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [apiKey, setApiKey] = React.useState(() => api.getApiKey() || "");
  const [apiBaseUrl, setApiBaseUrl] = React.useState(() => api.getApiBaseUrl() || "");
  const [status, setStatus] = React.useState<string>("");
  const [statusType, setStatusType] = React.useState<"success" | "error" | "info">("info");

  const handleSaveKey = () => {
    api.setApiKey(apiKey);
    setStatus("API key saved successfully.");
    setStatusType("success");
  };

  const handleSaveBaseUrl = () => {
    if (!apiBaseUrl.trim()) {
      setStatus("API base URL cannot be empty.");
      setStatusType("error");
      return;
    }
    api.setApiBaseUrl(apiBaseUrl);
    setStatus("API base URL saved successfully.");
    setStatusType("success");
  };

  const handleTestConnection = async () => {
    setStatus("Testing backend connection link...");
    setStatusType("info");
    try {
      const health = await api.getHealth();
      const ready = health?.environment_ready ? "ready" : "not ready";
      setStatus(`Backend connected successfully (${health?.status || "healthy"}, environment ${ready}).`);
      setStatusType("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Connection failed";
      setStatus(`Connection failed: ${message}`);
      setStatusType("error");
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto font-sans relative">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/30 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground">Governance</span>
            <span className="text-border">/</span>
            <span className="text-primary">Configuration</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-foreground via-purple-600 to-indigo-600 dark:from-white dark:via-purple-200 dark:to-indigo-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]">
            Platform Settings
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            Manage infrastructure authentication, multi-stage environments, and global security policies.
          </p>
        </div>

        {status && (
          <div className={cn(
            "rounded-full px-6 py-4 text-xs font-black uppercase tracking-widest shadow-lg animate-in fade-in-50 duration-300 flex items-center gap-2.5 backdrop-blur-xl border border-border/40",
            statusType === "success" ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]" :
            statusType === "error" ? "bg-destructive/10 text-destructive border-destructive/30 shadow-[0_0_20px_rgba(220,38,38,0.2)]" :
            "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          )}>
            {statusType === "success" && <CheckCircle2 className="w-4 h-4 text-green-400 animate-pulse inline" />}
            {statusType === "error" && <AlertTriangle className="w-4 h-4 text-destructive animate-pulse inline" />}
            {statusType === "info" && <Shield className="w-4 h-4 text-blue-400 animate-pulse inline" />}
            {status}
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-12 relative z-10">
        <div className="md:col-span-8 space-y-8">
          {/* API Keys & Security Card */}
          <Card className="glassy-card bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-xl overflow-hidden group">
            <CardHeader className="pb-6 border-b border-border/20 bg-background/30 p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2.5 text-foreground">
                  <Key className="h-5 w-5 text-primary animate-pulse" /> 
                  API Authentication & Security
                </CardTitle>
                <CardDescription className="text-xs font-semibold mt-1 text-muted-foreground/90">
                  Manage authentication keys for infrastructure access and simulation endpoints. Keep these secure.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/40 px-3 py-1 text-[10px] font-mono uppercase tracking-widest shadow-sm">
                <Lock className="w-2.5 h-2.5 mr-1.5 inline animate-pulse" /> AES-256 SECURED
              </Badge>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-3 p-6 rounded-2xl bg-background/60 border border-border/40 shadow-inner group-hover:border-primary/30 transition-colors">
                <Label htmlFor="backend-key" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-primary" /> Backend Simulation Key (X-API-Key)
                </Label>
                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <Input 
                    id="backend-key" 
                    type="password"
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="ff_live_..."
                    className="font-mono text-base py-6 bg-background/80 border-border/60 focus-visible:ring-primary/50 flex-1 shadow-sm rounded-xl" 
                  />
                  <Button size="lg" className="px-8 py-6 text-sm font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all duration-300 rounded-xl" onClick={handleSaveKey}>
                    <Save className="mr-2 h-4 w-4" /> Save Key
                  </Button>
                </div>
                <p className="text-xs font-medium text-muted-foreground pt-1 leading-relaxed">Used for all simulation and monitoring API calls. Requires a valid token matching backend environment variables.</p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl bg-background/60 border border-border/40 shadow-inner group-hover:border-primary/30 transition-colors">
                <Label htmlFor="api-base-url" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400" /> Frontend API Target Endpoint
                </Label>
                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <Input
                    id="api-base-url"
                    value={apiBaseUrl}
                    onChange={(e) => setApiBaseUrl(e.target.value)}
                    placeholder="http://127.0.0.1:8000"
                    className="font-mono text-base py-6 bg-background/80 border-border/60 focus-visible:ring-primary/50 flex-1 shadow-sm rounded-xl"
                  />
                  <Button variant="outline" size="lg" className="px-7 py-6 text-sm font-extrabold border-primary/50 text-primary hover:bg-primary/10 transition-all shadow-md rounded-xl hover:scale-105" onClick={handleSaveBaseUrl}>
                    Save URL
                  </Button>
                  <Button variant="outline" size="lg" className="px-7 py-6 text-sm font-extrabold transition-all shadow-md rounded-xl bg-background/60 hover:bg-background border-border/60 hover:border-primary/50 hover:scale-105" onClick={handleTestConnection}>
                    Test Link
                  </Button>
                </div>
                <p className="text-xs font-medium text-muted-foreground pt-1 leading-relaxed">Overrides NEXT_PUBLIC_API_URL in browser context. Requires manual sync for cloud endpoints.</p>
              </div>
              
              <div className="space-y-3 p-6 rounded-2xl bg-background/40 border border-border/30 opacity-60 shadow-inner">
                <Label htmlFor="prod-key" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Production Server Key (Read-only)
                </Label>
                <div className="flex gap-4 pt-1">
                  <Input id="prod-key" defaultValue="ff_live_*************************" readOnly className="font-mono text-xs text-muted-foreground bg-muted/20 py-5 rounded-xl border-border/40 flex-1" />
                  <Button variant="outline" disabled className="rounded-xl py-5 px-6 font-bold text-xs">Copy</Button>
                </div>
                <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">Managed securely via Google Cloud Secret Manager. Direct export is disabled for compliance.</p>
              </div>
            </CardContent>
            <CardFooter className="bg-background/40 border-t border-border/20 p-6 flex items-center justify-between">
              <Button
                variant="ghost"
                className="text-xs text-muted-foreground hover:text-foreground font-semibold p-0 h-auto"
                onClick={() => window.open("https://nextjs.org/docs/app/guides/environment-variables", "_blank")}
              >
                Need help finding your keys? Check Next.js Environment Guide <ExternalLink className="w-3 h-3 ml-1.5 inline" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Sidecar: Environment Architecture & Danger Zone */}
        <div className="md:col-span-4 space-y-8">
          <Card className="glassy-card border-border/60 bg-gradient-to-br from-card/80 via-card/40 to-background/40 backdrop-blur-2xl shadow-xl flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" />
            <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6">
              <CardTitle className="text-base font-black flex items-center gap-2.5 text-foreground tracking-tight">
                <Globe className="h-5 w-5 text-blue-400 animate-pulse" /> Environment Targets
              </CardTitle>
              <CardDescription className="text-xs font-semibold mt-1 text-muted-foreground/90">
                Manage multi-stage deployment targets and risk parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 flex-1">
              <div className="flex flex-col gap-2.5 p-5 rounded-2xl border border-red-500/30 bg-red-500/10 group/env transition-all hover:bg-red-500/15 shadow-md backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                     <p className="font-black text-sm text-foreground tracking-tight">Production</p>
                  </div>
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 font-black uppercase tracking-widest text-[10px] shadow-sm">HIGH RISK</Badge>
                </div>
                <div className="flex items-center justify-between mt-1 pl-5">
                   <p className="text-xs text-muted-foreground font-medium leading-relaxed">Live infrastructure serving real user traffic.</p>
                   <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20 shadow-inner shrink-0">STRICT APPROVALS</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 group/env transition-all hover:bg-amber-500/15 shadow-md backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                     <p className="font-black text-sm text-foreground tracking-tight">Staging</p>
                  </div>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/40 px-3 py-1 font-black uppercase tracking-widest text-[10px] shadow-sm">MEDIUM RISK</Badge>
                </div>
                <div className="flex items-center justify-between mt-1 pl-5">
                   <p className="text-xs text-muted-foreground font-medium leading-relaxed">Pre-production parity environment for QA.</p>
                   <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-bold text-muted-foreground hover:text-foreground opacity-0 group-hover/env:opacity-100 transition-opacity bg-background/60 rounded-lg border border-border/40" onClick={() => { setStatus("Staging edit disabled."); setStatusType("info"); }}>Config</Button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 p-5 rounded-2xl border border-green-500/30 bg-green-500/10 group/env transition-all hover:bg-green-500/15 shadow-md backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                     <p className="font-black text-sm text-foreground tracking-tight">Development</p>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/40 px-3 py-1 font-black uppercase tracking-widest text-[10px] shadow-sm">SAFE</Badge>
                </div>
                <div className="flex items-center justify-between mt-1 pl-5">
                   <p className="text-xs text-muted-foreground font-medium leading-relaxed">Isolated local instance for rapid iteration.</p>
                   <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-bold text-muted-foreground hover:text-foreground opacity-0 group-hover/env:opacity-100 transition-opacity bg-background/60 rounded-lg border border-border/40" onClick={() => { setStatus("Dev edit disabled."); setStatusType("info"); }}>Config</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-background/40 border-t border-border/20 p-6">
              <Button variant="outline" className="w-full py-6 rounded-xl font-extrabold text-xs uppercase tracking-widest bg-background/60 border-border/60 hover:bg-background hover:border-primary/50 shadow-md hover:scale-[1.02] transition-all duration-300" onClick={() => { setStatus("Environment creation is queued for a future release."); setStatusType("info"); }}>
                + Add Deployment Environment
              </Button>
            </CardFooter>
          </Card>

          {/* Danger Zone Card */}
          <Card className="glassy-card border-destructive/40 bg-gradient-to-br from-card/80 via-card/40 to-background/40 backdrop-blur-2xl shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-destructive shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse" />
            <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-black flex items-center gap-2.5 text-destructive tracking-tight">
                  <Webhook className="h-5 w-5 text-destructive animate-pulse" /> Danger Zone
                </CardTitle>
                <CardDescription className="text-xs font-semibold mt-1 text-muted-foreground/90">
                  Irreversible destructive actions.
                </CardDescription>
              </div>
              <Badge variant="destructive" className="px-3 py-1 font-black uppercase tracking-widest text-[10px] shadow-sm animate-pulse">
                CRITICAL
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md backdrop-blur-md group-hover:border-destructive/60 transition-colors">
                <div className="space-y-1">
                  <p className="text-sm font-black text-destructive tracking-tight">Purge Analytics Data</p>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs">Permanently delete all rollout history, telemetry streams, and AI reasoning logs.</p>
                </div>
                <Button variant="destructive" size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-extrabold px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105 transition-all duration-300">
                  Purge Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
