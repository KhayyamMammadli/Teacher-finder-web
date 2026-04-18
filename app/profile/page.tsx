"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfilePage() {
  const router = useRouter();
  const { token, init, ready } = useAuthStore();
  const [message, setMessage] = useState("");

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (ready && !token) {
      router.replace("/login");
    }
  }, [ready, token, router]);

  const profileQuery = useQuery({
    queryKey: ["my-profile", token],
    queryFn: () => getMyProfile(token || ""),
    enabled: Boolean(token),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { name: string; phone: string }) => updateMyProfile(token || "", payload),
    onSuccess: () => {
      setMessage("Profil yenilendi");
      profileQuery.refetch();
    },
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);
    updateMutation.mutate({
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
    });
  }

  const profile = profileQuery.data;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <div className="card">
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">Istifadeci melumatlarinizi yenileyin</p>

        {profile && (
          <form className="mt-5 space-y-3" onSubmit={onSubmit}>
            <input className="input" name="name" defaultValue={profile.name} required />
            <input className="input" name="phone" defaultValue={profile.phone || ""} />
            <input className="input bg-black/5" value={profile.email} disabled readOnly />

            <button className="btn-primary w-full" type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Yaddasda saxlanir..." : "Yenilikleri saxla"}
            </button>
          </form>
        )}

        {profileQuery.isLoading && <p className="mt-4 text-sm">Yuklenir...</p>}
        {profileQuery.isError && <p className="mt-4 text-sm text-red-700">Profil yuklenmedi.</p>}
        {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
      </div>
    </main>
  );
}
