"use client";

import { useEffect, useRef, useState } from "react";
import type { Candle } from "@/lib/types";

export type LiveStatus = "connecting" | "open" | "reconnecting" | "closed";

interface CandleEvent {
  type: "candle.update" | "candle.closed";
  symbol: string;
  timeframe: string;
  candle: Candle;
}

interface UseLiveCandlesOptions {
  /** Initial series rendered before the WebSocket delivers its first tick. */
  initial?: Candle[];
  /** Override the resolved WebSocket URL. Mostly useful for tests. */
  url?: string;
}

function resolveWsUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_WS_URL;
  if (explicit) return explicit;
  if (typeof window === "undefined") return "ws://localhost:8000/ws";
  const { protocol, host } = window.location;
  const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
  return `${wsProtocol}//${host}/ws`;
}

/**
 * Live candle stream for (symbol, timeframe). Opens a WebSocket to the backend
 * feed, subscribes, and appends / updates the last bar as events arrive. On
 * socket drop it reconnects with exponential backoff (capped at 30s). Callers
 * can pass `initial` to render a series immediately while the first events land.
 */
export function useLiveCandles(
  symbol: string,
  timeframe: string,
  { initial = [], url }: UseLiveCandlesOptions = {},
): { candles: Candle[]; status: LiveStatus } {
  const [candles, setCandles] = useState<Candle[]>(initial);
  const [status, setStatus] = useState<LiveStatus>("connecting");

  // Keep the ref around so the cleanup branch can see the latest socket even
  // after a reconnect has replaced `ws`.
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let delay = 1000;
    const MAX_DELAY = 30_000;
    const target = url ?? resolveWsUrl();

    const connect = () => {
      if (cancelledRef.current) return;

      setStatus((current) => (current === "open" ? "open" : "connecting"));

      try {
        ws = new WebSocket(target);
      } catch {
        // Malformed URL or other sync failure — schedule a retry.
        scheduleReconnect();
        return;
      }

      ws.onopen = () => {
        delay = 1000;
        setStatus("open");
        ws?.send(JSON.stringify({ action: "subscribe", symbol, timeframe }));
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data) as CandleEvent | { type: string };
          if (msg.type === "candle.update" || msg.type === "candle.closed") {
            const { candle } = msg as CandleEvent;
            setCandles((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.time === candle.time) {
                // Same bar is still open — replace it.
                const next = prev.slice(0, -1);
                next.push(candle);
                return next;
              }
              return [...prev, candle];
            });
          }
        } catch {
          // Non-JSON or unexpected shape — ignore.
        }
      };

      ws.onclose = () => {
        if (cancelledRef.current) return;
        setStatus("reconnecting");
        scheduleReconnect();
      };

      ws.onerror = () => {
        // Let `onclose` drive the reconnect; just close if still open.
        try {
          ws?.close();
        } catch {
          // Socket already torn down.
        }
      };
    };

    const scheduleReconnect = () => {
      if (cancelledRef.current) return;
      reconnectTimer = setTimeout(() => {
        connect();
        delay = Math.min(MAX_DELAY, delay * 2);
      }, delay);
    };

    connect();

    return () => {
      cancelledRef.current = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: "unsubscribe", symbol, timeframe }));
          }
          ws.close();
        } catch {
          // ignore — socket may already be in a terminal state
        }
      }
      setStatus("closed");
    };
  }, [symbol, timeframe, url]);

  return { candles, status };
}
