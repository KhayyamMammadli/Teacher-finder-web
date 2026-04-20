import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "AzStore | Azərbaycan Instagram Marketplace",
    template: "%s | AzStore",
  },
  description:
    "Azərbaycanın Instagram mağazalarını bir platformada tap. Geyim, kosmetika, elektronika — filtrlə, axtar, WhatsApp ilə sifariş ver.",
  openGraph: {
    title: "AzStore",
    description: "Azərbaycanın Instagram mağazaları bir yerdə",
    type: "website",
    locale: "az_AZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="az"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--paper)] text-[var(--ink)]">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
              <footer className="border-t border-black/10 px-4 py-8 text-center text-sm text-[var(--ink-soft)] sm:px-6">
              AzStore © 2026 — Azərbaycanın Instagram mağazaları bir yerdə.
              <span className="mx-3">·</span>
              <a href="/register-shop" className="text-[var(--brand-strong)] hover:underline">Mağaza aç</a>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
