import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth/provider";
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

/**
 * Root layout wraps every route — authenticated and unauthenticated — in the
 * AuthProvider + dark theme. The AppShell (sidebar, top bar, mobile nav)
 * lives one level deeper in app/(protected)/layout.tsx so the login/register
 * pages don't render surrounded by chrome they can't navigate.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-[#060609]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
