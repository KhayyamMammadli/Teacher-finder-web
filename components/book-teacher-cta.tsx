"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { createBooking } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export function BookTeacherCta({ teacherId }: { teacherId: string }) {
  const [note, setNote] = useState("");
  const { token, user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => createBooking(token || "", { teacherId, note }),
  });

  const whatsappLink = useMemo(
    () => `https://wa.me/994501112233?text=${encodeURIComponent("Salam, ders rezerv etmek isteyirem")}`,
    []
  );

  return (
    <div className="card space-y-3">
      <h3 className="text-xl font-semibold">Ders bron et</h3>
      {!user ? (
        <p className="text-sm text-[var(--ink-soft)]">
          Rezerv ucun evvelce <Link href="/login" className="underline">login</Link> edin.
        </p>
      ) : (
        <>
          <textarea
            className="input min-h-24"
            placeholder="Qisa qeyd yazin (isteye bagli)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Gonderilir..." : "Book dars"}
          </button>
          {mutation.isSuccess && <p className="text-sm text-green-700">Booking gonderildi.</p>}
          {mutation.isError && <p className="text-sm text-red-700">Booking ugursuz oldu.</p>}
        </>
      )}
      <a href={whatsappLink} className="btn-secondary block text-center" target="_blank" rel="noreferrer">
        WhatsApp ile elaqe
      </a>
    </div>
  );
}
