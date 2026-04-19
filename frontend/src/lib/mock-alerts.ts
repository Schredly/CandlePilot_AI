/**
 * Alerts mock data + types.
 *
 * `AlertEvent` covers both the "New" and "Triggered" tab — they're the same
 * shape; what differs is which list a row lives in. `SavedRule` is a persisted
 * alert configuration; rules trigger, events result.
 */

export type AlertSignalType = "bullish" | "breakout" | "bearish" | "reversal";

export interface AlertEvent {
  id: string;
  symbol: string;
  signalType: AlertSignalType;
  time: string;
  confidence: number;
  price?: string;
  change?: string;
  isNew?: boolean;
}

export interface SavedRule {
  id: string;
  symbol: string;
  signalType: AlertSignalType;
  targetPrice?: string;
  minConfidence: number;
  isActive: boolean;
  notificationChannels: string[];
}

/** Shape submitted by the create-alert form — the store assigns the id. */
export interface AlertRuleDraft {
  symbol: string;
  signalType: AlertSignalType;
  targetPrice?: string;
  minConfidence: number;
  notificationChannels: string[];
}

export const mockNewAlerts: AlertEvent[] = [
  { id: "ev_new_1", symbol: "BTC/USDT", signalType: "bullish",  time: "2 min ago",  confidence: 92, price: "$68,450", change: "+2.4%", isNew: true },
  { id: "ev_new_2", symbol: "ETH/USDT", signalType: "breakout", time: "5 min ago",  confidence: 87, price: "$3,245",  change: "+3.1%", isNew: true },
  { id: "ev_new_3", symbol: "SOL/USDT", signalType: "bullish",  time: "12 min ago", confidence: 78, price: "$142.50", change: "+1.8%", isNew: true },
];

export const mockTriggeredAlerts: AlertEvent[] = [
  { id: "ev_tri_1", symbol: "BTC/USDT",   signalType: "reversal", time: "1 hour ago",  confidence: 85, price: "$67,890", change: "-0.8%" },
  { id: "ev_tri_2", symbol: "MATIC/USDT", signalType: "bearish",  time: "2 hours ago", confidence: 73, price: "$0.82",   change: "-1.5%" },
  { id: "ev_tri_3", symbol: "AVAX/USDT",  signalType: "breakout", time: "3 hours ago", confidence: 81, price: "$38.20",  change: "+4.2%" },
  { id: "ev_tri_4", symbol: "DOT/USDT",   signalType: "bullish",  time: "5 hours ago", confidence: 69, price: "$7.45",   change: "+2.1%" },
];

export const mockSavedRules: SavedRule[] = [
  { id: "r_1", symbol: "BTC/USDT",   signalType: "bullish",  targetPrice: "$70,000", minConfidence: 80, isActive: true,  notificationChannels: ["Push", "Email"] },
  { id: "r_2", symbol: "ETH/USDT",   signalType: "breakout", targetPrice: "$3,500",  minConfidence: 75, isActive: true,  notificationChannels: ["Push"] },
  { id: "r_3", symbol: "SOL/USDT",   signalType: "bearish",                          minConfidence: 70, isActive: false, notificationChannels: ["Email", "SMS"] },
  { id: "r_4", symbol: "MATIC/USDT", signalType: "reversal", targetPrice: "$1.00",   minConfidence: 65, isActive: true,  notificationChannels: ["Push"] },
];
