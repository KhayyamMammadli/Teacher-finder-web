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
    default: "TeacherFinder | Azerbaycanda muellim axtar",
    template: "%s | TeacherFinder",
  },
  description:
    "Fenn, qiymet, reytinq ve lokasiyaya gore muellim tapin. Profilleri muqayise edin ve tez rezerv edin.",
  openGraph: {
    title: "TeacherFinder",
    description:
      "Fenn, qiymet, reytinq ve lokasiyaya gore muellim tapin. Profilleri muqayise edin ve tez rezerv edin.",
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
              TeacherFinder - SEO trafiki rezervasiya cevirmesine yonelen platforma.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
