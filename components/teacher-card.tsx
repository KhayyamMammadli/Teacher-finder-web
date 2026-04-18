import Image from "next/image";
import Link from "next/link";
import type { Teacher } from "@/lib/types";

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <article className="card group">
      <div className="relative h-44 w-full overflow-hidden rounded-2xl">
        <Image
          src={teacher.image}
          alt={teacher.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-[var(--ink)]">{teacher.name}</h3>
        <p className="text-sm text-[var(--ink-soft)]">
          {teacher.subject} - {teacher.location}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span>Rating {teacher.rating.toFixed(1)}</span>
          <span className="font-semibold">{teacher.price} AZN / saat</span>
        </div>
        {typeof teacher.distanceKm === "number" && (
          <p className="text-xs text-[var(--ink-soft)]">Approx distance: {teacher.distanceKm} km</p>
        )}
      </div>

      <Link
        href={`/teachers/${teacher.id}`}
        className="mt-4 inline-flex rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white"
      >
        View profile
      </Link>
    </article>
  );
}
