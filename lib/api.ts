import { apiClient } from "./api-client";
import type { AuthUser, Booking, Profile, Teacher } from "./types";

export async function getTopTeachers() {
  const { data } = await apiClient.get<{ items: Teacher[] }>("/teachers/top");
  return data.items;
}

export async function getPopularSubjects() {
  const { data } = await apiClient.get<{ items: string[] }>("/teachers/subjects/popular");
  return data.items;
}

export async function getTeachers(params: Record<string, string | number | undefined>) {
  const { data } = await apiClient.get<{ items: Teacher[]; total: number }>("/teachers", {
    params,
  });
  return data;
}

export async function getTeacher(id: string) {
  const { data } = await apiClient.get<Teacher>(`/teachers/${id}`);
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  phone?: string;
}) {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>("/auth/register", payload);
  return data;
}

export async function becomeTeacher(payload: {
  name: string;
  subjects: string[];
  experience: number;
  price: number;
  location: string;
}) {
  const { data } = await apiClient.post("/teachers/apply", payload);
  return data;
}

export async function createBooking(token: string, payload: { teacherId: string; note?: string }) {
  const { data } = await apiClient.post<Booking>("/bookings", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getBookings(token: string) {
  const { data } = await apiClient.get<{ items: Booking[] }>("/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.items;
}

export async function updateBookingStatus(token: string, id: string, status: "accepted" | "rejected") {
  const { data } = await apiClient.patch<Booking>(
    `/bookings/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export async function getMyProfile(token: string) {
  const { data } = await apiClient.get<Profile>("/profile/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function updateMyProfile(token: string, payload: { name: string; phone: string }) {
  const { data } = await apiClient.put<Profile>("/profile/me", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
