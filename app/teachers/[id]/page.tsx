import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookTeacherCta } from "@/components/book-teacher-cta";
import { serverGetTeacher, serverGetTopTeachers } from "@/lib/server-api";

export const revalidate = 300;

export async function generateStaticParams() {
  const teachers = await serverGetTopTeachers();
  return teachers.map((teacher) => ({ id: teacher.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const teacher = await serverGetTeacher(id, 300);

  if (!teacher) {
    return {
      title: "Muellim tapilmadi",
      description: "Axtarilan muellim profili movcud deyil.",
    };
  }

  return {
    title: `${teacher.name} | ${teacher.subject} muellimi`,
    description: `${teacher.name} ${teacher.location} seherinde ${teacher.subject} dersi kecir. Profili inceleyin ve rezerv edin.`,
    openGraph: {
      title: `${teacher.name} - TeacherFinder`,
      description: teacher.bio,
      images: [teacher.image],
    },
  };
}

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacher = await serverGetTeacher(id, 300);

  if (!teacher) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-5">
          <div className="card">
            <h1 className="text-3xl font-bold">{teacher.name}</h1>
            <p className="mt-2 text-[var(--ink-soft)]">{teacher.location}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span>Reytinq {teacher.rating.toFixed(1)}</span>
              <span>{teacher.price} AZN / saat</span>
              <span>{teacher.experienceYears} il tecrube</span>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold">Haqqinda</h2>
            <p className="mt-2 text-[var(--ink-soft)]">{teacher.bio}</p>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold">Fennler</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {teacher.subjects.map((item) => (
                <span key={item} className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold">Reyler</h2>
            <div className="mt-3 space-y-3">
              {teacher.reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-black/10 bg-white p-3">
                  <p className="font-semibold">{review.user}</p>
                  <p className="text-sm text-[var(--ink-soft)]">Reytinq {review.rating.toFixed(1)}</p>
                  <p className="mt-1 text-sm">{review.comment}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside>
          <BookTeacherCta teacherId={teacher.id} />
        </aside>
      </div>
    </main>
  );
}
