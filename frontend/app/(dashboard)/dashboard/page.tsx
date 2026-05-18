"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { 
  Flag, 
  Activity, 
  AlertCircle, 
  ShieldAlert, 
  TrendingUp, 
  Target, 
  Users2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  MoreHorizontal,
  ExternalLink,
  Shield,
  Layers,
  Sliders,
  Play,
  Square
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMemo, useEffect, useState } from "react";
import { Observation, api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEnv } from "@/components/env-provider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { 
    dashboard: data, 
    state, 
    connectionState, 
    connectionText, 
    isSimulating, 
    setIsSimulating, 
    runSimulationStep, 
    fetchData,
    agentType,
    setAgentType
  } = useEnv();
  const loading = useMemo(() => connectionState === "checking" && !data && !state, [connectionState, data, state]);

  useEffect(() => {
    let simInterval: NodeJS.Timeout;
    if (isSimulating) {
      simInterval = setInterval(runSimulationStep, 2000);
    }
    return () => clearInterval(simInterval);
  }, [isSimulating, state, runSimulationStep]);

  const lastObs: Observation | undefined = state?.history?.[state.history.length - 1]?.observation;
  
  const healthScore = lastObs?.system_health_score ?? data?.summary?.health_score ?? 0;
  const errorRate = (lastObs?.error_rate ?? data?.summary?.error_rate ?? 0) * 100;
  const latency = lastObs?.latency_p99_ms ?? data?.summary?.latency_p99_ms ?? 0;
  
  const extra = lastObs?.extra_context as Record<string, unknown> | undefined;
  const anomalyRaw = (extra?.anomaly ?? extra?.tenant_anomaly) as unknown;
  const anomaly = anomalyRaw && typeof anomalyRaw === "object" ? (anomalyRaw as Record<string, unknown>) : {};
  const anomalyIs = Boolean(anomaly.is_anomaly);
  const anomalyScore = Number(anomaly.anomaly_score ?? 0);
  const anomalyList = Array.isArray(anomaly.anomalies) ? (anomaly.anomalies as unknown[]) : [];

  const benchmarkingRaw = extra?.benchmarking as unknown;
  const benchmarking = benchmarkingRaw && typeof benchmarkingRaw === "object"
    ? (benchmarkingRaw as Record<string, unknown>)
    : {};
  const benchmarkingPercentile = Number(benchmarking.percentile ?? 0);
  const benchmarkingComparison = typeof benchmarking.comparison === "string" ? benchmarking.comparison : "";

  const patternRisk = Number(extra?.pattern_risk ?? extra?.tenant_pattern_risk ?? 0);
  const chaos = (lastObs?.chaos_incident && typeof lastObs.chaos_incident === "object")
    ? (lastObs.chaos_incident as Record<string, unknown>)
    : null;
  const chaosType = typeof chaos?.type === "string" ? chaos.type : "incident";
  const chaosDescription = typeof chaos?.description === "string" ? chaos.description : "";
  const chaosIntensity = Number(chaos?.intensity ?? 0);

  const stakeholderData = [
    { name: "DevOps", score: lastObs?.stakeholder_devops_sentiment ?? 0 },
    { name: "Product", score: lastObs?.stakeholder_product_sentiment ?? 0 },
    { name: "Customer", score: lastObs?.stakeholder_customer_sentiment ?? 0 },
  ];

  const activeFlag = useMemo(() => {
    if (!lastObs) return null;
    return {
      id: lastObs.feature_name,
      name: lastObs.feature_name.replace(/_/g, " "),
      rollout: lastObs.current_rollout_percentage,
      status: !(state?.is_done ?? false),
      scenario: state?.scenario_name ?? "Production",
      difficulty: state?.difficulty ?? "Normal",
      lastUpdated: `Step ${state?.step_count ?? 0}`,
    };
  }, [lastObs, state]);

  return (
    <div className="flex-1 space-y-10 p-8 max-w-[1600px] mx-auto font-sans relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/30 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground">Overview</span>
            <span className="text-border">/</span>
            <span className="text-primary">Autonomous Command Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-foreground via-purple-600 to-indigo-600 dark:from-white dark:via-purple-200 dark:to-indigo-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]">
            Platform Overview
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            Real-time feature flag rollouts, AI Copilot monitoring, and global system telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Active Agent Select Dropdown */}
          <div className="relative flex items-center bg-background/60 backdrop-blur-xl border border-border/60 hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 rounded-lg px-3 py-3 shadow-sm gap-2 text-xs font-mono font-bold text-muted-foreground select-none">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span>AGENT:</span>
            <select
              value={agentType}
              onChange={(e) => setAgentType(e.target.value)}
              className="bg-transparent text-foreground border-none focus:outline-none cursor-pointer font-bold uppercase tracking-wider text-[11px]"
            >
              <option value="llm" className="bg-background text-foreground">Groq/OpenAI LLM</option>
              <option value="rl" className="bg-background text-foreground">PPO-Master RL</option>
              <option value="hybrid" className="bg-background text-foreground">DevOps Hybrid</option>
              <option value="ensemble" className="bg-background text-foreground">Ensemble Policy</option>
              <option value="baseline" className="bg-background text-foreground">Baseline Rules</option>
            </select>
          </div>

          {/* Elegant Copilot Switch Button */}
          <Button 
            variant={isSimulating ? "default" : "outline"} 
            size="lg" 
            onClick={() => setIsSimulating(!isSimulating)}
            className={cn(
              "rounded-lg gap-3 px-7 py-6 text-sm font-bold transition-all duration-300 shadow-md border",
              isSimulating 
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.02]" 
                : "bg-background/80 backdrop-blur-xl border-border/80 hover:bg-muted/80 text-muted-foreground hover:text-foreground hover:scale-[1.02]"
            )}
          >
            {isSimulating ? <Square className="h-4 w-4 animate-pulse fill-current text-cyan-300" /> : <Play className="h-4 w-4 fill-current text-primary" />}
            {isSimulating ? "AI Copilot: Active (Autonomous)" : "AI Copilot: Standby (Manual)"}
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => { api.reset().then(() => fetchData()); }}
            className="rounded-lg px-6 py-6 text-sm font-bold bg-background/60 backdrop-blur-xl border-border/60 hover:bg-background hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 shadow-sm"
          >
            Reset Session
          </Button>

          <Badge
            variant="outline"
            className={cn(
              "px-5 py-3.5 rounded-lg border text-xs font-bold shadow-sm backdrop-blur-xl uppercase tracking-wider",
              connectionState === "connected"
                ? "border-green-500/40 text-green-400 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                : connectionState === "disconnected"
                ? "border-destructive/40 text-destructive bg-destructive/10 shadow-[0_0_15px_rgba(220,38,38,0.15)]"
                : "border-border/60 bg-background/60"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full mr-2.5 animate-pulse inline-block",
              connectionState === "connected" ? "bg-green-400 shadow-green-400/80" : "bg-destructive shadow-destructive/80"
            )} />
            {loading ? "Syncing..." : connectionText}
          </Badge>
        </div>
      </div>

      {/* Primary Metrics Bento Bar */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        <MetricCard
          title="System Health"
          value={`${(healthScore * 100).toFixed(1)}%`}
          icon={<Activity className="h-4 w-4 text-green-400" />}
          trend={{ value: 2.4, label: "vs baseline", isPositive: healthScore > 0.9 }}
          description={healthScore > 0.9 ? "Excellent stability" : "Requires attention"}
        />
        <MetricCard
          title="Active Rollout Target"
          value={`${(lastObs?.current_rollout_percentage ?? 0).toFixed(1)}%`}
          icon={<Flag className="h-4 w-4 text-indigo-400" />}
          description="Traffic receiving feature"
        />
        <MetricCard
          title="P99 Latency Profile"
          value={`${latency.toFixed(1)}ms`}
          icon={<Zap className="h-4 w-4 text-yellow-400" />}
          trend={{ value: 2.1, label: "from baseline", isPositive: latency < 150 }}
          description={latency < 150 ? "Lightning fast response" : "Experiencing degradation"}
        />
        <MetricCard
          title="Error Rate Deficit"
          value={`${errorRate.toFixed(3)}%`}
          icon={<AlertCircle className="h-4 w-4 text-red-400" />}
          trend={{ value: 0.05, label: "increase", isPositive: errorRate < 0.1 }}
          description={errorRate < 0.1 ? "Minimal dropped requests" : "Elevated failure rate"}
        />
      </div>

      {/* Main Tabs Section */}
      <Tabs defaultValue="flags" className="space-y-8 w-full">
        <div className="flex items-center justify-between border-b border-border/20 pb-4 px-1">
          <TabsList className="bg-background/80 backdrop-blur-md p-1.5 rounded-xl border border-border/80 shadow-md gap-2 flex flex-wrap items-center">
            <TabsTrigger 
              value="flags" 
              className="rounded-lg px-6 py-2.5 text-sm font-bold transition-all border border-border/40 bg-muted/50 text-foreground/80 hover:text-foreground hover:bg-muted shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(139,92,246,0.4)] data-[state=active]:border-primary data-[state=active]:scale-[1.02]"
            >
              <Flag className="w-4 h-4 mr-2" /> Feature Flags
            </TabsTrigger>
            <TabsTrigger 
              value="copilot" 
              className="rounded-lg px-6 py-2.5 text-sm font-bold transition-all border border-border/40 bg-muted/50 text-foreground/80 hover:text-foreground hover:bg-muted shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(139,92,246,0.4)] data-[state=active]:border-primary data-[state=active]:scale-[1.02]"
            >
              <Zap className="w-4 h-4 mr-2" /> AI Copilot & Telemetry
            </TabsTrigger>
            <TabsTrigger 
              value="governance" 
              className="rounded-lg px-6 py-2.5 text-sm font-bold transition-all border border-border/40 bg-muted/50 text-foreground/80 hover:text-foreground hover:bg-muted shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(139,92,246,0.4)] data-[state=active]:border-primary data-[state=active]:scale-[1.02]"
            >
              <Shield className="w-4 h-4 mr-2" /> Governance & Alerts
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground bg-background/50 px-3.5 py-2 rounded-lg border border-border/40">
            <Layers className="w-4 h-4 text-primary" /> Active Scenario: {state?.scenario_name || "Production"}
          </div>
        </div>

        {/* Tab 1: Feature Flags */}
        <TabsContent value="flags" className="space-y-6 animate-in fade-in-50 duration-500">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-8 space-y-6">
              <Card className="glassy-card bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 hover:border-primary/50 transition-all duration-300 overflow-hidden group shadow-2xl relative rounded-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />
                <CardHeader className="border-b border-border/20 bg-background/30 pb-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3 text-foreground">
                        <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-transform duration-300">
                          <Flag className="h-6 w-6" />
                        </div>
                        Active Flag Registry
                      </CardTitle>
                      <CardDescription className="mt-1.5 font-semibold text-sm text-muted-foreground/90">
                        Currently deployed feature flag controlled by AI Copilot simulation.
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg bg-background/80 font-bold border-border/60 shadow-sm hover:border-primary/50 hover:bg-background hover:scale-[1.02] transition-all duration-300 px-5 py-4 text-xs"
                      onClick={() => router.push("/flags")}
                    >
                      View All Flags <ExternalLink className="w-3.5 h-3.5 ml-2 text-primary inline" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative z-10">
                  {activeFlag ? (
                    <div 
                      className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-primary/[0.03] transition-colors border-b border-border/10"
                      onClick={() => router.push(`/flags/${activeFlag.id}`)}
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-black text-3xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-foreground to-purple-600 dark:from-white dark:to-purple-200">{activeFlag.name}</h3>
                          <Badge variant={activeFlag.status ? "default" : "secondary"} className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm bg-primary hover:bg-primary text-primary-foreground shadow-primary/30 border border-primary/20">
                            {activeFlag.status ? "Active Rollout" : "Completed"}
                          </Badge>
                          <Badge variant="outline" className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary/10 border-primary/30 text-primary shadow-sm backdrop-blur-md">
                            {activeFlag.rollout}% Traffic Target
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-muted-foreground border-l-2 border-primary/50 pl-3.5 py-0.5">
                          Scenario Environment: <span className="text-foreground font-bold">{activeFlag.scenario}</span> | Complexity: <span className="text-foreground font-bold">{activeFlag.difficulty}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                        <div className="flex flex-col md:items-end">
                          <span className="text-lg font-black text-foreground">{activeFlag.lastUpdated}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Evaluation Cycle</span>
                        </div>

                        <Button 
                          variant="default" 
                          size="sm" 
                          className="rounded-lg font-bold px-6 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/flags/${activeFlag.id}`);
                          }}
                        >
                          <Sliders className="w-4 h-4 mr-2" /> Adjust Rollout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-16 text-center flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center border border-border/60 shadow-inner">
                        <Flag className="w-8 h-8 text-muted-foreground opacity-40 animate-pulse" />
                      </div>
                      <p className="text-lg font-extrabold text-foreground tracking-tight">No active simulation flag detected</p>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">
                        Ensure the backend Python simulation is running or start the AI Copilot mode to initialize the active feature flag registry.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions Guide */}
              <Card className="glassy-card border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-background/40 backdrop-blur-2xl shadow-xl rounded-2xl">
                <CardHeader className="pb-4 border-b border-border/20 bg-background/30">
                  <CardTitle className="text-base font-extrabold tracking-tight flex items-center gap-2.5 text-foreground">
                    <Sliders className="w-4 h-4 text-primary animate-pulse" /> Flag Management Shortcuts
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid sm:grid-cols-3 gap-5 text-center">
                  <div className="p-6 rounded-2xl bg-background/80 border border-border/60 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-3.5 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Flag className="w-6 h-6" />
                    </div>
                    <span className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">Create New Flag</span>
                    <span className="text-xs text-muted-foreground font-semibold leading-relaxed">Draft targeting rules & cohorts</span>
                  </div>

                  <div 
                    className="p-6 rounded-2xl bg-background/80 border border-border/60 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-3.5 group cursor-pointer"
                    onClick={() => router.push("/ai-decisions")}
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="font-extrabold text-sm text-foreground group-hover:text-indigo-400 transition-colors">AI Copilot Logs</span>
                    <span className="text-xs text-muted-foreground font-semibold leading-relaxed">Review autonomous reasoning</span>
                  </div>

                  <div 
                    className="p-6 rounded-2xl bg-background/80 border border-border/60 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-3.5 group cursor-pointer"
                    onClick={() => router.push("/monitoring")}
                  >
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Activity className="w-6 h-6" />
                    </div>
                    <span className="font-extrabold text-sm text-foreground group-hover:text-yellow-500 transition-colors">Prometheus Telemetry</span>
                    <span className="text-xs text-muted-foreground font-semibold leading-relaxed">Inspect live metrics stream</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidecar */}
            <div className="md:col-span-4 space-y-6">
              <Card className="glassy-card border-primary/30 bg-gradient-to-br from-primary/15 via-background/60 to-background/60 relative overflow-hidden shadow-2xl rounded-2xl">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary animate-pulse shadow-[0_0_15px_rgba(139,92,246,1)]" />
                <CardHeader className="pb-3 border-b border-border/20 bg-background/30">
                  <CardTitle className="text-lg font-black flex items-center gap-2.5 text-primary tracking-tight">
                    <Zap className="h-5 w-5 animate-pulse" /> AI Copilot Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-5">
                  <p className="text-sm font-semibold text-foreground/90 leading-relaxed border-l-2 border-primary/40 pl-3.5">
                    {isSimulating 
                      ? (healthScore > 0.8 ? "System stability is optimal. AI Copilot recommends expanding rollout to capture more evaluation data." : "Elevated risk detected. AI Copilot is observing before making further deployment decisions.") 
                      : "Autonomous mode is paused. The AI Copilot is standing by for operator authorization."}
                  </p>

                  <div className="pt-4 border-t border-border/30 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Active Brain</span>
                    <span className="font-mono text-foreground font-bold tracking-wider">{agentType === "llm" ? "Groq/OpenAI LLM" : agentType === "rl" ? "PPO-Master RL" : agentType === "hybrid" ? "DevOps Hybrid" : agentType === "ensemble" ? "Ensemble Policy" : "Baseline Rules"}</span>
                  </div>

                  <div className="pt-4 border-t border-border/30 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Autonomous Mode</span>
                    <Badge variant={isSimulating ? "default" : "secondary"} className="rounded-md px-3 py-1 font-bold shadow-sm uppercase tracking-wider text-[10px] border border-border/4">
                      {isSimulating ? "ACTIVE" : "PAUSED"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassy-card border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-background/40 backdrop-blur-2xl shadow-xl rounded-2xl">
                <CardHeader className="pb-4 border-b border-border/20 bg-background/30">
                  <CardTitle className="text-sm font-bold tracking-wider uppercase flex items-center gap-2.5 text-muted-foreground">
                    <ShieldAlert className="h-4 w-4 text-amber-500 animate-pulse" /> Advanced Sidecars & Risk
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between bg-background/50 p-3.5 rounded-xl border border-border/40 shadow-inner">
                    <span className="text-sm font-bold text-muted-foreground">Anomaly Score</span>
                    <Badge variant={anomalyIs ? "destructive" : "secondary"} className="font-mono font-bold px-3 py-1 text-xs shadow-sm rounded-md border border-border/40">
                      {anomalyScore.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between bg-background/50 p-3.5 rounded-xl border border-border/40 shadow-inner">
                    <span className="text-sm font-bold text-muted-foreground">Pattern Risk Profile</span>
                    <div className="flex items-center gap-3">
                      <Progress value={patternRisk * 100} className="w-24 h-2.5 [&>div]:bg-amber-500 rounded-full" />
                      <span className="text-xs font-mono font-bold text-amber-500">{(patternRisk * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/30 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detected Anomalies</span>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {anomalyList.length > 0 ? (
                        anomalyList.map((a) => (
                          <Badge key={String(a)} variant="destructive" className="text-[10px] uppercase font-bold shadow-sm px-2.5 py-1 rounded-md">{String(a)}</Badge>
                        ))
                      ) : (
                        <span className="text-xs text-green-400 font-bold italic bg-green-500/10 px-3 py-1 rounded-md border border-green-500/30 shadow-sm">None detected</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: AI Copilot & Telemetry */}
        <TabsContent value="copilot" className="space-y-6 animate-in fade-in-50 duration-500">
          <div className="grid gap-6 md:grid-cols-12">
            <Card className="md:col-span-8 bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-2xl overflow-hidden flex flex-col group relative rounded-2xl">
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 blur-[90px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-all duration-500" />
              <CardHeader className="border-b border-border/20 bg-background/30 pb-6 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-2xl tracking-tight font-black text-foreground">
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-300">
                      <Activity className="h-6 w-6" />
                    </div>
                    Evaluation Traffic & Rollout Stream
                  </CardTitle>
                  <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-wider bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-sm px-3 py-1.5 rounded-md backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse inline-block" />
                    Live Telemetry Stream
                  </Badge>
                </div>
                <CardDescription className="mt-2 text-sm font-semibold text-muted-foreground/90">
                  Real-time visualization of target rollout percentage vs incoming error rates over time.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 relative z-10">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height={350} minHeight={350}>
                    <AreaChart data={state?.history ? state.history.map(h => ({ 
                      time: h.observation?.time_step, 
                      rollout: h.observation?.current_rollout_percentage,
                      error: (h.observation?.error_rate ?? 0) * 100
                    })) : [
                      { time: -2, rollout: 5, error: 0.1 },
                      { time: -1, rollout: 5, error: 0.15 },
                      { time: 0, rollout: 5, error: 0.1 }
                    ]}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRollout" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.4} />
                    <XAxis dataKey="time" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15,15,18,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(12px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
                      itemStyle={{ color: '#a78bfa', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rollout" 
                      name="Rollout %"
                      stroke="#a78bfa" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorRollout)" 
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            </Card>

            <div className="md:col-span-4 space-y-6">
              <Card className="glassy-card border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-background/40 backdrop-blur-2xl shadow-2xl flex-1 hover:border-primary/40 transition-all duration-300 flex flex-col group relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <CardHeader className="pb-4 border-b border-border/20 bg-background/30 relative z-10">
                  <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Session Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center space-y-8 p-6 relative z-10">
                  <div className="flex flex-col gap-2 p-6 rounded-2xl bg-background/80 border border-border/60 shadow-xl group-hover:border-primary/40 transition-all duration-300">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Cumulative Reward</span>
                    <span className="font-black text-6xl text-transparent bg-clip-text bg-gradient-to-br from-foreground via-purple-600 to-indigo-600 dark:from-white dark:via-purple-200 dark:to-indigo-400 drop-shadow-[0_0_25px_rgba(139,92,246,0.4)] tracking-tighter">
                      {(state?.total_reward ?? 0).toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold mt-1 leading-relaxed">Higher means the AI is making safer, high-confidence decisions.</span>
                  </div>
                  <div className="flex items-center justify-between bg-background/50 p-4 rounded-xl border border-border/40 shadow-inner">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Decision Cycles</span>
                    <span className="font-black text-2xl bg-primary/10 text-primary px-3 py-1 rounded-md border border-primary/30 shadow-sm">{state?.step_count ?? 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassy-card border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-background/40 backdrop-blur-2xl shadow-2xl hover:border-yellow-500/40 transition-all duration-300 overflow-hidden relative group rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none" />
                <CardHeader className="pb-4 border-b border-border/20 bg-background/30 relative z-10">
                  <CardTitle className="text-sm font-bold tracking-wider uppercase flex items-center gap-2.5 text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]">
                    <Zap className="h-5 w-5 animate-pulse" /> Live AI Reasoning Stream
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 relative z-10 space-y-5">
                  <div className="flex items-center justify-between bg-background/50 p-3.5 rounded-xl border border-border/40 shadow-inner">
                    <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">LAST ACTION</span>
                    <Badge variant="outline" className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-sm rounded-md">
                      {String((state?.history?.[state.history.length - 1]?.action as Record<string, unknown> | undefined)?.action_type || "WAITING")}
                    </Badge>
                  </div>
                  <p className="text-base font-semibold leading-relaxed text-foreground/90 border-l-4 border-yellow-500/60 pl-4 py-2 italic bg-yellow-500/[0.02] rounded-r-xl">
                    "{String((state?.history?.[state.history.length - 1]?.action as Record<string, unknown> | undefined)?.reason || "Observing system baseline...")}"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Governance & Alerts */}
        <TabsContent value="governance" className="space-y-6 animate-in fade-in-50 duration-500">
          <div className="grid gap-6 md:grid-cols-12">
            {/* Mission Progress */}
            {lastObs?.mission_name && (
              <Card className="md:col-span-8 bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/50 group rounded-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
                  <Target className="w-48 h-48 text-primary" />
                </div>
                <CardHeader className="pb-6 border-b border-border/20 bg-background/30 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black text-foreground flex items-center gap-3 tracking-tight">
                        <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-transform duration-300">
                          <Target className="h-6 w-6" />
                        </div>
                        Mission: {lastObs.mission_name}
                      </CardTitle>
                      <CardDescription className="text-base mt-2 font-semibold text-muted-foreground/90">
                        Phase {lastObs.phase_index !== undefined ? lastObs.phase_index + 1 : 0} of {lastObs.total_phases}: <span className="text-primary font-bold">{lastObs.current_phase}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm font-bold shadow-sm rounded-md backdrop-blur-md">
                      {((lastObs.phase_progress ?? 0) * 100).toFixed(0)}% Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 relative z-10">
                  <div className="space-y-8">
                    <div className="relative w-full h-4 bg-background/80 rounded-full overflow-hidden border border-border/60 shadow-inner p-0.5">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-primary to-purple-400 rounded-full shadow-[0_0_25px_rgba(139,92,246,0.8)] transition-all duration-1000 ease-out"
                        style={{ width: `${(lastObs.phase_progress ?? 0) * 100}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-3.5">
                      {lastObs.phase_objectives?.map((obj, i) => (
                        <div key={i} className="px-6 py-3.5 rounded-xl bg-background/80 border border-border/60 flex items-center gap-3.5 text-sm font-bold shadow-md hover:border-primary/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:-translate-y-0.5 transition-all duration-300 text-foreground/90 hover:text-foreground">
                          <CheckCircle2 className="h-5 w-5 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)] shrink-0" />
                          {obj}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stakeholder Sentiments */}
            <Card className={cn("bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-2xl flex flex-col group hover:border-indigo-500/40 transition-all duration-300 rounded-2xl", lastObs?.mission_name ? "md:col-span-4" : "md:col-span-12")}>
              <CardHeader className="pb-6 border-b border-border/20 bg-background/30">
                <CardTitle className="flex items-center gap-3 text-xl tracking-tight font-black text-foreground">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-transform duration-300">
                    <Users2 className="h-6 w-6" />
                  </div>
                  Stakeholder Sentiments
                </CardTitle>
                <CardDescription className="text-xs font-semibold mt-1.5 text-muted-foreground/90">Real-time team consensus & governance approval.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 flex-1 flex flex-col justify-between p-6">
                <div className="space-y-6">
                  {stakeholderData.map((entry, index) => (
                    <div key={index} className="space-y-2.5">
                      <div className="flex justify-between text-sm font-black">
                        <span className="text-muted-foreground">{entry.name}</span>
                        <span className={entry.score > 0 ? "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "text-destructive drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"}>
                          {entry.score > 0 ? "+" : ""}{entry.score.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-3.5 bg-background/80 rounded-full overflow-hidden border border-border/60 p-0.5 shadow-inner">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-500 ease-out", entry.score > 0 ? "bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.8)]" : "bg-gradient-to-r from-destructive to-red-400 shadow-[0_0_15px_rgba(220,38,38,0.8)]")}
                          style={{ width: `${Math.max(Math.abs(entry.score) * 100, 5)}%`, marginLeft: entry.score < 0 ? `${100 - Math.abs(entry.score) * 100}%` : '0' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Overall Governance</span>
                  <Badge variant={lastObs?.stakeholder_overall_approval ? "default" : "destructive"} className="rounded-md px-4 py-1.5 font-bold tracking-wider shadow-sm uppercase text-xs border border-border/40">
                    {lastObs?.stakeholder_overall_approval ? "APPROVED" : "BLOCKED"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row: Benchmarking & Chaos */}
          <div className="grid gap-6 md:grid-cols-3">
             <Card className="bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-2xl hover:border-green-500/40 transition-all duration-300 flex flex-col group relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />
                <CardHeader className="pb-0 border-b border-border/20 bg-background/30 relative z-10">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 text-muted-foreground pb-4">
                    <TrendingUp className="h-4 w-4 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                    Global Benchmarking
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden z-10">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.12)_0%,transparent_70%)] pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                  <div className="flex items-baseline gap-1 relative z-10">
                    <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-emerald-300 to-teal-400 drop-shadow-[0_0_30px_rgba(34,197,94,0.4)] tracking-tighter">
                      {(benchmarkingPercentile * 100).toFixed(0)}
                    </span>
                    <span className="text-3xl font-black text-muted-foreground/60">th</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase mt-4">Global Percentile</span>
                  <div className="mt-6 w-full p-5 rounded-xl bg-background/80 border border-border/60 backdrop-blur-md shadow-inner text-center group-hover:border-green-500/30 transition-colors duration-300">
                    <p className="text-xs text-foreground/90 italic font-bold leading-relaxed">
                      {benchmarkingComparison ? <>"{benchmarkingComparison}"</> : "Awaiting baseline data..."}
                    </p>
                  </div>
                </CardContent>
             </Card>

             <Card className="col-span-2 bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-2xl flex flex-col group hover:border-red-500/40 transition-all duration-300 relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
                <CardHeader className="pb-4 border-b border-border/20 bg-background/30 relative z-10">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <div className="flex items-center gap-3 text-2xl tracking-tight font-black text-foreground">
                      <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.25)] group-hover:scale-110 transition-transform duration-300">
                        <ShieldAlert className="h-6 w-6" />
                      </div>
                      Active Alerts & Incidents
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2.5 text-xs bg-background/80 px-4 py-2 rounded-md border border-border/60 text-muted-foreground uppercase font-bold tracking-wider shadow-inner backdrop-blur-md">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)] inline-block" /> Slack Sync Active
                       </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col relative overflow-hidden z-10">
                   {chaos ? (
                     <div className="m-6 bg-destructive/10 border border-destructive/40 rounded-2xl p-8 flex items-start gap-6 shadow-[0_0_30px_rgba(220,38,38,0.15)] relative overflow-hidden backdrop-blur-xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-destructive/25 blur-[80px] rounded-full pointer-events-none" />
                        <div className="bg-destructive/20 p-6 rounded-xl border border-destructive/40 shadow-inner relative z-10">
                           <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
                        </div>
                        <div className="relative z-10 space-y-3.5 flex-1">
                           <h4 className="font-black text-destructive text-3xl tracking-tight">{chaosType}</h4>
                           <p className="text-sm text-destructive/90 font-bold max-w-2xl leading-relaxed">{chaosDescription}</p>
                           <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                              <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive border-none font-bold tracking-wider px-4 py-1.5 text-xs shadow-sm rounded-md">
                                 INTENSITY: {(chaosIntensity * 100).toFixed(0)}%
                              </Badge>
                              <span className="text-xs font-bold text-destructive tracking-wider animate-pulse border border-destructive/40 px-4 py-1.5 rounded-md bg-destructive/10 backdrop-blur-md inline-block">
                                 CRITICAL ACTION REQUIRED
                              </span>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="flex-1 flex flex-col items-center justify-center py-20 min-h-[280px] relative text-center">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />
                        <div className="h-24 w-24 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)] relative z-10 group-hover:scale-110 transition-transform duration-500">
                          <CheckCircle2 className="h-12 w-12 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                        </div>
                        <span className="text-3xl font-black text-foreground tracking-tight relative z-10">Systems Operational</span>
                        <span className="text-xs font-bold uppercase tracking-wider mt-2.5 text-muted-foreground relative z-10">No active chaos incidents</span>
                     </div>
                   )}
                </CardContent>
             </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
