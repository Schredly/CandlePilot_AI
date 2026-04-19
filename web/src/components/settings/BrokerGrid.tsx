"use client";

import { useState } from "react";
import { BrokerCard } from "./BrokerCard";

type BrokerKey = "alpaca" | "tdAmeritrade" | "interactiveBrokers" | "robinhood";

const brokers: { key: BrokerKey; name: string; logo: string }[] = [
  { key: "alpaca", name: "Alpaca", logo: "🦙" },
  { key: "tdAmeritrade", name: "TD Ameritrade", logo: "📊" },
  { key: "interactiveBrokers", name: "Interactive Brokers", logo: "🏦" },
  { key: "robinhood", name: "Robinhood", logo: "🎯" },
];

type BrokerConnectionState = Record<BrokerKey, boolean>;

const defaultState: BrokerConnectionState = {
  alpaca: true,
  tdAmeritrade: false,
  interactiveBrokers: false,
  robinhood: false,
};

export function BrokerGrid() {
  const [connections, setConnections] = useState<BrokerConnectionState>(defaultState);
  const toggle = (key: BrokerKey) =>
    setConnections((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {brokers.map((b) => (
        <BrokerCard
          key={b.key}
          name={b.name}
          logo={b.logo}
          connected={connections[b.key]}
          onToggle={() => toggle(b.key)}
        />
      ))}
    </div>
  );
}
