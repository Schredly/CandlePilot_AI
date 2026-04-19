import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CandlePilot AI",
    template: "%s — CandlePilot AI",
  },
  description:
    "Real-time candlestick analyzer. Identify setups, patterns, and opportunities with confidence scoring.",
  applicationName: "CandlePilot AI",
};

export const viewport: Viewport = {
  themeColor: "#060609",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-[#060609]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
