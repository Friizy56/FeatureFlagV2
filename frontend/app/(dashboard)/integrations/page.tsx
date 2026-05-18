"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  GitGraph, 
  ExternalLink,
  RefreshCw,
  Bell
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const FUTURE_INTEGRATIONS = [
  { id: "datadog", name: "Datadog", desc: "Export metrics to Datadog dashboards." },
  { id: "pagerduty", name: "PagerDuty", desc: "Automated incident routing." },
  { id: "discord", name: "Discord", desc: "Rollout alerts to Discord channels." },
  { id: "kubernetes", name: "Kubernetes", desc: "Sync rollout state with K8s." },
  { id: "grafana", name: "Grafana", desc: "Native Grafana dashboards." },
  { id: "launchdarkly", name: "LaunchDarkly", desc: "Migration and sync tool." },
  { id: "sentry", name: "Sentry", desc: "Error tracking correlation." }
];

const IntegrationsPage = () => {
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState("Never");
  const [isHealthy, setIsHealthy] = useState(false);
  const [baseUrl, setBaseUrl] = useState("http://localhost:8000");

  const syncIntegrations = async () => {
    setLoading(true);
    try {
      const [health] = await Promise.all([
        api.getHealth(),
        api.getDashboard(),
      ]);
      setIsHealthy(Boolean(health?.environment_ready));
      setLastSync(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to sync integration status:", error);
      setIsHealthy(false);
      setLastSync("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setBaseUrl(api.getApiBaseUrl() || "http://localhost:8000");
    const initialSync = setTimeout(() => {
      void syncIntegrations();
    }, 0);
    return () => clearTimeout(initialSync);
  }, []);

  const integrations = [
    {
      id: "slack",
      name: "Slack",
      description: "Automated rollout notifications and approval workflows.",
      icon: MessageSquare,
      status: isHealthy ? "connected" : "disconnected",
      details: isHealthy ? "Alerts can be routed through backend automation" : "Backend unavailable",
      lastSync
    },
    {
      id: "github",
      name: "GitHub",
      description: "Trigger rollouts from PRs and sync deployment status.",
      icon: GitGraph,
      status: "disconnected",
      details: "Requires OAuth",
      lastSync
    }
  ];

  return (
    <div className="flex-1 space-y-10 p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground">Workflow</span>
            <span className="text-border">/</span>
            <span className="text-primary">External Integrations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-foreground via-purple-600 to-indigo-600 dark:from-white dark:via-purple-200 dark:to-indigo-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]">
            Integrations
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Connect your existing observability, communication, and infrastructure tools. The platform routes telemetry and alerts directly into your team's workflow.
          </p>
        </div>
        <Button variant="outline" size="lg" className="rounded-lg bg-card/60 backdrop-blur-xl border-border/50 shadow-md hover:border-primary/50 text-foreground font-bold px-7 py-6" onClick={syncIntegrations} disabled={loading}>
          <RefreshCw className={`mr-3 h-5 w-5 inline ${loading ? "animate-spin text-primary" : "text-muted-foreground"}`} />
          {loading ? "Syncing APIs..." : "Sync Connections"}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {integrations.map((item) => (
          <Card key={item.id} className="bg-card/60 backdrop-blur-xl border-border/50 shadow-2xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col group rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-inner group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                </div>
                <Badge 
                  variant={item.status === "connected" ? "default" : "secondary"}
                  className={item.status === "connected" ? "bg-green-500 hover:bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] px-3 py-1 font-bold uppercase tracking-wider text-[10px] rounded-md border border-green-500/20" : "px-3 py-1 font-bold uppercase tracking-wider text-[10px] bg-muted text-muted-foreground rounded-md border border-border/40"}
                >
                  {item.status === "connected" ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <CardTitle className="mt-8 text-2xl font-bold tracking-tight">{item.name}</CardTitle>
              <CardDescription className="text-sm font-medium mt-2 leading-relaxed h-10">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end border-t border-border/10 pt-6 mt-2">
              <div className="space-y-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Status</span>
                  <span className={cn("font-medium text-xs", item.status === "connected" ? "text-green-500" : "text-muted-foreground")}>{item.details}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Last Sync</span>
                  <span className="text-xs font-mono">{item.lastSync}</span>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="default" className="w-full text-xs h-10 rounded-lg font-bold tracking-wider uppercase shadow-sm">
                    Configure
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg shrink-0 border-border/50">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Future Integrations */}
        {FUTURE_INTEGRATIONS.map((item) => (
          <Card key={item.id} className="bg-card/20 backdrop-blur-sm border-border/20 shadow-sm opacity-60 grayscale-[80%] hover:grayscale-0 hover:opacity-100 transition-all duration-500 flex flex-col relative overflow-hidden group rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none" />
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 border border-border/50">
                  <ExternalLink className="h-6 w-6 text-muted-foreground" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-background/80 text-muted-foreground shadow-sm rounded-md">
                  Coming Soon
                </Badge>
              </div>
              <CardTitle className="mt-6 text-xl font-bold tracking-tight text-foreground/80">{item.name}</CardTitle>
              <CardDescription className="text-sm font-medium mt-1 leading-relaxed">{item.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end pt-2 relative z-10">
               <div className="w-full h-10 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Locked for MVP</span>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glassy-card border-primary/20 bg-primary/5 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bell className="h-5 w-5 inline" />
            Webhook Endpoints
          </CardTitle>
          <CardDescription>Receive automated alerts from your own infrastructure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-background/50 p-4 font-mono text-xs flex justify-between items-center group">
             <span className="text-primary truncate">GET {baseUrl}/monitoring/alerts</span>
             <Badge variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary border-primary/30 rounded-md px-3 py-1">Copy</Badge>
          </div>
          
          <div className="flex items-center justify-between border-t border-primary/10 pt-4">
             <p className="text-[10px] text-muted-foreground max-w-sm">
               Uses live backend monitoring routes for alert ingestion and observability polling. Wait for active simulation to receive payloads.
             </p>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs h-9 rounded-lg border-primary/30 text-primary hover:bg-primary/10 px-4 font-bold">
                   View Last Payload
                </Button>
                <Button variant="default" size="sm" className="text-xs h-9 rounded-lg bg-primary/80 hover:bg-primary text-primary-foreground shadow-[0_0_15px_rgba(139,92,246,0.3)] px-4 font-bold">
                   Send Test Event
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsPage;
