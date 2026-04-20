"use client";

import { useState } from "react";
import Link from "next/link";
import type { Shop, Product } from "@/lib/types";
import { OrderModal } from "@/components/order-modal";

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
      <div className="mt-3 flex items-center justify-between">
        {product.price ? (
          <span className="font-bold text-[var(--brand-strong)]">{product.price} ₼</span>
        ) : (
          <span className="text-sm text-[var(--ink-soft)]">Qiymət razılaşma ilə</span>
        )}
        <button
          onClick={() => onOrder(product)}
          className="btn-primary text-xs px-4 py-2"
        >
          Sifariş et
        </button>
      </div>
    </div>
  );
}

export function ShopDetailClient({ shop }: { shop: Shop }) {
  const [orderProduct, setOrderProduct] = useState<Product | null | undefined>(undefined);
  const products = shop.products ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Shop header */}
      <div className="card mb-8 overflow-hidden p-0">
        {/* Cover */}
        <div className="h-40 bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] flex items-center justify-center overflow-hidden">
          {shop.coverUrl ? (
            <img src={shop.coverUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-7xl font-black text-white/20">{shop.name.charAt(0)}</span>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] flex items-center justify-center overflow-hidden shrink-0 -mt-10 border-4 border-white">
                {shop.logoUrl ? (
                  <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-white">{shop.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black">{shop.name}</h1>
                {shop.location && <p className="text-sm text-[var(--ink-soft)]">📍 {shop.location}</p>}
              </div>
            </div>
            {/* CTAs */}
            <div className="flex gap-2 flex-wrap">
              {shop.instagramUrl && (
                <a
                  href={shop.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <span>📸</span> Instagram
                </a>
              )}
              {shop.whatsapp && (
                <a
                  href={`https://wa.me/${shop.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <span>💬</span> WhatsApp
                </a>
              )}
              <button
                onClick={() => setOrderProduct(null)}
                className="btn-secondary text-sm"
              >
                📦 Sifariş göndər
              </button>
            </div>
          </div>

          {shop.description && <p className="mt-4 text-[var(--ink-soft)]">{shop.description}</p>}

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {shop.deliveryInfo && (
              <span className="rounded-full border border-black/10 px-3 py-1 text-[var(--ink-soft)]">
                🚚 {shop.deliveryInfo}
              </span>
            )}
            {shop.isFeatured && (
              <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 font-semibold text-[var(--accent)]">
                ✦ Seçilmiş mağaza
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Məhsullar
          {products.length > 0 && <span className="ml-2 text-sm font-normal text-[var(--ink-soft)]">({products.length})</span>}
        </h2>
        {products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onOrder={(p) => setOrderProduct(p)} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 text-[var(--ink-soft)]">
            <p className="text-3xl mb-2">📦</p>
            <p>Bu mağazada hələ məhsul yoxdur</p>
            {shop.instagramUrl && (
              <a href={shop.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-4 inline-flex text-sm">
                Instagram-da məhsullara bax
              </a>
            )}
          </div>
        )}
      </section>

      {orderProduct !== undefined && (
        <OrderModal
          shopId={shop.id}
          product={orderProduct}
          onClose={() => setOrderProduct(undefined)}
        />
      )}
    </main>
  );
}
