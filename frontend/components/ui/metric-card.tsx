"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  description?: string;
  className?: string;
}

export function MetricCard({ title, value, icon, trend, description, className }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className={cn("glassy-card relative overflow-hidden h-full transition-all hover:border-primary/30", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm md:text-base font-bold tracking-widest uppercase text-muted-foreground/80">{title}</p>
            {icon && <div className="text-primary [&>svg]:w-6 [&>svg]:h-6 bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">{icon}</div>}
          </div>
          
          <div className="mt-6 flex items-baseline gap-3">
            <h2 className="text-5xl font-black tracking-tighter text-glow">{value}</h2>
            
            {trend && (
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-md border",
                  trend.isPositive === true
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : trend.isPositive === false
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : "bg-muted text-muted-foreground border-border"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          
          {description && (
             <p className="mt-2 text-xs font-medium text-muted-foreground border-l-2 border-primary/40 pl-2">
                {description}
             </p>
          )}
          {!description && trend && trend.label && (
            <p className="mt-2 text-xs text-muted-foreground">
              {trend.label}
            </p>
          )}
        </CardContent>
        
        {/* Subtle bottom accent line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </Card>
    </motion.div>
  );
}
