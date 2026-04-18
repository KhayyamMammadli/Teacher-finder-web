import type { Metadata } from "next";
import { TeacherCard } from "@/components/teacher-card";
import { serverGetTeachers } from "@/lib/server-api";
import { locationCoords, locationOptions } from "@/lib/locations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Teachers",
  description: "Filter tutors by subject, location, rating, and price.",
};

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const key of ["subject", "location", "minPrice", "maxPrice", "rating", "lat", "lng"]) {
    const value = params[key];
    if (typeof value === "string" && value.length) {
      query.set(key, value);
    }
  }

  if (!query.get("lat") && !query.get("lng")) {
    const selectedLocation = query.get("location");
    if (selectedLocation && locationCoords[selectedLocation]) {
      query.set("lat", String(locationCoords[selectedLocation].lat));
      query.set("lng", String(locationCoords[selectedLocation].lng));
    }
  }

  const { items, total } = await serverGetTeachers(query);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Teachers List</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">{total} teacher found</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="card h-max">
          <h2 className="text-lg font-semibold">Filters</h2>
          <form className="mt-4 space-y-3" method="GET">
            <input name="subject" className="input" placeholder="Subject" defaultValue={String(params.subject || "")} />
            <select name="location" className="input" defaultValue={String(params.location || "") || ""}>
              <option value="">All locations</option>
              {locationOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                name="minPrice"
                type="number"
                className="input"
                placeholder="Min"
                defaultValue={String(params.minPrice || "")}
              />
              <input
                name="maxPrice"
                type="number"
                className="input"
                placeholder="Max"
                defaultValue={String(params.maxPrice || "")}
              />
            </div>
            <input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="input"
              placeholder="Min rating"
              defaultValue={String(params.rating || "")}
            />
            <button type="submit" className="btn-primary w-full">
              Apply Filters
            </button>
          </form>
        </aside>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
          {!items.length && <p>No teacher matches this filter.</p>}
        </section>
      </div>
    </main>
  );
}
