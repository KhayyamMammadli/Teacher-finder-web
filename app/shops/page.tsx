"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Shop } from "@/lib/types";
import { getShops } from "@/lib/api";

const CATEGORIES = [
  { key: "all", label: "Hamısı" },
  { key: "geyim", label: "👗 Geyim" },
  { key: "kosmetika", label: "💄 Kosmetika" },
  { key: "ayaqqabi", label: "👟 Ayaqqabı" },
  { key: "aksesuar", label: "💍 Aksesuar" },
  { key: "elektronika", label: "📱 Elektronika" },
  { key: "ev", label: "🏠 Ev & Bağ" },
  { key: "general", label: "🏪 Digər" },
];

function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/shops/${shop.id}`} className="card block group">
      <div className="h-36 w-full rounded-xl mb-3 bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] flex items-center justify-center overflow-hidden">
        {shop.logoUrl ? (
          <img src={shop.logoUrl} alt={shop.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl font-black text-white">{shop.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold group-hover:text-[var(--brand-strong)] transition-colors">{shop.name}</h3>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">{shop.location || "Bakı"}</p>
        </div>
        {shop.isFeatured && (
          <span className="shrink-0 rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">✦ Seçilmiş</span>
        )}
      </div>
      {shop.description && <p className="mt-2 text-xs text-[var(--ink-soft)] line-clamp-2">{shop.description}</p>}
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--ink-soft)]">
        {shop.productCount !== undefined && <span className="rounded-full bg-black/5 px-2 py-0.5">{shop.productCount} məhsul</span>}
        {shop.instagramUrl && <span className="rounded-full bg-pink-50 px-2 py-0.5 text-pink-600">📸 Instagram</span>}
        {shop.whatsapp && <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-600">💬 WhatsApp</span>}
      </div>
    </Link>
  );
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (category !== "all") params.category = category;
      if (query) params.search = query;
      const data = await getShops(params);
      setShops(data);
    } catch {
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => { load(); }, [load]);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black">Mağazalar</h1>
        <p className="text-[var(--ink-soft)] mt-1">Azərbaycanın Instagram mağazalarını kəşf et</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <input
          className="input flex-1"
          placeholder="Mağaza adı, məhsul, şəhər axtar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setQuery(search)}
        />
        <button className="btn-primary px-6" onClick={() => setQuery(search)}>Axtar</button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat.key
                ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                : "border-black/10 bg-white text-[var(--ink-soft)] hover:border-[var(--brand)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-36 rounded-xl bg-black/5 mb-3" />
              <div className="h-4 bg-black/5 rounded w-3/4 mb-2" />
              <div className="h-3 bg-black/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : shops.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
        </div>
      ) : (
        <div className="card text-center py-20 text-[var(--ink-soft)]">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold">Heç bir mağaza tapılmadı</p>
          <p className="text-sm mt-1">Axtarış parametrlərini dəyiş</p>
        </div>
      )}
    </main>
  );
}
