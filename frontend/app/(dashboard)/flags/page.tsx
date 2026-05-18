"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Plus, Play, Trash2, Flag, Sliders, ExternalLink, CheckCircle2, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEnv } from "@/components/env-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function FeatureFlagsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { state, customFlags, addCustomFlag, deleteCustomFlag, activeCustomFlagId, setActiveCustomFlagId } = useEnv();

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newRollout, setNewRollout] = useState("50");
  const [newScenario, setNewScenario] = useState("Production");
  const [newDiff, setNewDiff] = useState("Medium Complexity");
  const [newRules, setNewRules] = useState("Targeting All Traffic");

  const backendFlag = useMemo(() => {
    const lastObs = state?.history?.[state.history.length - 1]?.observation;
    if (!lastObs) return null;
    return {
      id: lastObs.feature_name,
      name: lastObs.feature_name.replace(/_/g, " "),
      rollout: lastObs.current_rollout_percentage,
      status: !(state?.is_done ?? false),
      scenario: state?.scenario_name ?? "Simulation Baseline",
      difficulty: state?.difficulty ?? "Normal",
      lastUpdated: `Step ${state?.step_count ?? 0}`,
      description: "Autonomous Python simulation feature flag managed by AI Copilot.",
      rules: "AI Controlled Cohort",
      createdAt: new Date().toISOString(),
      isBackend: true,
    };
  }, [state]);

  const allFlags = useMemo(() => {
    const list = [...customFlags.map(f => ({ ...f, isBackend: false }))];
    if (backendFlag) { list.push(backendFlag); }
    return list;
  }, [customFlags, backendFlag]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allFlags;
    return allFlags.filter(f => f.id.toLowerCase().includes(q) || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
  }, [allFlags, searchQuery]);

  const handleCreateFlag = () => {
    addCustomFlag({
      name: newName.trim() || "Untitled Feature Flag",
      description: newDesc.trim() || "User-created custom feature flag targeting specific cohorts.",
      rollout: Number(newRollout) || 50,
      status: true,
      scenario: newScenario,
      difficulty: newDiff,
      rules: newRules,
    });
    setIsCreateOpen(false);
    setNewName("");
    setNewDesc("");
    setNewRollout("50");
  };

  return (
    <div className="flex-1 space-y-10 p-8 max-w-[1600px] mx-auto font-sans relative">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/30 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground">Registry</span>
            <span className="text-border">/</span>
            <span className="text-primary">Global Controller</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-foreground via-purple-600 to-indigo-600 dark:from-white dark:via-purple-200 dark:to-indigo-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]">
            Feature Flags
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            Create custom feature flags, define targeting rules, and run live AI Copilot rollout simulations instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button 
            variant="default" 
            size="lg" 
            onClick={() => setIsCreateOpen(true)}
            className="rounded-lg gap-3 px-7 py-6 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-300"
          >
            <Plus className="h-5 w-5 stroke-[3]" /> Create Feature Flag
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => router.push("/monitoring")}
            className="rounded-lg px-6 py-6 text-sm font-bold bg-background/60 backdrop-blur-xl border-border/60 hover:bg-background hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 shadow-sm"
          >
            View Telemetry
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search flags by name, ID, or description..." 
            className="pl-14 py-6 text-base font-semibold rounded-xl bg-card/60 backdrop-blur-2xl border-border/60 shadow-md focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Flag Grid */}
      <div className="grid gap-6 mt-8 relative z-10">
        {filtered.map((flag) => {
          const isCurrentlyActive = flag.isBackend 
            ? (state ? !(state.is_done ?? false) : false) 
            : (activeCustomFlagId ? flag.id === activeCustomFlagId : false);

          return (
            <Card 
              key={flag.id} 
              className={cn(
                "glassy-card transition-all duration-300 cursor-pointer group relative overflow-hidden shadow-xl rounded-2xl",
                isCurrentlyActive 
                  ? "bg-gradient-to-br from-card/90 via-card/60 to-primary/[0.05] border-primary/50 shadow-2xl shadow-primary/10" 
                  : "bg-gradient-to-br from-card/80 via-card/40 to-background/40 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1"
              )}
              onClick={() => router.push(`/flags/${flag.id}`)}
            >
              {isCurrentlyActive && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary animate-pulse shadow-[0_0_20px_rgba(139,92,246,1)]" />
              )}
              <CardContent className="p-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8">
                <div className="flex-1 space-y-3.5 pl-2">
                  <div className="flex flex-wrap items-center gap-3.5">
                    <h3 className="font-black text-3xl tracking-tight text-foreground group-hover:text-primary transition-colors">{flag.name}</h3>
                    
                    {isCurrentlyActive && (
                      <Badge variant="default" className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-sm shadow-primary/30 animate-pulse flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white animate-ping" /> RUNNING LIVE
                      </Badge>
                    )}

                    <Badge variant={flag.status ? "secondary" : "outline"} className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md border border-border/40">
                      {flag.status ? "Active Evaluation" : "Paused"}
                    </Badge>

                    <Badge variant="outline" className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary/10 border-primary/30 text-primary shadow-sm backdrop-blur-md">
                      {flag.rollout}% Rollout Target
                    </Badge>

                    {flag.isBackend && (
                      <Badge variant="outline" className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-sm backdrop-blur-md">
                        Python Sim
                      </Badge>
                    )}
                  </div>

                  <p className="text-base font-semibold text-muted-foreground/90 max-w-4xl leading-relaxed">
                    {flag.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-bold text-muted-foreground border-t border-border/20">
                    <span className="flex items-center gap-2 mt-3">
                      <Zap className="w-4 h-4 text-primary" /> Scenario: <span className="text-foreground">{flag.scenario}</span>
                    </span>
                    <span className="flex items-center gap-2 mt-3">
                      <Sliders className="w-4 h-4 text-indigo-400" /> Complexity: <span className="text-foreground">{flag.difficulty}</span>
                    </span>
                    <span className="flex items-center gap-2 mt-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400" /> Rules: <span className="text-foreground">{flag.rules}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 border-t md:border-t-0 pt-6 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex flex-col items-start md:items-end pl-2 md:pl-0">
                    <span className="text-lg font-black text-foreground">{flag.lastUpdated}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Evaluation Cycle</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {!isCurrentlyActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg font-bold px-5 py-4 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border-primary/30 shadow-sm hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCustomFlagId(flag.id);
                        }}
                      >
                        <Play className="h-4 w-4 fill-current" /> Run Flag
                      </Button>
                    )}

                    {!flag.isBackend && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground text-destructive h-10 w-10 transition-all shadow-sm z-10 border border-destructive/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomFlag(flag.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/80 hover:bg-primary hover:text-primary-foreground border border-border/60 shadow-sm h-10 w-10 rounded-lg z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/flags/${flag.id}`);
                      }}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card className="border-border/60 bg-card/40 backdrop-blur-2xl p-16 text-center rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center border border-border/60 shadow-inner">
                <Flag className="w-8 h-8 text-muted-foreground opacity-40 animate-pulse" />
              </div>
              <p className="text-xl font-black text-foreground tracking-tight">No feature flags found</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">
                No flags match your search query. Try adjusting your filters or create a new custom feature flag.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Flag Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[650px] bg-card/90 backdrop-blur-3xl border-border/80 shadow-2xl rounded-3xl p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <Plus className="h-6 w-6 stroke-[3]" />
              </div>
              Create Custom Feature Flag
            </DialogTitle>
            <DialogDescription className="text-base font-semibold text-muted-foreground mt-2">
              Define targeting rules, initial rollout percentage, and simulation environment for your new feature flag.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Flag Name</Label>
              <Input 
                placeholder="e.g. Redesigned Checkout Experience" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className="py-6 text-base font-bold rounded-xl bg-background/60 border-border/60 shadow-inner focus-visible:ring-primary/50"
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Input 
                placeholder="e.g. Enable one-click Apple Pay and Stripe Elements for beta cohorts." 
                value={newDesc} 
                onChange={(e) => setNewDesc(e.target.value)}
                className="py-6 text-base font-semibold rounded-xl bg-background/60 border-border/60 shadow-inner focus-visible:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Initial Rollout (%)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={newRollout} 
                  onChange={(e) => setNewRollout(e.target.value)}
                  className="py-6 text-base font-bold rounded-xl bg-background/60 border-border/60 shadow-inner focus-visible:ring-primary/50"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Scenario</Label>
                <Input 
                  placeholder="e.g. Staging Environment" 
                  value={newScenario} 
                  onChange={(e) => setNewScenario(e.target.value)}
                  className="py-6 text-base font-bold rounded-xl bg-background/60 border-border/60 shadow-inner focus-visible:ring-primary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Complexity Profile</Label>
                <Input 
                  placeholder="e.g. High Complexity" 
                  value={newDiff} 
                  onChange={(e) => setNewDiff(e.target.value)}
                  className="py-6 text-base font-bold rounded-xl bg-background/60 border-border/60 shadow-inner focus-visible:ring-primary/50"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Targeting Rules</Label>
                <Input 
                  placeholder="e.g. US & EU Beta Cohorts" 
                  value={newRules} 
                  onChange={(e) => setNewRules(e.target.value)}
                  className="py-6 text-base font-bold rounded-xl bg-background/60 border-border/60 shadow-inner focus-visible:ring-primary/50"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4 border-t border-border/20">
            <Button 
              variant="outline" 
              onClick={() => setIsCreateOpen(false)}
              className="rounded-xl px-7 py-6 font-bold bg-background/60 border-border/60 shadow-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFlag}
              className="rounded-xl px-8 py-6 font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/20"
            >
              Deploy Feature Flag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
