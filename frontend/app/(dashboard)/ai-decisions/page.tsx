"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Zap, MessageSquare, History, Activity } from "lucide-react";
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

import { useEnv } from "@/components/env-provider";
import { cn } from "@/lib/utils";

export default function AIDecisionsPage() {
  const { state } = useEnv();

  const history = state?.history || [];
  const rewardData = history.map((step, index: number) => ({
    episode: index + 1,
    reward: Number(step.reward ?? 0)
  }));

  const rolloutData = history.map((step, index: number) => ({
    episode: index + 1,
    rollout: step.observation?.current_rollout_percentage ?? 0
  }));

  const totalReward = state?.total_reward ?? 0;
  const currentStep = state?.step_count ?? 0;
  
  const getActionField = (action: unknown, key: string): unknown => {
    if (!action || typeof action !== "object") return undefined;
    return (action as Record<string, unknown>)[key];
  };

  const getActionTypeString = (action: unknown): string => {
    const v = getActionField(action, "action_type");
    return typeof v === "string" ? v : "UNKNOWN";
  };

  const getActionReasonString = (action: unknown): string => {
    const v = getActionField(action, "reason");
    return typeof v === "string" ? v : "Observing system baseline...";
  };

  // Get recent decisions from history
  const recentDecisions = [...history]
    .reverse()
    .filter((h): h is typeof h & { action: Record<string, unknown> } => Boolean(h.action))
    .slice(0, 10);
  const lastActionType = (() => {
    const a = recentDecisions[0]?.action;
    const t = getActionTypeString(a);
    return t === "UNKNOWN" ? "WAITING" : t;
  })();

  const lastReason = (() => {
    return getActionReasonString(recentDecisions[0]?.action);
  })();

  return (
    <div className="flex-1 space-y-8 p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground">Intelligence</span>
            <span className="text-border">/</span>
            <span className="text-primary">Autonomous Copilot</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-foreground via-purple-600 to-indigo-600 dark:from-white dark:via-purple-200 dark:to-indigo-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]">
            AI Copilot
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Watch your autonomous deployment co-pilot in real-time. It continuously analyzes infrastructure health, evaluates anomaly risks, and automatically adjusts feature flag traffic to guarantee zero-downtime rollouts.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 font-mono text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BrainCircuit className="h-3.5 w-3.5 text-primary" />
            <span>MODEL:</span>
            <span className="text-foreground font-semibold">PPO-MASTER</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              !state?.is_done ? "bg-green-500" : "bg-muted-foreground"
            )} />
            <span>STATUS:</span>
            <span className={cn("font-semibold", !state?.is_done ? "text-green-400" : "text-muted-foreground")}>
              {state?.is_done ? "SESSION COMPLETE" : "LEARNING IN PROGRESS"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl md:col-span-8 flex flex-col overflow-hidden hover:border-primary/30 transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-border/10 bg-background/20">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-500" />
                Live Performance vs Rollout
              </CardTitle>
              <CardDescription className="text-sm font-medium mt-2 max-w-lg leading-relaxed">
                As the rollout percentage (blue line) increases, the AI tries to keep the reward (purple area) high. If errors occur, the reward drops and the AI rolls back.
              </CardDescription>
            </div>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/50 px-4 py-2 rounded-lg border border-border/50">
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)] inline-block" /> AI Confidence</div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] inline-block" /> Traffic %</div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 mt-6 mr-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height={350} minHeight={350}>
                <AreaChart data={rewardData.map((d, i) => ({ ...d, rollout: rolloutData[i]?.rollout }))}>
                  <defs>
                    <linearGradient id="colorReward" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="episode" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid var(--border)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="reward" 
                    name="AI Confidence"
                    stroke="var(--primary)" 
                    strokeWidth={3} 
                    fill="url(#colorReward)"
                    animationDuration={1000}
                  />
                  <Line 
                    yAxisId="right"
                    type="stepAfter" 
                    dataKey="rollout" 
                    name="Traffic %"
                    stroke="#818cf8" 
                    strokeWidth={3} 
                    dot={{ stroke: '#818cf8', strokeWidth: 2, r: 4, fill: '#000' }}
                    activeDot={{ r: 6, fill: '#818cf8' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-4 space-y-8 flex flex-col">
          <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl flex-1 hover:border-primary/30 transition-all flex flex-col rounded-2xl">
            <CardHeader className="pb-4 border-b border-border/10 bg-background/20">
              <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Session Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-8 p-6">
              <div className="flex flex-col gap-2 p-5 rounded-2xl bg-background/50 border border-border/50 shadow-inner">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Cumulative Reward</span>
                <span className="font-black text-5xl text-transparent bg-clip-text bg-gradient-to-br from-primary to-purple-300 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  {totalReward.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground font-medium mt-1">Higher means the AI is making safer decisions.</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Decision Cycles</span>
                <span className="font-bold text-2xl bg-muted/50 px-3 py-1 rounded-md border border-border/50">{currentStep}</span>
              </div>
              <div className="flex flex-col gap-3 pt-6 border-t border-border/20">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Scenario</span>
                <div className="flex items-center justify-between">
                   <span className="font-bold text-lg truncate text-foreground/90">{state?.scenario_name || "Waiting for data..."}</span>
                   <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1 uppercase font-bold tracking-wider rounded-md">{state?.difficulty || "N/A"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl hover:border-primary/30 transition-all overflow-hidden relative group rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
            <CardHeader className="pb-4 border-b border-border/10 bg-background/20 relative z-10">
              <CardTitle className="text-sm font-bold tracking-wider uppercase flex items-center gap-2 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">
                <Zap className="h-5 w-5 animate-pulse" />
                Live AI Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative z-10">
               <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">LAST ACTION TAKEN</span>
                 <Badge variant="outline" className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-sm rounded-md">
                    {lastActionType}
                 </Badge>
               </div>
               <p className="text-base font-medium leading-relaxed text-muted-foreground border-l-4 border-yellow-500/50 pl-4 py-1">
                 "{lastReason}"
               </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl hover:border-primary/30 transition-all rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 bg-background/20 pb-6">
          <div className="max-w-2xl">
            <CardTitle className="flex items-center gap-3 text-xl tracking-tight font-bold text-foreground">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <History className="h-5 w-5" />
              </div>
              Agent Reasoning Log
            </CardTitle>
            <CardDescription className="mt-2 text-sm font-medium leading-relaxed">
              A step-by-step trace of what the AI decided to do, what target rollout it set, and exactly why it made that decision based on system health and latency.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0 max-h-[600px] overflow-y-auto custom-scrollbar">
             {recentDecisions.length > 0 ? (
               recentDecisions.map((step, i) => (
                 (() => {
                   const actionType = step.action?.action_type ?? "MAINTAIN";
                   const targetPercentage = step.action?.target_percentage ?? 0;
                   const reason = step.action?.reason ?? "No reasoning provided.";
                   return (
                 <div key={i} className="flex gap-6 border-b border-border/20 last:border-0 p-6 hover:bg-muted/10 transition-colors group">
                    <div className="flex flex-col items-center">
                       <div className="h-10 w-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-xs font-bold shadow-inner">
                          #{history.length - i}
                       </div>
                       <div className="flex-1 w-[2px] bg-border/50 my-3 group-hover:bg-primary/20 transition-colors" />
                    </div>
                    <div className="flex-1 space-y-4 pt-1">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <Badge className={cn(
                               "px-3 py-1 text-xs font-bold tracking-wider shadow-sm rounded-md",
                               getActionTypeString(step.action).includes("INCREASE") ? "bg-green-500 hover:bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]" :
                               getActionTypeString(step.action).includes("ROLLBACK") || getActionTypeString(step.action).includes("HALT") ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]" :
                               "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                             )}>
                                {getActionTypeString(step.action)}
                             </Badge>
                             <span className="text-base font-bold text-foreground/90">{String(getActionField(step.action, "target_percentage") ?? "—")}% Rollout Target</span>
                          </div>
                          <Badge variant="outline" className={cn(
                            "px-3 py-1 text-xs font-bold tracking-wider bg-background/80 shadow-sm rounded-md",
                            (step.reward ?? 0) > 0 ? "text-green-500 border-green-500/30" : "text-red-500 border-red-500/30"
                          )}>
                            REWARD: {(step.reward ?? 0) > 0 ? "+" : ""}{(step.reward ?? 0).toFixed(2)}
                          </Badge>
                       </div>
                       <div className="flex items-start gap-3 bg-muted/20 border border-border/40 p-4 rounded-xl shadow-inner">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-sm font-medium text-muted-foreground/90 leading-relaxed">
                             {getActionReasonString(step.action)}
                          </p>
                       </div>
                       <div className="flex flex-wrap items-center gap-6 pt-1">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/50 px-3 py-1.5 rounded-lg border border-border/30">
                             <Activity className="h-4 w-4 text-primary" />
                             Health: {(((step.observation?.system_health_score ?? 0) * 100)).toFixed(1)}%
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/50 px-3 py-1.5 rounded-lg border border-border/30">
                             <Zap className="h-4 w-4 text-yellow-500" />
                             Latency: {(step.observation?.latency_p99_ms ?? 0).toFixed(0)}ms
                          </div>
                       </div>
                    </div>
                 </div>
                   );
                 })()
               ))
             ) : (
               <div className="py-32 text-center flex flex-col items-center justify-center gap-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,transparent_50%)] pointer-events-none" />
                  <div className="h-24 w-24 rounded-2xl bg-muted/30 flex items-center justify-center border border-border/50 shadow-inner relative z-10">
                    <History className="h-10 w-10 text-muted-foreground opacity-50" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-foreground">No decisions logged yet</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto font-medium">Start the python backend script and watch the AI begin training and logging decisions here in real-time.</p>
                  </div>
               </div>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
