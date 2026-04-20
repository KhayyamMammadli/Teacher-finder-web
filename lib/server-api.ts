import type { Shop, Product } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

async function safeFetch(url: string, init?: RequestInit) {
  try {
    return await fetch(url, init);
  } catch {
    return null;
  }
}

export async function serverGetFeaturedShops() {
  const response = await safeFetch(`${API_BASE_URL}/api/shops?featured=true&limit=6`, { cache: "no-store" });
  if (!response || !response.ok) return [] as Shop[];
  return (await response.json()) as Shop[];
}

export async function serverGetShops(params?: URLSearchParams) {
  const qs = params ? `?${params.toString()}` : "";
  const response = await safeFetch(`${API_BASE_URL}/api/shops${qs}`, { cache: "no-store" });
  if (!response || !response.ok) return [] as Shop[];
  return (await response.json()) as Shop[];
}

export async function serverGetShop(id: string) {
  const response = await safeFetch(`${API_BASE_URL}/api/shops/${id}`, { cache: "no-store" });
  if (!response || !response.ok) return null;
  return (await response.json()) as Shop;
}

export async function serverSearchProducts(params?: URLSearchParams) {
  const qs = params ? `?${params.toString()}` : "";
  const response = await safeFetch(`${API_BASE_URL}/api/shops/products/search${qs}`, { cache: "no-store" });
  if (!response || !response.ok) return [] as Product[];
  return (await response.json()) as Product[];
}
