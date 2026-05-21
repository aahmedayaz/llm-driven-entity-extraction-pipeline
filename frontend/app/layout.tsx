import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { DevChunkRecovery } from "@/components/DevChunkRecovery";
import { Providers } from "@/app/providers";
import { AppShell } from "@/components/v2/AppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ralico Property AI | Team Ralico",
  description:
    "Property survey, UK postcode insights, EPC and solar assessment — v2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full font-sans`}
      >
        <DevChunkRecovery />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
