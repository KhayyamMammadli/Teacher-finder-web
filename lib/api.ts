import { apiClient } from "./api-client";
import { API_BASE_URL } from "./api-client";
import type { AuthUser, Shop, Product, Order } from "./types";

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>("/auth/login", { email, password });
  return data;
}

export async function getInstagramLoginUrl(state?: string) {
  const { data } = await apiClient.get<{ url: string }>("/auth/instagram/url", { params: state ? { state } : undefined });
  return data.url;
}

export async function exchangeInstagramAuthCode(authCode: string) {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>("/auth/instagram/exchange", { authCode });
  return data;
}

export function buildInstagramCallbackUrl() {
  return `${API_BASE_URL}/api/auth/instagram/callback`;
}

export async function sendRegisterOtp(email: string) {
  const { data } = await apiClient.post<{ message: string; devOtp?: string }>("/auth/send-register-otp", { email });
  return data;
}

export async function verifyRegisterOtp(payload: {
  name: string; email: string; password: string;
  role: "shop_owner"; phone?: string; otp: string;
}) {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>("/auth/verify-register-otp", payload);
  return data;
}

export async function getShops(params?: Record<string, string | number | undefined>) {
  const { data } = await apiClient.get<Shop[]>("/shops", { params });
  return data;
}

export async function getShop(id: string) {
  const { data } = await apiClient.get<Shop>(`/shops/${id}`);
  return data;
}

export async function getMyShop(token: string) {
  const { data } = await apiClient.get<Shop>("/shops/my", { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

export async function createShop(token: string, payload: Partial<Shop>) {
  const { data } = await apiClient.post<Shop>("/shops", payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

export async function updateShop(token: string, id: string, payload: Partial<Shop>) {
  const { data } = await apiClient.patch<Shop>(`/shops/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

export async function searchProducts(params?: Record<string, string | number | undefined>) {
  const { data } = await apiClient.get<Product[]>("/shops/products/search", { params });
  return data;
}

export async function createProduct(token: string, payload: Partial<Product> & { shopId: string }) {
  const { data } = await apiClient.post<Product>("/shops/products", payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

export async function updateProduct(token: string, id: string, payload: Partial<Product>) {
  const { data } = await apiClient.patch<Product>(`/shops/products/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

export async function deleteProduct(token: string, id: string) {
  await apiClient.delete(`/shops/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function submitOrder(payload: {
  shopId: string; productId?: string; customerName: string;
  customerPhone?: string; customerInstagram?: string; note?: string;
}) {
  const { data } = await apiClient.post<{ id: string; message: string }>("/orders", payload);
  return data;
}

export async function getMyOrders(token: string, params?: { status?: string }) {
  const { data } = await apiClient.get<Order[]>("/orders/my", { headers: { Authorization: `Bearer ${token}` }, params });
  return data;
}

export async function updateOrderStatus(token: string, id: string, status: string) {
  const { data } = await apiClient.patch<Order>(`/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

export async function getProfile(token: string) {
  const { data } = await apiClient.get("/profile", { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

export async function getMyProfile(token: string) {
  return getProfile(token);
}

export async function updateMyProfile(token: string, payload: { name?: string; phone?: string }) {
  const { data } = await apiClient.patch("/profile", payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}
