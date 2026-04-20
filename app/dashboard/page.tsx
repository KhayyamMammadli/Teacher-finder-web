"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { getMyShop, getMyOrders, updateOrderStatus, createProduct, updateProduct, deleteProduct } from "@/lib/api";
import type { Shop, Product, Order, OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "🆕 Yeni",
  processing: "⚙️ Hazırlanır",
  shipped: "🚚 Göndərilib",
  delivered: "✅ Çatdırılıb",
  cancelled: "❌ Ləğv edilib",
};

const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = {
  new: "processing",
  processing: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
};

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, init, ready } = useAuthStore();
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"orders" | "products" | "shop">("orders");
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState<string>("all");

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("");
  const [pImage, setPImage] = useState("");
  const [pSaving, setPSaving] = useState(false);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (ready && !token) router.replace("/login");
  }, [ready, token, router]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [shopData, ordersData] = await Promise.all([
        getMyShop(token).catch(() => null),
        getMyOrders(token).catch(() => []),
      ]);
      setShop(shopData);
      setOrders(ordersData);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (ready && token) load(); }, [ready, token, load]);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    if (!token) return;
    try {
      const updated = await updateOrderStatus(token, orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch {}
  }

  function openProductForm(product?: Product) {
    setEditingProduct(product ?? null);
    setPName(product?.name ?? "");
    setPDesc(product?.description ?? "");
    setPPrice(product?.price?.toString() ?? "");
    setPCategory(product?.category ?? "");
    setPImage(product?.imageUrl ?? "");
    setShowProductForm(true);
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !shop) return;
    setPSaving(true);
    try {
      if (editingProduct) {
        const updated = await updateProduct(token, editingProduct.id, {
          name: pName, description: pDesc, price: pPrice ? Number(pPrice) : undefined,
          category: pCategory, imageUrl: pImage,
        });
        setShop((prev) => prev ? {
          ...prev,
          products: prev.products?.map((p) => p.id === updated.id ? updated : p),
        } : prev);
      } else {
        const created = await createProduct(token, {
          shopId: shop.id, name: pName, description: pDesc,
          price: pPrice ? Number(pPrice) : undefined, category: pCategory, imageUrl: pImage,
        });
        setShop((prev) => prev ? { ...prev, products: [created, ...(prev.products ?? [])] } : prev);
      }
      setShowProductForm(false);
    } catch {}
    setPSaving(false);
  }

  async function handleDeleteProduct(id: string) {
    if (!token || !confirm("Silmək istədiyinizə əminsiniz?")) return;
    await deleteProduct(token, id);
    setShop((prev) => prev ? { ...prev, products: prev.products?.filter((p) => p.id !== id) } : prev);
  }

  if (!ready || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center text-[var(--ink-soft)]">
          <p className="text-4xl mb-3 animate-pulse">🏪</p>
          <p>Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-5xl mb-4">🏪</p>
        <h1 className="text-2xl font-bold mb-2">Mağazanız yoxdur</h1>
        <p className="text-[var(--ink-soft)] mb-6">Platformaya qoşulmaq üçün mağaza açın</p>
        <Link href="/register-shop" className="btn-primary px-8 py-3 text-base">Mağaza aç 🚀</Link>
      </main>
    );
  }

  const filteredOrders = orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);
  const products = shop.products ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">{shop.name}</h1>
          <p className="text-sm text-[var(--ink-soft)]">Mağaza paneli</p>
        </div>
        <Link href={`/shops/${shop.id}`} className="btn-secondary text-sm">Mağazaya bax →</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Sifarişlər", value: orders.length },
          { label: "Yeni", value: orders.filter((o) => o.status === "new").length },
          { label: "Məhsullar", value: products.length },
        ].map((stat) => (
          <div key={stat.label} className="card text-center py-4">
            <p className="text-3xl font-black text-[var(--brand-strong)]">{stat.value}</p>
            <p className="text-xs text-[var(--ink-soft)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl border border-black/10 bg-white mb-6 w-fit">
        {(["orders", "products", "shop"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${tab === t ? "bg-[var(--brand)] text-white" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"}`}
          >
            {t === "orders" ? "📦 Sifarişlər" : t === "products" ? "🛍️ Məhsullar" : "⚙️ Mağaza"}
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {tab === "orders" && (
        <section>
          <div className="flex gap-2 flex-wrap mb-4">
            {["all", "new", "processing", "shipped", "delivered", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setOrderFilter(s)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${orderFilter === s ? "bg-[var(--brand)] border-[var(--brand)] text-white" : "border-black/10 text-[var(--ink-soft)]"}`}
              >
                {s === "all" ? "Hamısı" : STATUS_LABELS[s as OrderStatus]}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="card text-center py-12 text-[var(--ink-soft)]">
              <p className="text-3xl mb-2">📭</p>
              <p>Hələ ki sifariş yoxdur</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div key={order.id} className="card p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{order.customerName}</span>
                        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px]">
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      {order.productName && <p className="text-xs text-[var(--ink-soft)] mt-0.5">📦 {order.productName}</p>}
                      {order.customerPhone && <p className="text-xs text-[var(--ink-soft)]">📞 {order.customerPhone}</p>}
                      {order.customerInstagram && <p className="text-xs text-[var(--ink-soft)]">📸 {order.customerInstagram}</p>}
                      {order.note && <p className="text-xs text-[var(--ink-soft)] italic mt-1">"{order.note}"</p>}
                      <p className="text-[10px] text-[var(--ink-soft)] mt-1">{new Date(order.createdAt).toLocaleDateString("az-AZ")}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {STATUS_NEXT[order.status] && (
                        <button
                          onClick={() => handleStatusChange(order.id, STATUS_NEXT[order.status]!)}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          → {STATUS_LABELS[STATUS_NEXT[order.status]!]}
                        </button>
                      )}
                      {order.status !== "cancelled" && order.status !== "delivered" && (
                        <button
                          onClick={() => handleStatusChange(order.id, "cancelled")}
                          className="btn-secondary text-xs px-3 py-2 text-red-500"
                        >
                          Ləğv et
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* PRODUCTS TAB */}
      {tab === "products" && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Məhsullar ({products.length})</h2>
            <button onClick={() => openProductForm()} className="btn-primary text-sm px-5 py-2">+ Əlavə et</button>
          </div>

          {products.length === 0 ? (
            <div className="card text-center py-12 text-[var(--ink-soft)]">
              <p className="text-3xl mb-2">📦</p>
              <p>Hələ ki məhsul yoxdur</p>
              <button onClick={() => openProductForm()} className="btn-primary mt-4">İlk məhsulu əlavə et</button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="card flex items-center gap-4 p-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 flex items-center justify-center overflow-hidden shrink-0">
                    {product.imageUrl ? <img src={product.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl">🛍️</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{product.name}</p>
                    {product.price && <p className="text-sm text-[var(--brand-strong)] font-bold">{product.price} ₼</p>}
                    {product.category && <p className="text-xs text-[var(--ink-soft)]">{product.category}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openProductForm(product)} className="btn-secondary text-xs px-3 py-2">Düzəlt</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="btn-secondary text-xs px-3 py-2 text-red-500">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SHOP TAB */}
      {tab === "shop" && (
        <section className="card p-6 space-y-4">
          <h2 className="font-bold text-lg">Mağaza məlumatları</h2>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div><p className="text-[var(--ink-soft)]">Ad</p><p className="font-semibold">{shop.name}</p></div>
            <div><p className="text-[var(--ink-soft)]">Kateqoriya</p><p className="font-semibold">{shop.category}</p></div>
            <div><p className="text-[var(--ink-soft)]">Şəhər</p><p className="font-semibold">{shop.location || "—"}</p></div>
            <div><p className="text-[var(--ink-soft)]">WhatsApp</p><p className="font-semibold">{shop.whatsapp || "—"}</p></div>
            <div className="sm:col-span-2"><p className="text-[var(--ink-soft)]">Instagram</p>
              {shop.instagramUrl ? <a href={shop.instagramUrl} className="text-[var(--brand-strong)] underline" target="_blank" rel="noopener noreferrer">{shop.instagramUrl}</a> : <p>—</p>}
            </div>
            {shop.description && <div className="sm:col-span-2"><p className="text-[var(--ink-soft)]">Açıqlama</p><p>{shop.description}</p></div>}
            {shop.deliveryInfo && <div className="sm:col-span-2"><p className="text-[var(--ink-soft)]">Çatdırılma</p><p>{shop.deliveryInfo}</p></div>}
          </div>
          <p className="text-xs text-[var(--ink-soft)]">Mağaza məlumatlarını yeniləmək üçün admin ilə əlaqə saxlayın.</p>
        </section>
      )}

      {/* PRODUCT FORM MODAL */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editingProduct ? "Məhsulu düzəlt" : "Yeni məhsul"}</h3>
              <button onClick={() => setShowProductForm(false)} className="text-[var(--ink-soft)]">✕</button>
            </div>
            <form onSubmit={saveProduct} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Ad *</label>
                <input className="input mt-1" value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Məhsul adı" required />
              </div>
              <div>
                <label className="text-sm font-medium">Açıqlama</label>
                <textarea className="input mt-1 resize-none" rows={2} value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Məhsul haqqında..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Qiymət (₼)</label>
                  <input className="input mt-1" type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)} placeholder="25" />
                </div>
                <div>
                  <label className="text-sm font-medium">Kateqoriya</label>
                  <input className="input mt-1" value={pCategory} onChange={(e) => setPCategory(e.target.value)} placeholder="geyim" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Şəkil URL</label>
                <input className="input mt-1" value={pImage} onChange={(e) => setPImage(e.target.value)} placeholder="https://..." />
              </div>
              <button className="btn-primary w-full py-3" disabled={pSaving}>
                {pSaving ? "Saxlanılır..." : editingProduct ? "Yadda saxla" : "Əlavə et"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
