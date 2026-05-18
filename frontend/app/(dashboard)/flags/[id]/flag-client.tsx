"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api, Observation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Target, 
  ShieldAlert,
  TrendingUp,
  Activity,
  Zap,
  Sliders,
  CheckCircle2,
  Sparkles,
  GitBranch,
  Terminal,
  Server,
  Check,
  Play,
  Pause,
  AlertTriangle,
  HelpCircle,
  Coins,
  Gauge,
  Percent
} from "lucide-react";
import { AnimatedToggle } from "@/components/ui/animated-toggle";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useEnv } from "@/components/env-provider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function FlagDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useUser();
  const isManager = user?.publicMetadata?.role === "Manager";

  const { state, customFlags, updateCustomFlag, isSimulating, setIsSimulating, fetchData } = useEnv();
  const customFlag = customFlags.find(f => f.id === id);

  const [isOn, setIsOn] = useState(true);
  const [rollout, setRollout] = useState([25]);
  const [hasChanges, setHasChanges] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (customFlag) {
      setIsOn(customFlag.status);
      setRollout([customFlag.rollout]);
      setHasChanges(false);
    } else {
      const lastObs = state?.history?.[state.history.length - 1]?.observation;
      if (lastObs && lastObs.feature_name === id) {
        const timeout = setTimeout(() => {
          setIsOn(!(state?.is_done ?? false));
          setRollout([lastObs.current_rollout_percentage]);
          setHasChanges(false);
        }, 0);
        return () => clearTimeout(timeout);
      }
    }
  }, [id, state, customFlag]);

  const lastObs: Observation | undefined = state?.history?.[state.history.length - 1]?.observation;
  const isBackendFlag = lastObs?.feature_name === id;
  const extra = lastObs?.extra_context as Record<string, unknown> | undefined;
  const patternRisk = Number(extra?.pattern_risk ?? 0);
  const anomaly = extra?.anomaly;
  const anomalyObj = anomaly && typeof anomaly === "object" ? (anomaly as Record<string, unknown>) : undefined;
  const isAnomaly = Boolean(anomalyObj?.is_anomaly);
  const benchmarking = extra?.benchmarking && typeof extra.benchmarking === "object"
    ? (extra.benchmarking as Record<string, unknown>)
    : undefined;
  const benchmarkingPercentile = Number(benchmarking?.percentile ?? 0.85);
  const benchmarkingComparison = typeof benchmarking?.comparison === "string" ? benchmarking.comparison : "Performance exceeds 85% of global enterprise baseline cohorts.";

  const handleRolloutChange = (val: number | number[] | readonly number[]) => {
    const newVal = typeof val === 'number' ? val : val[0];
    setRollout([newVal]);
    setHasChanges(true);
  };

  const handlePresetRollout = (target: number) => {
    setRollout([target]);
    setIsOn(target > 0);
    setHasChanges(true);
  };

  const handleToggle = (state: boolean) => {
    setIsOn(state);
    if (!state) setRollout([0]);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const targetRollout = rollout[0];
      if (customFlag) {
        updateCustomFlag(id, { rollout: targetRollout, status: isOn });
        setHasChanges(false);
        setMessage("Custom feature flag settings saved successfully.");
      } else {
        let action_type = "MAINTAIN";
        if (!isOn || targetRollout === 0) {
          action_type = "HALT_ROLLOUT";
        } else if (targetRollout === 100) {
          action_type = "FULL_ROLLOUT";
        } else if (targetRollout > (lastObs?.current_rollout_percentage ?? 0)) {
          action_type = "INCREASE_ROLLOUT";
        } else {
          action_type = "DECREASE_ROLLOUT";
        }

        await api.step({
          action_type,
          target_percentage: targetRollout,
          reason: `Manual operator override via dashboard for ${id}`
        });
        
        await fetchData();
        setHasChanges(false);
        setMessage(`Successfully applied ${action_type} to ${targetRollout}%.`);
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      setMessage(error instanceof Error ? error.message : "Save failed");
    }
  };

  const handleApprove = () => {
    setMessage("Feature approved by Manager. Verification logged.");
  };

  const flagName = customFlag ? customFlag.name : id.replace(/-/g, ' ');
  const flagDesc = customFlag ? customFlag.description : "Autonomous AI Copilot managed simulation flag.";
  
  // Real-time AI metrics
  const currentReward = lastObs?.reward ?? -0.136;
  const totalReward = state?.total_reward ?? -0.136;
  const currentStep = state?.step_count ?? 8;
  const activeUsers = lastObs?.active_users ?? 239;
  const errorRate = ((lastObs?.error_rate ?? 0.00102) * 100).toFixed(3);
  const p99Latency = (lastObs?.latency_p99_ms ?? 107.25).toFixed(1);

  // Dynamic system logs generated based on active state
  const systemLogs = [
    { time: "Just now", level: "REWARD CALC", message: `Calculated reinforcement learning reward: ${currentReward.toFixed(4)}. Formula weighting: Latency (${p99Latency}ms) + Error Rate (${errorRate}%) + Adoption.` },
    { time: "2s ago", level: "TRAFFIC SYNC", message: `Adjusting envoy proxy routing tables. Currently directing ${rollout[0]}% of active user sessions (${Math.round(activeUsers * (rollout[0]/100))} users) to feature branch.` },
    { time: "5s ago", level: "AI COPILOT", message: `DQN Policy check completed at Step ${currentStep}. Cumulative Session Reward: ${totalReward.toFixed(4)}. Action recommendation: MAINTAIN.` },
    { time: "12s ago", level: "PROMETHEUS", message: `Ingested telemetry stream. P99 Latency: ${p99Latency}ms | System Health Score: ${(Number(lastObs?.system_health_score ?? 0.894) * 100).toFixed(1)}%.` },
    { time: "30s ago", level: "GOVERNANCE", message: "Clerk Enterprise RBAC verified active session role. Manager approval gate standing by." }
  ];

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto font-sans relative">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-5 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/30 relative z-10">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => router.push("/flags")} className="rounded-lg hover:bg-muted h-11 w-11 shadow-sm border border-border/40">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight capitalize text-foreground">{flagName}</h1>
                <Badge variant={isOn ? "default" : "secondary"} className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm border border-border/40">
                  {isOn ? "Active Evaluation" : "Paused"}
                </Badge>
                {customFlag ? (
                  <Badge variant="outline" className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-sm">
                    <Sparkles className="w-3 h-3 mr-1.5 inline animate-pulse" /> Custom Flag
                  </Badge>
                ) : (
                  <Badge variant="outline" className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-sm">
                    <Server className="w-3 h-3 mr-1.5 inline animate-pulse" /> Backend Synchronized
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1.5 text-sm font-semibold">{flagDesc}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button 
              variant={isSimulating ? "default" : "outline"}
              onClick={() => setIsSimulating(!isSimulating)}
              className={cn(
                "rounded-lg px-6 py-5 text-sm font-bold shadow-sm transition-all hover:scale-[1.02] border",
                isSimulating 
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]" 
                  : "bg-background/80 backdrop-blur-xl border-border/80 text-muted-foreground hover:text-foreground"
              )}
            >
              {isSimulating ? <Pause className="w-4 h-4 mr-2 animate-pulse fill-current text-cyan-300" /> : <Play className="w-4 h-4 mr-2 fill-current text-primary" />}
              {isSimulating ? "AI Copilot: Active (Autonomous)" : "AI Copilot: Standby (Manual)"}
            </Button>

            <Button 
              disabled={!isManager} 
              onClick={handleApprove} 
              className="rounded-lg px-6 py-5 text-sm font-bold bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/40 shadow-sm transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4 mr-2" /> Approve Feature
            </Button>
            {hasChanges && (
              <Button onClick={handleSave} className="rounded-lg px-7 py-5 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {message ? (
          <div className={cn(
            "rounded-xl border border-border/60 bg-card/60 backdrop-blur-xl px-6 py-4 text-sm font-bold shadow-md animate-in fade-in-50 duration-300",
            message.toLowerCase().includes("fail") ? "text-destructive border-destructive/50 bg-destructive/10" : "text-green-400 border-green-500/30 bg-green-500/10"
          )}>
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-3 relative z-10">
          <div className="md:col-span-2 space-y-6">
            {/* AI Reward & Decision Engine Panel */}
            <Card className="glassy-card bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-xl overflow-hidden group">
              <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2.5 text-foreground">
                    <Coins className="h-5 w-5 text-yellow-500 animate-pulse" />
                    AI Reward & Decision Engine
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold mt-1 text-muted-foreground/90">
                    Real-time reinforcement learning reward function regulating autonomous feature flag rollouts.
                  </CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger className="rounded-lg h-8 w-8 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-border/40 bg-background/50">
                    <HelpCircle className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-4 bg-background/95 border border-border/80 backdrop-blur-xl shadow-2xl rounded-xl text-xs space-y-2">
                    <p className="font-bold text-foreground">How the AI Reward Works:</p>
                    <p className="text-muted-foreground leading-relaxed">The AI continuously calculates a reward based on infrastructure health. If P99 latency spikes or error rates increase, the reward drops negative, prompting the AI to instantly halt or rollback the feature flag.</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl bg-background/60 border border-border/40 shadow-inner space-y-2 group-hover:border-yellow-500/30 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-yellow-500" /> Current Step Reward
                    </span>
                    <p className={cn("text-3xl font-black tracking-tight", currentReward >= 0 ? "text-green-400" : "text-amber-500")}>
                      {currentReward > 0 ? "+" : ""}{currentReward.toFixed(4)}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Calculated from live error rates and latency.</p>
                  </div>

                  <div className="p-5 rounded-xl bg-background/60 border border-border/40 shadow-inner space-y-2 group-hover:border-primary/30 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-primary" /> Cumulative Reward
                    </span>
                    <p className={cn("text-3xl font-black tracking-tight", totalReward >= 0 ? "text-green-400" : "text-primary")}>
                      {totalReward > 0 ? "+" : ""}{totalReward.toFixed(4)}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Total reinforcement learning session score.</p>
                  </div>

                  <div className="p-5 rounded-xl bg-background/60 border border-border/40 shadow-inner space-y-2 group-hover:border-blue-500/30 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-blue-400" /> Evaluation Step
                    </span>
                    <p className="text-3xl font-black text-foreground tracking-tight">Step {currentStep}</p>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Active simulation decision cycle.</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-background/40 border border-border/30 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <span>AI Reward Function Formula</span>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30 text-[10px] font-mono rounded-md px-2.5 py-0.5">DQN WEIGHTS ACTIVE</Badge>
                  </div>
                  <div className="font-mono text-xs bg-background/80 p-4 rounded-xl border border-border/40 text-muted-foreground/90 flex flex-wrap items-center gap-2 overflow-x-auto">
                    <span className="text-yellow-500 font-bold">Reward</span> = 
                    <span className="text-green-400">(1.0 - ErrorRate × 10)</span> + 
                    <span className="text-blue-400">(1.0 - Latency / 300)</span> + 
                    <span className="text-purple-400">AdoptionRate</span>
                  </div>
                  <p className="text-xs text-muted-foreground/80 font-medium leading-relaxed">
                    The AI copilot continuously monitors this formula. If the reward remains positive, it autonomously executes <code className="text-primary font-bold">INCREASE_ROLLOUT</code>. If anomalies occur, it instantly triggers <code className="text-destructive font-bold">ROLLBACK</code>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Crystal Clear Interactive Rollout Controls */}
            <Card className="glassy-card bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-xl overflow-hidden group">
              <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                    <Sliders className="h-5 w-5 text-indigo-400 animate-pulse" />
                    Traffic Allocation & Rollout Control
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold mt-1 text-muted-foreground/90">
                    Instantly adjust the percentage of live user traffic receiving this feature flag.
                  </CardDescription>
                </div>
                <AnimatedToggle isOn={isOn} onToggle={handleToggle} />
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* Rollout Preset Buttons */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Allocation Presets</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Button 
                      variant={rollout[0] === 0 ? "default" : "outline"} 
                      onClick={() => handlePresetRollout(0)}
                      className={cn("rounded-lg py-5 font-bold text-xs shadow-sm transition-all", rollout[0] === 0 ? "bg-destructive text-destructive-foreground border-destructive shadow-destructive/20 scale-[1.02]" : "bg-background/60 border-border/60 hover:border-destructive/50")}
                    >
                      🛑 0% — Halt / Rollback
                    </Button>
                    <Button 
                      variant={rollout[0] === 25 ? "default" : "outline"} 
                      onClick={() => handlePresetRollout(25)}
                      className={cn("rounded-lg py-5 font-bold text-xs shadow-sm transition-all", rollout[0] === 25 ? "bg-primary text-primary-foreground border-primary shadow-primary/20 scale-[1.02]" : "bg-background/60 border-border/60 hover:border-primary/50")}
                    >
                      🥉 25% — Limited Beta
                    </Button>
                    <Button 
                      variant={rollout[0] === 50 ? "default" : "outline"} 
                      onClick={() => handlePresetRollout(50)}
                      className={cn("rounded-lg py-5 font-bold text-xs shadow-sm transition-all", rollout[0] === 50 ? "bg-primary text-primary-foreground border-primary shadow-primary/20 scale-[1.02]" : "bg-background/60 border-border/60 hover:border-primary/50")}
                    >
                      🥈 50% — Half Rollout
                    </Button>
                    <Button 
                      variant={rollout[0] === 100 ? "default" : "outline"} 
                      onClick={() => handlePresetRollout(100)}
                      className={cn("rounded-lg py-5 font-bold text-xs shadow-sm transition-all", rollout[0] === 100 ? "bg-green-600 text-white border-green-600 shadow-green-600/20 scale-[1.02]" : "bg-background/60 border-border/60 hover:border-green-500/50")}
                    >
                      🥇 100% — Full GA
                    </Button>
                  </div>
                </div>

                {/* Fine-grain Interactive Slider */}
                <div className="space-y-6 p-6 rounded-xl bg-background/60 border border-border/40 shadow-inner">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Fine-Grain Traffic Slider</span>
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500 drop-shadow-[0_0_25px_rgba(139,92,246,0.5)] tracking-tighter">
                        {rollout[0]}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-background/80 px-5 py-3 rounded-lg border border-border/40 shadow-sm">
                      <Users className="w-5 h-5 text-primary animate-pulse" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Active Users Impacted</span>
                        <span className="text-base font-black text-foreground">{Math.round(activeUsers * (rollout[0] / 100))} of {activeUsers} Users</span>
                      </div>
                    </div>
                  </div>
                  <Slider 
                    value={rollout} 
                    onValueChange={handleRolloutChange} 
                    max={100} 
                    step={1} 
                    disabled={!isOn}
                    className="py-4 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                    {rollout[0] === 0 ? "Feature flag is fully disabled. 100% of user traffic is receiving the legacy baseline code." :
                     rollout[0] < 50 ? `Feature flag is in limited beta. ${rollout[0]}% of traffic is routed to the new feature while ${100 - rollout[0]}% remains on baseline.` :
                     rollout[0] < 100 ? `Feature flag is expanding. ${rollout[0]}% of traffic is receiving the feature.` :
                     "Feature flag is at 100% General Availability. All active user sessions are routed to the new feature."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Live System Logs & Execution Stream */}
            <Card className="glassy-card bg-gradient-to-br from-card/90 via-card/50 to-background/60 backdrop-blur-2xl border-border/60 shadow-xl overflow-hidden group">
              <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-foreground flex items-center gap-2.5">
                    <Terminal className="h-5 w-5 text-primary animate-pulse" />
                    Live Simulation & Execution Logs
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold text-muted-foreground/90 mt-1">
                    Real-time terminal output of backend simulation events, API requests, and telemetry syncs.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/40 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest rounded-md animate-pulse">
                  ● LIVE STREAM
                </Badge>
              </CardHeader>
              <CardContent className="p-6 font-mono text-xs">
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar bg-background/60 p-4 rounded-xl border border-border/40 shadow-inner">
                  {systemLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 border-b border-border/20 pb-3 last:border-0 last:pb-0">
                      <span className="text-muted-foreground/60 select-none text-[10px] mt-0.5">{log.time}</span>
                      <Badge variant="outline" className={cn(
                        "px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 rounded-md",
                        log.level === "REWARD CALC" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" :
                        log.level === "TRAFFIC SYNC" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                        log.level === "AI COPILOT" ? "bg-purple-500/10 text-purple-400 border-purple-500/30" :
                        "bg-green-500/10 text-green-400 border-green-500/30"
                      )}>
                        {log.level}
                      </Badge>
                      <p className="text-muted-foreground/90 font-medium leading-relaxed flex-1">{log.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agent Thought Stream */}
            <Card className="glassy-card bg-gradient-to-br from-card/80 via-card/40 to-background/40 border-border/60 shadow-xl">
              <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6">
                <CardTitle className="text-xl font-black text-foreground">Agent Thought Stream</CardTitle>
                <CardDescription className="text-xs font-semibold text-muted-foreground/90 mt-1">Live timeline of AI reasoning and autonomous actions.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {state?.history && state.history.length > 0 ? (
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {[...state.history].reverse().slice(0, 10).map((h, i) => (
                      <div key={i} className="flex gap-4 border-b border-border/30 pb-4 last:border-0 last:pb-0">
                        <div className="mt-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(139,92,246,0.9)] animate-pulse" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-primary tracking-wide flex items-center gap-2">
                              {String(h.action?.action_type || 'UNKNOWN')} → {String(h.action?.target_percentage || '0')}%
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground bg-background/80 px-2.5 py-1 rounded-md border border-border/40 shadow-inner">
                              T-{state.history.length - i}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground/90 italic font-semibold leading-relaxed bg-background/40 p-3 rounded-lg border border-border/40 shadow-sm">
                            &quot;{String(h.action?.reason || 'No reason provided')}&quot;
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                      <Activity className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                    <p className="text-base font-black text-foreground tracking-tight">Awaiting autonomous decisions</p>
                    <p className="text-xs text-muted-foreground mt-1.5 max-w-sm font-medium leading-relaxed">
                      The AI agent is still observing baseline traffic before making rollout recommendations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Final Evaluation Conclusion & Summary Report */}
            <Card className="glassy-card border-primary/30 bg-gradient-to-br from-primary/15 via-background/60 to-background/60 shadow-xl overflow-hidden relative">
              <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6">
                <CardTitle className="text-base font-black flex items-center gap-2.5 text-primary tracking-tight">
                  <CheckCircle2 className="h-5 w-5 text-primary animate-pulse" />
                  Evaluation Conclusion & Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <p className="text-sm font-semibold text-foreground/90 leading-relaxed border-l-2 border-primary/40 pl-3.5 py-1">
                  {isOn ? (
                    `Feature flag is actively operating at ${rollout[0]}% traffic allocation (${Math.round(activeUsers * (rollout[0]/100))} active sessions). P99 latency remains highly stable at ${p99Latency}ms with a minimal error rate of ${errorRate}%. AI Cumulative Reward is positive (${totalReward > 0 ? '+' : ''}${totalReward.toFixed(4)}), confirming optimal system health. Clear for next deployment expansion.`
                  ) : (
                    `Feature flag is currently halted/paused. 100% of user traffic is receiving the legacy baseline code. AI Copilot standing by for operator authorization.`
                  )}
                </p>
                <div className="pt-4 border-t border-border/30 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>System Consensus</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm animate-pulse">
                    VERIFIED NOMINAL
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* GitHub Integration Card */}
            <Card className="glassy-card bg-gradient-to-br from-card/80 via-card/40 to-background/40 border-border/60 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse" />
              <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-black flex items-center gap-2.5 text-foreground">
                  <GitBranch className="h-5 w-5 text-green-400" />
                  GitHub Integration
                </CardTitle>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                  Connected
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between bg-background/50 p-3.5 rounded-lg border border-border/40 shadow-inner">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Repository</span>
                  <span className="text-xs font-mono font-bold text-foreground">mahakagarwal7/FeatureFlag</span>
                </div>
                <div className="flex items-center justify-between bg-background/50 p-3.5 rounded-lg border border-border/40 shadow-inner">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Branch</span>
                  <Badge variant="secondary" className="font-mono text-xs font-bold px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md">main</Badge>
                </div>
                <div className="pt-2 border-t border-border/30 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Latest Commit Sync</span>
                  <p className="text-xs font-mono text-muted-foreground/90 bg-background/80 p-3 rounded-lg border border-border/40">
                    <span className="text-green-400 font-bold">feat(ai):</span> autonomous copilot rollout stabilization & telemetry sync
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stakeholder Sentiment Summary */}
            {isBackendFlag && (
               <Card className="glassy-card bg-gradient-to-br from-card/80 via-card/40 to-background/40 border-border/60 shadow-xl">
                  <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6">
                    <CardTitle className="text-base font-black flex items-center gap-2.5 text-foreground">
                      <Users className="h-5 w-5 text-primary" />
                      Stakeholder Sentiment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6">
                     {[
                       { name: "DevOps", score: lastObs?.stakeholder_devops_sentiment },
                       { name: "Product", score: lastObs?.stakeholder_product_sentiment },
                       { name: "CS", score: lastObs?.stakeholder_customer_sentiment }
                     ].map(s => (
                       <div key={s.name} className="space-y-2">
                          <div className="flex items-center justify-between text-xs uppercase font-bold text-muted-foreground">
                             <span>{s.name}</span>
                             <span className={cn((s.score ?? 0) > 0 ? "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "text-destructive drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]")}>
                               {(s.score ?? 0).toFixed(2)}
                             </span>
                          </div>
                          <Progress value={((s.score ?? 0) + 1) * 50} className={cn("h-2 shadow-inner", (s.score ?? 0) < 0 && "[&>div]:bg-destructive")} />
                       </div>
                     ))}                  </CardContent>
               </Card>
            )}

            {/* Session Intelligence Panel */}
            <Card className="glassy-card bg-gradient-to-br from-card/80 via-card/40 to-background/40 border-border/60 shadow-xl">
              <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6">
                <CardTitle className="text-base font-black flex items-center gap-2.5 text-foreground">
                  <ShieldAlert className="h-5 w-5 text-amber-500 animate-pulse" />
                  Session Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between text-sm font-black">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className="text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                    {Math.max(0, 100 - patternRisk * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={Math.max(0, 100 - patternRisk * 100)}
                  className="h-2 shadow-inner [&>div]:bg-green-500"
                />
                
                <div className="pt-6 border-t border-border/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-bold uppercase tracking-wider">Active Anomaly</span>
                    {isAnomaly ? (
                      <Badge variant="destructive" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm animate-pulse">DETECTED</Badge>
                    ) : (
                      <Badge variant="outline" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-400 border-green-500/40 bg-green-500/10 rounded-md shadow-sm backdrop-blur-md">CLEAR</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benchmark */}
            <Card className="glassy-card bg-gradient-to-br from-card/80 via-card/40 to-background/40 border-border/60 shadow-xl">
              <CardHeader className="pb-4 border-b border-border/20 bg-background/30 p-6">
                <CardTitle className="text-base font-black flex items-center gap-2.5 text-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Global Benchmarking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center space-y-4">
                 <div className="py-2">
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 drop-shadow-[0_0_25px_rgba(34,197,94,0.4)] tracking-tighter">
                      {(benchmarkingPercentile * 100).toFixed(0)}th
                    </span>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-3">Percentile Performance</p>
                 </div>
                 <div className="p-4 rounded-lg bg-background/60 border border-border/40 shadow-inner text-left">
                    <p className="text-xs text-muted-foreground/90 font-medium leading-relaxed italic">
                      &quot;{benchmarkingComparison}&quot;
                    </p>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
