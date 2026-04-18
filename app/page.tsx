import Link from "next/link";
import { HeroSearch } from "@/components/hero-search";
import { TeacherCard } from "@/components/teacher-card";
import { serverGetPopularSubjects, serverGetTopTeachers } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [subjects, topTeachers] = await Promise.all([
    serverGetPopularSubjects(),
    serverGetTopTeachers(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="hero-gradient rounded-3xl p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-strong)]">Teacher Finder</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight text-[var(--ink)] sm:text-5xl">
          Hansi fenden guclu muellime ehtiyacin var?
        </h1>
        <p className="mt-4 max-w-2xl text-base text-[var(--ink-soft)] sm:text-lg">
          Bu platforma bir axin ucun qurulub: axtaris et, profil muqayise et, sonra bir klikle ders rezerv et.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--ink-soft)]">
          <span className="rounded-full bg-white/80 px-3 py-1">Canli reytinq ve yorumlar</span>
          <span className="rounded-full bg-white/80 px-3 py-1">Lokasiyaya gore siralama</span>
          <span className="rounded-full bg-white/80 px-3 py-1">Whatsapp ile birbasa elaqe</span>
        </div>
        <div className="mt-6 max-w-3xl">
          <HeroSearch />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Populyar fennler</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <Link
              key={subject}
              href={`/teachers?subject=${encodeURIComponent(subject)}`}
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-semibold"
            >
              {subject}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Top muellimler</h2>
          <Link href="/teachers" className="btn-secondary">
            Hamisini gor
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Muellim olmaq isteyirsiniz?</h2>
        <p className="mt-2 text-[var(--ink-soft)]">Platformaya qosulun, telebe muracietlerini idare edin ve profilinizi boyudun.</p>
        <Link href="/become-teacher" className="btn-primary mt-4 inline-flex">
          Muraciet et
        </Link>
      </section>
    </main>
  );
}
