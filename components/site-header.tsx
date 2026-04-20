"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function SiteHeader() {
  const { user, ready, init, clearAuth } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--ink)]">
          <span className="bg-gradient-to-r from-[var(--brand-strong)] to-[var(--accent)] bg-clip-text text-transparent">AzStore</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-[var(--ink-soft)]">
          <Link href="/shops">Mağazalar</Link>
          <Link href="/products">Məhsullar</Link>
          <Link href="/register-shop" className="hidden sm:block">Satıcı ol</Link>
          {ready && user ? (
            <>
              <Link href="/dashboard" className="rounded-full border border-[var(--brand)] px-3 py-1 text-[var(--brand-strong)]">Panel</Link>
              <button type="button" onClick={clearAuth} className="rounded-full border px-3 py-1">
                Çıxış
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary px-4 py-1.5 text-sm">Instagram ilə daxil ol</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
