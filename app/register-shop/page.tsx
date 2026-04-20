"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { createShop } from "@/lib/api";

const CATEGORIES = [
  { key: "geyim", label: "👗 Geyim" },
  { key: "kosmetika", label: "💄 Kosmetika" },
  { key: "ayaqqabi", label: "👟 Ayaqqabı" },
  { key: "aksesuar", label: "💍 Aksesuar" },
  { key: "elektronika", label: "📱 Elektronika" },
  { key: "ev", label: "🏠 Ev & Bağ" },
  { key: "general", label: "🏪 Digər" },
];

export default function RegisterShopPage() {
  const router = useRouter();
  const { token, user, ready } = useAuthStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!instagramUrl && user?.instagramUsername) {
      setInstagramUrl(`https://instagram.com/${user.instagramUsername}`);
    }
  }, [instagramUrl, user?.instagramUsername]);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { router.push("/login"); return; }
    if (!name.trim()) { setError("Mağaza adı tələb olunur"); return; }
    if (!category) { setError("Kateqoriya seçin"); return; }

    setLoading(true); setError("");
    try {
      const shop = await createShop(token, {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        instagramUrl: instagramUrl.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        location: location.trim() || undefined,
        deliveryInfo: deliveryInfo.trim() || undefined,
      } as Parameters<typeof createShop>[1]);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return null;

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-4xl mb-4">🔐</p>
        <h1 className="text-2xl font-bold mb-2">Daxil olun</h1>
        <p className="text-[var(--ink-soft)] mb-6">Mağaza açmaq üçün əvvəlcə Instagram ilə daxil olun</p>
        <Link href="/login" className="btn-primary px-8 py-3">Instagram ilə daxil ol</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black">Mağaza aç</h1>
        <p className="text-[var(--ink-soft)] mt-1">Instagram hesabınız tanındı, indi mağaza vitrininizi tamamlayın</p>
      </div>

      <form onSubmit={handle} className="card space-y-5 p-6">
        <div>
          <label className="text-sm font-semibold">Mağaza adı *</label>
          <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Məs: Leyla Fashion" />
        </div>

        <div>
          <label className="text-sm font-semibold">Kateqoriya *</label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                className={`rounded-xl border p-2.5 text-sm text-left transition-colors ${
                  category === cat.key
                    ? "border-[var(--brand)] bg-[var(--brand)]/5 font-semibold text-[var(--brand-strong)]"
                    : "border-black/10 hover:border-[var(--brand)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Açıqlama</label>
          <textarea
            className="input mt-1 resize-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mağazanız haqqında qısa məlumat..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Instagram linki</label>
            <input className="input mt-1" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className="text-sm font-semibold">WhatsApp nömrəsi</label>
            <input className="input mt-1" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+994501234567" />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Şəhər / Ünvan</label>
          <input className="input mt-1" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Məs: Bakı, Nərimanov" />
        </div>

        <div>
          <label className="text-sm font-semibold">Çatdırılma məlumatı</label>
          <input className="input mt-1" value={deliveryInfo} onChange={(e) => setDeliveryInfo(e.target.value)} placeholder="Məs: Bütün rayonlara çatdırılır • 3-5 iş günü" />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <button className="btn-primary w-full py-3 text-base" disabled={loading}>
          {loading ? "Yaradılır..." : "Mağazanı aç 🚀"}
        </button>
      </form>
    </main>
  );
}
