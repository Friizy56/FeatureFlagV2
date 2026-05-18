"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api, DashboardData, State } from "@/lib/api";

export interface CustomFlag {
  id: string;
  name: string;
  rollout: number;
  status: boolean;
  scenario: string;
  difficulty: string;
  lastUpdated: string;
  createdAt: string;
  description: string;
  rules: string;
}

interface EnvContextType {
  dashboard: DashboardData | null;
  state: State | null;
  connectionState: "connected" | "disconnected" | "checking";
  connectionText: string;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  runSimulationStep: () => Promise<void>;
  fetchData: () => Promise<void>;
  customFlags: CustomFlag[];
  addCustomFlag: (flag: Omit<CustomFlag, "id" | "lastUpdated" | "createdAt">) => void;
  updateCustomFlag: (id: string, updates: Partial<CustomFlag>) => void;
  deleteCustomFlag: (id: string) => void;
  activeCustomFlagId: string | null;
  setActiveCustomFlagId: (id: string | null) => void;
  agentType: string;
  setAgentType: (val: string) => void;
}

const EnvContext = createContext<EnvContextType | undefined>(undefined);

export const EnvProvider = ({ children }: { children: ReactNode }) => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [state, setState] = useState<State | null>(null);
  const [connectionState, setConnectionState] = useState<"connected" | "disconnected" | "checking">("checking");
  const [connectionText, setConnectionText] = useState("Checking Connection...");
  const [isSimulating, setIsSimulating] = useState(false);
  const [agentType, setAgentTypeState] = useState<string>("llm");

  const [customFlags, setCustomFlags] = useState<CustomFlag[]>([]);
  const [activeCustomFlagId, setActiveCustomFlagIdState] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("custom_feature_flags");
      if (stored) {
        setCustomFlags(JSON.parse(stored));
      } else {
        const initialCustom: CustomFlag[] = [
          {
            id: "flag-checkout-v2",
            name: "NextGen Checkout Flow",
            rollout: 50,
            status: true,
            scenario: "Staging Environment",
            difficulty: "High Complexity",
            lastUpdated: "Just now",
            createdAt: new Date().toISOString(),
            description: "Redesigned one-click checkout experience with Stripe Elements and AI fraud detection.",
            rules: "Targeting US & EU Beta Cohorts",
          },
          {
            id: "flag-ai-recommendations",
            name: "AI Product Recommendations",
            rollout: 15,
            status: true,
            scenario: "Production",
            difficulty: "Medium Complexity",
            lastUpdated: "2 hours ago",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            description: "Personalized product carousels powered by Vertex AI matching engine.",
            rules: "Targeting 15% random traffic",
          }
        ];
        setCustomFlags(initialCustom);
        localStorage.setItem("custom_feature_flags", JSON.stringify(initialCustom));
      }

      const activeId = localStorage.getItem("active_custom_flag_id");
      if (activeId) {
        setActiveCustomFlagIdState(activeId);
      }

      const storedAgent = localStorage.getItem("feature_flag_copilot_agent_type");
      if (storedAgent) {
        setAgentTypeState(storedAgent);
      }
    } catch (e) {
      console.error("Failed to load custom flags from localStorage", e);
    }
  }, []);

  const addCustomFlag = useCallback((flagData: Omit<CustomFlag, "id" | "lastUpdated" | "createdAt">) => {
    const newFlag: CustomFlag = {
      ...flagData,
      id: `flag-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      lastUpdated: "Just now",
      createdAt: new Date().toISOString(),
    };
    setCustomFlags(prev => {
      const updated = [newFlag, ...prev];
      try { localStorage.setItem("custom_feature_flags", JSON.stringify(updated)); } catch(e){}
      return updated;
    });
    setActiveCustomFlagIdState(newFlag.id);
    try { localStorage.setItem("active_custom_flag_id", newFlag.id); } catch(e){}
  }, []);

  const updateCustomFlag = useCallback((id: string, updates: Partial<CustomFlag>) => {
    setCustomFlags(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, ...updates, lastUpdated: "Just now" } : f);
      try { localStorage.setItem("custom_feature_flags", JSON.stringify(updated)); } catch(e){}
      return updated;
    });
  }, []);

  const deleteCustomFlag = useCallback((id: string) => {
    setCustomFlags(prev => {
      const updated = prev.filter(f => f.id !== id);
      try { localStorage.setItem("custom_feature_flags", JSON.stringify(updated)); } catch(e){}
      return updated;
    });
    setActiveCustomFlagIdState(prevActive => {
      if (prevActive === id) {
        try { localStorage.removeItem("active_custom_flag_id"); } catch(e){}
        return null;
      }
      return prevActive;
    });
  }, []);

  const setActiveCustomFlagId = useCallback((id: string | null) => {
    setActiveCustomFlagIdState(id);
    try {
      if (id) localStorage.setItem("active_custom_flag_id", id);
      else localStorage.removeItem("active_custom_flag_id");
    } catch(e){}
  }, []);

  const setAgentType = useCallback((type: string) => {
    setAgentTypeState(type);
    try { localStorage.setItem("feature_flag_copilot_agent_type", type); } catch(e){}
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [dashData, stateData] = await Promise.all([
        api.getDashboard(),
        api.getState(),
      ]);
      setDashboard(dashData);
      setState(stateData);
      setConnectionState("connected");
      setConnectionText("Connected");
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setConnectionState("disconnected");
      setConnectionText("Disconnected");
    }
  }, []);

  const runSimulationStep = useCallback(async () => {
    if (!state) return;
    try {
      await api.copilotStep(agentType);
      await fetchData();
    } catch (error) {
      console.error("Simulation step failed:", error);
      setIsSimulating(false);
    }
  }, [state, fetchData, agentType]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <EnvContext.Provider
      value={{
        dashboard,
        state,
        connectionState,
        connectionText,
        isSimulating,
        setIsSimulating,
        runSimulationStep,
        fetchData,
        customFlags,
        addCustomFlag,
        updateCustomFlag,
        deleteCustomFlag,
        activeCustomFlagId,
        setActiveCustomFlagId,
        agentType,
        setAgentType,
      }}
    >
      {children}
    </EnvContext.Provider>
  );
};

export const useEnv = () => {
  const context = useContext(EnvContext);
  if (context === undefined) {
    throw new Error("useEnv must be used within an EnvProvider");
  }
  return context;
};
