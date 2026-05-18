"use client";

import * as React from "react";
import { api, MonitoringAlert, MonitoringHealth } from "@/lib/api";
import { useEnv } from "@/components/env-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  AlertTriangle, 
  Server, 
  Terminal, 
  CheckCircle2, 
  RefreshCw, 
  Zap,
  ShieldCheck,
  Cpu
} from "lucide-react";

function formatMaybeNumber(value: unknown, digits = 2): string {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(n)) return n.toFixed(digits);
  return "—";
}

export default function MonitoringPage() {
  const { connectionState, connectionText } = useEnv();

  const [health, setHealth] = React.useState<MonitoringHealth | null>(null);
  const [alerts, setAlerts] = React.useState<MonitoringAlert[] | null>(null);
  const [metricsText, setMetricsText] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string>("");

  const refresh = React.useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [h, a, m] = await Promise.all([
        api.getMonitoringHealth(),
        api.getMonitoringAlerts(),
        api.getPrometheusMetrics(),
      ]);
      setHealth(h);
      setAlerts(a);
      setMetricsText(m);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch monitoring data.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(timeout);
  }, [refresh]);

  const monitoringEnabled = health !== null || alerts !== null || metricsText !== null;

  return (
    <div className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto font-sans relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/30 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground">Infrastructure</span>
            <span className="text-border">/</span>
            <span className="text-primary">Real-time Telemetry</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-foreground via-purple-600 to-indigo-600 dark:from-white dark:via-purple-200 dark:to-indigo-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]">
            Observability Command Center
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            Live infrastructure health, automated incident routing, and raw Prometheus metrics ingestion.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Badge
            variant="outline"
            className={cn(
              "px-5 py-3.5 rounded-lg border text-xs font-bold shadow-sm backdrop-blur-xl uppercase tracking-wider flex items-center gap-2.5",
              connectionState === "connected"
                ? "border-green-500/40 text-green-400 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                : connectionState === "disconnected"
                ? "border-destructive/40 text-destructive bg-destructive/10 shadow-[0_0_15px_rgba(220,38,38,0.15)]"
                : "border-border/60 bg-background/60"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse shadow-sm inline-block",
              connectionState === "connected" ? "bg-green-400 shadow-green-400/80" : "bg-destructive shadow-destructive/80"
            )} />
            {connectionState === "connected" ? "Connected" : connectionState === "checking" ? "Checking Link..." : "Offline"}
            <span className="text-muted-foreground/60 font-mono lowercase font-normal ml-1 border-l border-border/40 pl-2 max-w-[180px] truncate">{connectionText}</span>
          </Badge>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={refresh} 
            disabled={loading}
            className="rounded-lg px-7 py-6 text-sm font-bold bg-background/60 backdrop-blur-xl border-border/60 hover:bg-background hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 shadow-sm"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2 inline", loading && "animate-spin")} />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 backdrop-blur-xl px-6 py-4 text-sm font-bold text-destructive shadow-sm animate-in fade-in-50 duration-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-12 relative z-10">
        {/* Left Column: Platform Status & Incidents */}
        <div className="md:col-span-8 space-y-6">
          <Card className="glassy-card bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-xl overflow-hidden group rounded-2xl">
            <CardHeader className="pb-6 border-b border-border/20 bg-background/30 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2.5 text-foreground">
                  <Server className="h-5 w-5 text-primary" />
                  Platform Infrastructure Status
                </CardTitle>
                <CardDescription className="text-xs font-semibold mt-1 text-muted-foreground/90">
                  High-level overview of core microservices, uptime, and telemetry ingestion.
                </CardDescription>
              </div>
              <Badge variant={monitoringEnabled ? "default" : "secondary"} className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm rounded-md", monitoringEnabled ? "bg-green-500/20 text-green-400 border border-green-500/30" : "")}>
                {monitoringEnabled ? "ALL SYSTEMS HEALTHY" : "DEGRADED"}
              </Badge>
            </CardHeader>
            <CardContent className="p-8">
              {health ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2 p-5 rounded-xl bg-background/60 border border-border/40 shadow-inner group-hover:border-primary/30 transition-colors">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> System State
                    </span>
                    <p className="text-2xl font-black text-primary tracking-tight">{health.status === "healthy" ? "Operational" : health.status}</p>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">All core services online.</p>
                  </div>

                  <div className="space-y-2 p-5 rounded-xl bg-background/60 border border-border/40 shadow-inner group-hover:border-primary/30 transition-colors">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-400" /> Uptime
                    </span>
                    <p className="text-2xl font-black text-foreground tracking-tight">{health.uptime_seconds}s</p>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">Time since last restart.</p>
                  </div>

                  <div className="space-y-2 p-5 rounded-xl bg-background/60 border border-border/40 shadow-inner group-hover:border-primary/30 transition-colors">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Incident Alerts
                    </span>
                    <p className="text-2xl font-black text-foreground tracking-tight">{health.alerts_enabled ? "Active" : "Disabled"}</p>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">Automated incident routing.</p>
                  </div>

                  <div className="space-y-2 p-5 rounded-xl bg-background/60 border border-border/40 shadow-inner group-hover:border-primary/30 transition-colors">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" /> Telemetry
                    </span>
                    <p className="text-2xl font-black text-foreground tracking-tight">{health.prometheus_enabled ? "Streaming" : "Offline"}</p>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">Live infrastructure monitoring.</p>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground py-16 text-center flex flex-col items-center justify-center border border-dashed border-border/40 rounded-xl bg-background/40">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                    <RefreshCw className={cn("w-6 h-6 text-muted-foreground inline", loading && "animate-spin")} />
                  </div>
                  <p className="text-base font-bold text-foreground">{loading ? "Establishing telemetry link…" : "Observability endpoint is unreachable."}</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">Please verify your FastAPI server environment configuration and ensure port 8000 is accessible.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Metrics Stream */}
          <Card className="glassy-card bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-xl overflow-hidden group rounded-2xl">
            <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2.5 text-foreground">
                  <Terminal className="h-5 w-5 text-purple-400 animate-pulse" />
                  Live Prometheus Metrics Stream
                </CardTitle>
                <CardDescription className="text-xs font-semibold mt-1 text-muted-foreground/90">
                  Raw telemetry exposed for Prometheus scraping and Grafana ingestion.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 px-3 py-1 text-[10px] font-mono uppercase tracking-wider shadow-sm rounded-md animate-pulse">
                ● SCRAPE TARGET ACTIVE
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {health?.current_metrics && (
                <div className="grid gap-6 md:grid-cols-2 text-sm bg-purple-500/5 border border-purple-500/20 rounded-xl p-6 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Error Rate Deficit</span>
                    <span className="font-mono text-primary font-black text-lg bg-primary/10 px-3 py-1 rounded-md border border-primary/20 shadow-sm">{formatMaybeNumber(health.current_metrics.error_rate, 4)}%</span>
                  </div>
                  <div className="flex items-center justify-between border-t md:border-t-0 md:border-l border-purple-500/20 pt-4 md:pt-0 md:pl-6">
                    <span className="text-muted-foreground font-bold uppercase tracking-wider text-xs">P99 Latency Profile</span>
                    <span className="font-mono text-primary font-black text-lg bg-primary/10 px-3 py-1 rounded-md border border-primary/20 shadow-sm">{formatMaybeNumber(health.current_metrics.latency_p99_ms, 1)} ms</span>
                  </div>
                </div>
              )}
              {metricsText === null ? (
                <div className="text-sm text-muted-foreground border border-dashed border-border/40 rounded-xl py-16 text-center bg-background/40 font-medium">
                  {loading ? "Buffering metrics stream…" : "Metrics ingestion is currently unavailable."}
                </div>
              ) : (
                <div className="rounded-xl border border-border/40 bg-background/70 p-6 shadow-inner overflow-hidden">
                  <pre className="max-h-[350px] overflow-auto text-xs leading-relaxed custom-scrollbar font-mono text-muted-foreground/90 whitespace-pre-wrap break-all pr-4">
                    {metricsText}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Incident Center */}
        <div className="md:col-span-4 space-y-6">
          <Card className="glassy-card border-border/60 bg-gradient-to-br from-card/80 via-card/40 to-background/40 backdrop-blur-2xl shadow-xl flex flex-col group relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse" />
            <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6">
              <CardTitle className="text-base font-black flex items-center gap-2.5 text-foreground tracking-tight">
                <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
                Incident Center
              </CardTitle>
              <CardDescription className="text-xs font-semibold mt-1 text-muted-foreground/90">
                Real-time autonomous anomaly and alert tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              {alerts === null ? (
                <div className="text-sm text-muted-foreground border border-dashed border-border/40 rounded-xl py-16 text-center bg-background/40 my-auto font-medium">
                  {loading ? "Syncing incident logs…" : "Alert routing is offline."}
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm my-auto backdrop-blur-md">
                   <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                      <CheckCircle2 className="w-8 h-8 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
                   </div>
                   <span className="font-black text-lg tracking-tight text-foreground">Zero Active Incidents</span>
                   <span className="text-xs mt-1.5 text-muted-foreground font-semibold max-w-xs leading-relaxed">All infrastructure microservices are operating within fully nominal safe parameters.</span>
                </div>
              ) : (
                <div className="space-y-4 pr-1 max-h-[580px] overflow-y-auto custom-scrollbar">
                  {alerts.map((a, i) => (
                    <div key={i} className="rounded-xl border border-destructive/40 bg-destructive/10 px-6 py-5 text-sm shadow-sm transition-all hover:bg-destructive/20 backdrop-blur-md group/alert">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="font-black truncate text-destructive text-base tracking-tight flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)] inline-block" />
                          {String(a.message ?? a.type ?? "Alert")}
                        </div>
                        <Badge variant="destructive" className="shrink-0 px-3 py-1 font-bold uppercase tracking-wider text-[10px] shadow-sm rounded-md animate-pulse">
                          {String(a.severity ?? "CRITICAL")}
                        </Badge>
                      </div>
                      {a.details ? (
                        <pre className="mt-3 whitespace-pre-wrap break-words text-xs text-muted-foreground/90 bg-background/80 p-3.5 rounded-xl border border-border/40 font-mono shadow-inner leading-relaxed">
                          {JSON.stringify(a.details, null, 2)}
                        </pre>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
