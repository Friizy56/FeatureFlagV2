"use client";

import { Bell, Search, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useEnv } from "@/components/env-provider";

export function Navbar() {
  const { state } = useEnv();

  const lastObs = state?.history?.[state.history.length - 1]?.observation;
  const tenantId = String(
    (lastObs?.extra_context as Record<string, unknown> | undefined)?.tenant_id ?? "Global"
  );

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border/10 bg-card/40 px-8 backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="rounded-md bg-indigo-500/10 text-indigo-400 border-indigo-500/30 gap-2 px-3 py-1.5 font-bold uppercase tracking-wider shadow-sm flex items-center">
             <Globe className="h-3.5 w-3.5 inline mr-1.5" />
             {state?.scenario_name || "Production"}
          </Badge>
          <Badge variant="outline" className="rounded-md bg-amber-500/10 text-amber-500 border-amber-500/30 gap-2 px-3 py-1.5 font-bold uppercase tracking-wider shadow-sm flex items-center">
             <Shield className="h-3.5 w-3.5 inline mr-1.5" />
             Tenant: {tenantId}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:flex items-center group cursor-text" onClick={() => {}}>
          <Search className="absolute left-4 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="flex h-11 w-72 items-center justify-between rounded-lg border border-border/40 bg-background/50 pl-10 pr-4 text-sm text-muted-foreground shadow-inner transition-all group-hover:border-primary/50 group-hover:bg-background group-hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <span className="font-medium tracking-wide">Search commands...</span>
            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded bg-muted/80 px-2 font-mono text-[11px] font-bold opacity-100 border border-border/50 text-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-lg">
          <Bell className="h-5 w-5" />
          {lastObs?.chaos_incident && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-ping" />
          )}
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
