import Link from "next/link";
import { serverGetFeaturedShops, serverGetShops } from "@/lib/server-api";
import type { Shop } from "@/lib/types";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { key: "geyim", label: "👗 Geyim" },
  { key: "kosmetika", label: "💄 Kosmetika" },
  { key: "ayaqqabi", label: "👟 Ayaqqabı" },
  { key: "aksesuar", label: "💍 Aksesuar" },
  { key: "elektronika", label: "📱 Elektronika" },
  { key: "ev", label: "🏠 Ev & Bağ" },
];

function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/shops/${shop.id}`} className="card block group">
      <div className="h-32 w-full rounded-xl mb-3 bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] flex items-center justify-center overflow-hidden">
        {shop.logoUrl ? (
          <img src={shop.logoUrl} alt={shop.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl font-black text-white">{shop.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-[var(--ink)] group-hover:text-[var(--brand-strong)] transition-colors">{shop.name}</h3>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">{shop.location || "Bakı"}</p>
        </div>
        {shop.isFeatured && (
          <span className="shrink-0 rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">✦ Seçilmiş</span>
        )}
      </div>
      {shop.description && <p className="mt-2 text-xs text-[var(--ink-soft)] line-clamp-2">{shop.description}</p>}
      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--ink-soft)]">
        {shop.productCount !== undefined && <span>{shop.productCount} məhsul</span>}
        {shop.instagramUrl && <span>📸 Instagram</span>}
        {shop.whatsapp && <span>💬 WhatsApp</span>}
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    serverGetFeaturedShops(),
    serverGetShops(new URLSearchParams({ limit: "12" })),
  ]);

  return (
    <main>
      <section className="hero-gradient mx-4 mt-6 rounded-3xl px-6 py-14 sm:mx-6 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-[var(--brand-strong)]">
            🛍️ Azərbaycanın Instagram mağazaları bir yerdə
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            Instagram mağazalarını<br />
            <span className="bg-gradient-to-r from-[var(--brand-strong)] to-[var(--accent)] bg-clip-text text-transparent">tap, sifariş ver</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--ink-soft)]">
            Geyim, kosmetika, elektronika — bütün kiçik bizneslər bir platformada. Filtrlə, axtar, WhatsApp ilə birbaşa sifariş et.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/shops" className="btn-primary text-base px-8 py-3">Mağazalara bax</Link>
            <Link href="/products" className="btn-secondary text-base px-8 py-3">Məhsul axtar</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Kateqoriyalar</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.key} href={`/shops?category=${cat.key}`} className="card text-center py-4 flex flex-col items-center gap-1 hover:border-[var(--brand)] transition-colors">
                <span className="text-2xl">{cat.label.split(" ")[0]}</span>
                <span className="text-xs font-semibold text-[var(--ink-soft)]">{cat.label.split(" ").slice(1).join(" ")}</span>
              </Link>
            ))}
          </div>
        </section>

        {featured.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">✦ Seçilmiş mağazalar</h2>
              <Link href="/shops?featured=true" className="text-sm text-[var(--brand-strong)] font-medium">Hamısına bax →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
            </div>
          </section>
        )}

        <section className="mt-12 mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🆕 Son əlavə olunan mağazalar</h2>
            <Link href="/shops" className="text-sm text-[var(--brand-strong)] font-medium">Hamısına bax →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
          </div>
          {!recent.length && (
            <div className="card text-center py-16 text-[var(--ink-soft)]">
              <p className="text-4xl mb-3">🛍️</p>
              <p className="font-semibold">Hələ ki mağaza yoxdur</p>
              <p className="text-sm mt-1">İlk siz əlavə edin!</p>
              <Link href="/register-shop" className="btn-primary mt-4 inline-flex">Instagram ilə satıcı ol</Link>
            </div>
          )}
        </section>

        <section className="mb-16 rounded-3xl border border-[var(--brand)]/10 bg-gradient-to-br from-[var(--brand)]/5 to-[var(--accent)]/5 p-8">
          <h2 className="text-xl font-bold mb-6 text-center">Necə işləyir?</h2>
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            {[
              { icon: "🔍", title: "Axtar", desc: "Kateqoriya, məhsul adı və ya mağaza adı ilə axtarış et" },
              { icon: "🛍️", title: "Seç", desc: "Mağaza profilinə bax, məhsulları gör, qiymətləri müqayisə et" },
              { icon: "📲", title: "Sifariş ver", desc: "WhatsApp və ya Instagram üzərindən birbaşa satıcıya müraciət et" },
            ].map((step) => (
              <div key={step.title}>
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-bold mb-1">{step.title}</h3>
                <p className="text-sm text-[var(--ink-soft)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
