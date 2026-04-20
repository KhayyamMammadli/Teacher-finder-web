"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitOrder } from "@/lib/api";
import type { Product } from "@/lib/types";

export function OrderModal({
  shopId,
  product,
  onClose,
}: {
  shopId: string;
  product?: Product | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Ad tələb olunur"); return; }
    setLoading(true); setError("");
    try {
      await submitOrder({
        shopId,
        productId: product?.id,
        customerName: name.trim(),
        customerPhone: phone.trim() || undefined,
        customerInstagram: instagram.trim() || undefined,
        note: note.trim() || undefined,
      });
      setDone(true);
    } catch {
      setError("Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="card w-full max-w-md rounded-3xl p-6 animate-[liftIn_0.3s_ease]">
        {done ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-3">✅</p>
            <h3 className="text-xl font-bold">Sifarişiniz göndərildi!</h3>
            <p className="text-[var(--ink-soft)] mt-2 text-sm">Satıcı tezliklə sizinlə əlaqə saxlayacaq.</p>
            <button className="btn-primary mt-6 w-full" onClick={onClose}>Bağla</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">
                {product ? `Sifariş: ${product.name}` : "Sifariş / Sorğu"}
              </h3>
              <button onClick={onClose} className="text-[var(--ink-soft)] hover:text-[var(--ink)]">✕</button>
            </div>
            <form onSubmit={handle} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Adınız *</label>
                <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınızı yazın" />
              </div>
              <div>
                <label className="text-sm font-medium">Telefon</label>
                <input className="input mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+994 50 xxx xx xx" />
              </div>
              <div>
                <label className="text-sm font-medium">Instagram</label>
                <input className="input mt-1" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@username" />
              </div>
              <div>
                <label className="text-sm font-medium">Qeyd</label>
                <textarea className="input mt-1 resize-none" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ölçü, rəng, digər qeydlər..." />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button className="btn-primary w-full py-3" disabled={loading}>
                {loading ? "Göndərilir..." : "Sifariş göndər"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
