"use client";

import { useCallback, useEffect, useState } from "react";
import {
  mockNewAlerts,
  mockSavedRules,
  mockTriggeredAlerts,
  type AlertEvent,
  type AlertRuleDraft,
  type SavedRule,
} from "@/lib/mock-alerts";

interface AlertsState {
  newAlerts: AlertEvent[];
  triggeredAlerts: AlertEvent[];
  rules: SavedRule[];
}

const STORAGE_KEY = "cp.alerts.v1";

const DEFAULT_STATE: AlertsState = {
  newAlerts: mockNewAlerts,
  triggeredAlerts: mockTriggeredAlerts,
  rules: mockSavedRules,
};

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readFromStorage(): AlertsState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AlertsState;
  } catch {
    return null;
  }
}

function writeToStorage(state: AlertsState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage blocked — silently drop; state still lives in memory.
  }
}

/**
 * Client-only mock persistence for the Alerts Center. Initial render uses
 * DEFAULT_STATE (so SSR matches), then hydrates from localStorage after mount.
 * CP-008+ replaces these actions with API calls — callers only know the shape.
 */
export function useAlertsStore() {
  const [state, setState] = useState<AlertsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readFromStorage();
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeToStorage(state);
  }, [state, hydrated]);

  const createRule = useCallback((draft: AlertRuleDraft) => {
    setState((prev) => ({
      ...prev,
      rules: [
        { id: generateId(), isActive: true, ...draft },
        ...prev.rules,
      ],
    }));
  }, []);

  const toggleRule = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      rules: prev.rules.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)),
    }));
  }, []);

  const deleteRule = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      rules: prev.rules.filter((r) => r.id !== id),
    }));
  }, []);

  const dismissNewAlert = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      newAlerts: prev.newAlerts.filter((a) => a.id !== id),
    }));
  }, []);

  const deleteTriggeredAlert = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      triggeredAlerts: prev.triggeredAlerts.filter((a) => a.id !== id),
    }));
  }, []);

  const resetToMocks = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    ...state,
    hydrated,
    createRule,
    toggleRule,
    deleteRule,
    dismissNewAlert,
    deleteTriggeredAlert,
    resetToMocks,
  };
}
