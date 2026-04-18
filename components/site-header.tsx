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
          TeacherFinder
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-[var(--ink-soft)]">
          <Link href="/teachers">Muellimler</Link>
          <Link href="/become-teacher">Muellim ol</Link>
          {ready && user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profile">Profil</Link>
              <button type="button" onClick={clearAuth} className="rounded-full border px-3 py-1">
                Cixis
              </button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
