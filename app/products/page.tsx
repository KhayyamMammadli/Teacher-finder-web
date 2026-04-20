"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { searchProducts } from "@/lib/api";
import { OrderModal } from "@/components/order-modal";

const CATEGORIES = [
  { key: "all", label: "Hamısı" },
  { key: "geyim", label: "👗 Geyim" },
  { key: "kosmetika", label: "💄 Kosmetika" },
  { key: "ayaqqabi", label: "👟 Ayaqqabı" },
  { key: "aksesuar", label: "💍 Aksesuar" },
  { key: "elektronika", label: "📱 Elektronika" },
  { key: "ev", label: "🏠 Ev & Bağ" },
];

function ProductCard({ product, onOrder }: { product: Product; onOrder: (p: Product) => void }) {
  return (
    <div className="card flex flex-col">
      <div className="h-44 rounded-xl mb-3 bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl">🛍️</span>
        )}
      </div>
      <h4 className="font-semibold flex-1">{product.name}</h4>
      {product.description && <p className="text-xs text-[var(--ink-soft)] mt-1 line-clamp-2">{product.description}</p>}
      <div className="mt-2 text-xs text-[var(--ink-soft)]">
        {product.shopName && (
          <Link href={`/shops/${product.shopId}`} className="hover:text-[var(--brand-strong)]">
            🏪 {product.shopName}
          </Link>
        )}
        {product.shopLocation && <span className="ml-2">📍 {product.shopLocation}</span>}
      </div>
      <div className="mt-3 flex items-center justify-between">
        {product.price ? (
          <span className="font-bold text-[var(--brand-strong)]">{product.price} ₼</span>
        ) : (
          <span className="text-sm text-[var(--ink-soft)]">Razılaşma ilə</span>
        )}
        <div className="flex gap-2">
          {product.whatsapp && (
            <a
              href={`https://wa.me/${product.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600"
            >
              💬
            </a>
          )}
          <button onClick={() => onOrder(product)} className="btn-primary text-xs px-4 py-1.5">
            Sifariş et
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [orderProduct, setOrderProduct] = useState<Product | null | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (category !== "all") params.category = category;
      if (query) params.search = query;
      const data = await searchProducts(params);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => { load(); }, [load]);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black">Məhsul axtarışı</h1>
        <p className="text-[var(--ink-soft)] mt-1">Bütün mağazaların məhsullarında axtarış et</p>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          className="input flex-1"
          placeholder="Məhsul adı axtar... (qadın çantası, sneaker...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setQuery(search)}
        />
        <button className="btn-primary px-6" onClick={() => setQuery(search)}>Axtar</button>
      </div>

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-44 rounded-xl bg-black/5 mb-3" />
              <div className="h-4 bg-black/5 rounded w-3/4 mb-2" />
              <div className="h-3 bg-black/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onOrder={(p) => setOrderProduct(p)} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-20 text-[var(--ink-soft)]">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold">Heç bir məhsul tapılmadı</p>
          <p className="text-sm mt-1">Fərqli axtarış termini cəhd edin</p>
        </div>
      )}

      {orderProduct !== undefined && orderProduct !== null && (
        <OrderModal
          shopId={orderProduct.shopId}
          product={orderProduct}
          onClose={() => setOrderProduct(undefined)}
        />
      )}
    </main>
  );
}
