"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthContextValue, AuthSession, AuthUser } from "./types";
import { clearSession, readSession, writeSession } from "./storage";

const AuthContext = createContext<AuthContextValue | null>(null);

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `u_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function generateToken(): string {
  return `mock.${Math.random().toString(36).slice(2)}.${Date.now()}`;
}

/** Email → friendly name — "alex.morgan@…" → "Alex Morgan". */
function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ") || email;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(readSession());
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) throw new Error("Email is required.");
    if (!password) throw new Error("Password is required.");

    // Placeholder: accept any credentials. Real implementation lives in the
    // auth provider SDK (Clerk / Supabase / our own backend) and validates.
    const newSession: AuthSession = {
      user: {
        id: generateId(),
        name: displayNameFromEmail(trimmedEmail),
        email: trimmedEmail,
      },
      token: generateToken(),
      issuedAt: Math.floor(Date.now() / 1000),
    };
    setSession(newSession);
    writeSession(newSession);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (!trimmedName) throw new Error("Name is required.");
    if (!trimmedEmail) throw new Error("Email is required.");
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters.");

    const newSession: AuthSession = {
      user: {
        id: generateId(),
        name: trimmedName,
        email: trimmedEmail,
      },
      token: generateToken(),
      issuedAt: Math.floor(Date.now() / 1000),
    };
    setSession(newSession);
    writeSession(newSession);
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    clearSession();
  }, []);

  const updateUser = useCallback(
    (patch: Partial<Pick<AuthUser, "name" | "email" | "avatarUrl">>) => {
      setSession((prev) => {
        if (!prev) return prev;
        const next: AuthSession = {
          ...prev,
          user: { ...prev.user, ...patch },
        };
        writeSession(next);
        return next;
      });
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ session, loading, signIn, signUp, signOut, updateUser }),
    [session, loading, signIn, signUp, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}

export function useInitials(): string {
  const { session } = useAuth();
  if (!session) return "?";
  const parts = session.user.name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return session.user.email.slice(0, 2).toUpperCase();
  const first = parts[0]?.charAt(0) ?? "";
  const second = parts[parts.length - 1]?.charAt(0) ?? "";
  return (first + (parts.length > 1 ? second : "")).toUpperCase();
}
