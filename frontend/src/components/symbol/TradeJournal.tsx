"use client";

import { useState } from "react";
import { Save, Edit3 } from "lucide-react";

interface TradeJournalProps {
  defaultNotes?: string;
}

const FALLBACK_NOTES =
  "Market showing strong bullish momentum after bouncing from key support. Entry taken on confirmation with tight stop below recent low.";

export function TradeJournal({ defaultNotes = FALLBACK_NOTES }: TradeJournalProps) {
  const [notes, setNotes] = useState(defaultNotes);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="border border-zinc-800 rounded-xl p-5 bg-zinc-950/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm text-white">Trade Journal</h3>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs transition-colors"
        >
          {isEditing ? (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={!isEditing}
        className="w-full h-24 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none disabled:opacity-60"
        placeholder="Add notes about this trade setup…"
      />
    </section>
  );
}
