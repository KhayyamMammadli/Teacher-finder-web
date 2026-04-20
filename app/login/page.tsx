"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { exchangeInstagramAuthCode, getInstagramLoginUrl, login } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [adminMode, setAdminMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => login(payload.email, payload.password),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/dashboard");
    },
    onError: () => {
      setError("Admin email ve ya sifre sehvdir.");
    },
  });

  const exchangeMutation = useMutation({
    mutationFn: async (code: string) => exchangeInstagramAuthCode(code),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.replace("/dashboard");
    },
    onError: (mutationError) => {
      setError(mutationError instanceof Error ? mutationError.message : "Instagram login ugursuz oldu.");
      router.replace("/login");
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAuthCode(params.get("auth_code"));
    setAuthError(params.get("auth_error"));
  }, []);

  useEffect(() => {
    if (authError) {
      setError(authError);
      router.replace("/login");
    }
  }, [authError, router]);

  useEffect(() => {
    if (authCode && !exchangeMutation.isPending && !exchangeMutation.isSuccess) {
      exchangeMutation.mutate(authCode);
    }
  }, [authCode, exchangeMutation]);

  async function startInstagramLogin() {
    setError("");
    setSuccess("");
    try {
      const url = await getInstagramLoginUrl("seller-login");
      window.location.href = url;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Instagram login baslamadi.");
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    loginMutation.mutate({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr,0.9fr]">
        <section className="card border-[var(--brand)]/20 p-6 sm:p-8">
          <p className="mb-3 inline-flex rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/5 px-3 py-1 text-xs font-semibold text-[var(--brand-strong)]">
            Satıcı girişi
          </p>
          <h1 className="text-3xl font-black tracking-tight">Instagram ilə başla</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
            Satıcı ayrıca hesab yaratmır. Instagram Business hesabı ilə daxil olur, sonra mağaza məlumatlarını bir dəfə tamamlayır.
          </p>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-[var(--ink-soft)]">
            <p className="font-semibold text-[var(--ink)]">Nə lazımdır?</p>
            <p className="mt-2">Instagram Business və ya Creator hesabı Facebook Page ilə bağlı olmalıdır.</p>
          </div>

          <button
            type="button"
            onClick={startInstagramLogin}
            disabled={exchangeMutation.isPending}
            className="btn-primary mt-6 flex w-full items-center justify-center gap-2 py-3 text-base"
          >
            {exchangeMutation.isPending ? "Daxil olunur..." : "Instagram ilə daxil ol"}
          </button>

          <p className="mt-3 text-xs text-[var(--ink-soft)]">
            Sistem Instagram hesabınızı tanıyıb satıcı profilinizi avtomatik yaradır.
          </p>

          {success && <p className="mt-4 text-sm text-green-700">{success}</p>}
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        </section>

        <aside className="card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Admin girişi</h2>
              <p className="text-xs text-[var(--ink-soft)]">Admin panel yalnız email və şifrə ilə qalır.</p>
            </div>
            <button
              type="button"
              onClick={() => setAdminMode((current) => !current)}
              className="btn-secondary px-4 py-2 text-xs"
            >
              {adminMode ? "Gizlət" : "Aç"}
            </button>
          </div>

          {adminMode && (
            <form className="mt-5 space-y-3" onSubmit={onSubmit}>
              <input className="input" name="email" type="email" placeholder="Admin email" required />
              <input className="input" name="password" type="password" placeholder="Şifrə" required />
              <button className="btn-primary w-full" type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Gözləyin..." : "Admin daxil ol"}
              </button>
            </form>
          )}
        </aside>
      </div>
    </main>
  );
}