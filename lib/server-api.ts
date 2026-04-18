import type { Teacher } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export async function serverGetPopularSubjects() {
  const response = await fetch(`${API_BASE_URL}/api/teachers/subjects/popular`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return [] as string[];
  }
  const data = (await response.json()) as { items: string[] };
  return data.items;
}

export async function serverGetTopTeachers() {
  const response = await fetch(`${API_BASE_URL}/api/teachers/top`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return [] as Teacher[];
  }
  const data = (await response.json()) as { items: Teacher[] };
  return data.items;
}

export async function serverGetTeachers(query: URLSearchParams) {
  const response = await fetch(`${API_BASE_URL}/api/teachers?${query.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return { items: [] as Teacher[], total: 0 };
  }
  return (await response.json()) as { items: Teacher[]; total: number };
}

export async function serverGetTeacher(id: string, nextRevalidate?: number) {
  const response = await fetch(`${API_BASE_URL}/api/teachers/${id}`, {
    next: nextRevalidate ? { revalidate: nextRevalidate } : undefined,
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as Teacher;
}
