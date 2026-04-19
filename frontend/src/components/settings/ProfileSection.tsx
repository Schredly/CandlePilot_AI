"use client";

import { useEffect, useState, type FormEvent } from "react";
import { User } from "lucide-react";
import { useAuth } from "@/lib/auth/provider";

const inputCls =
  "w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

/**
 * Reads the current user from AuthContext, lets them edit name + email, and
 * writes back through updateUser. Status line shows "Saved" briefly after a
 * successful update so the interaction feels complete even though there's
 * no network round-trip yet.
 */
export function ProfileSection() {
  const { session, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    if (session) {
      setName(session.user.name);
      setEmail(session.user.email);
    }
  }, [session]);

  const dirty =
    !!session && (name.trim() !== session.user.name || email.trim() !== session.user.email);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !dirty) return;
    updateUser({ name: name.trim(), email: email.trim() });
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          <User className="w-10 h-10 text-primary" />
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          Change Avatar
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="block text-muted-foreground text-sm mb-2">
            Full Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="block text-muted-foreground text-sm mb-2">
            Email Address
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            autoComplete="email"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!dirty}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Save changes
          </button>
          {status === "saved" && (
            <span className="text-sm text-emerald-400" role="status">
              Saved.
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
