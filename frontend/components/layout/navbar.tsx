"use client";

import { Bell, Search, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useEnv } from "@/components/env-provider";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Navbar() {
  const { state } = useEnv();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const lastObs = state?.history?.[state.history.length - 1]?.observation;
  const tenantId = String(
    (lastObs?.extra_context as Record<string, unknown> | undefined)?.tenant_id ?? "Global"
  );

  // Keyboard shortcut listener for ⌘K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="relative hidden lg:flex items-center group cursor-text" onClick={() => setOpen(true)}>
              <Search className="absolute left-4 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="flex h-11 w-72 items-center justify-between rounded-lg border border-border/40 bg-background/50 pl-10 pr-4 text-sm text-muted-foreground shadow-inner transition-all group-hover:border-primary/50 group-hover:bg-background group-hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <span className="font-medium tracking-wide">Search commands...</span>
                <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded bg-muted/80 px-2 font-mono text-[11px] font-bold opacity-100 border border-border/50 text-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-3xl shadow-2xl">
            <DialogHeader className="sr-only">
              <DialogTitle>Command Palette</DialogTitle>
              <DialogDescription>Search for commands and settings</DialogDescription>
            </DialogHeader>
            <div className="flex items-center border-b border-border/40 px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <input 
                type="text" 
                placeholder="Type a command or search..." 
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
              {searchQuery.length > 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found for "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Suggestions</div>
                  <button className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setOpen(false)}>
                    <Globe className="h-4 w-4 text-primary" /> Review Active Feature Flags
                  </button>
                  <button className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setOpen(false)}>
                    <Bell className="h-4 w-4 text-amber-500" /> View Incident Alerts
                  </button>
                  <button className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setOpen(false)}>
                    <Shield className="h-4 w-4 text-green-500" /> Platform Security Settings
                  </button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
