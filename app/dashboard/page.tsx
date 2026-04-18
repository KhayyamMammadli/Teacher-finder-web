"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings, updateBookingStatus } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, user, init, ready } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (ready && !token) {
      router.replace("/login");
    }
  }, [ready, token, router]);

  const bookingQuery = useQuery({
    queryKey: ["bookings", token],
    queryFn: () => getBookings(token || ""),
    enabled: Boolean(token),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "accepted" | "rejected" }) =>
      updateBookingStatus(token || "", id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", token] });
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        {user?.role === "teacher" ? "Incoming requests" : "Booking history"}
      </p>

      <section className="mt-6 space-y-3">
        {bookingQuery.data?.map((booking) => (
          <article key={booking.id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Booking #{booking.id}</p>
              <p className="text-sm text-[var(--ink-soft)]">Status: {booking.status}</p>
              {booking.note && <p className="text-sm text-[var(--ink-soft)]">Note: {booking.note}</p>}
            </div>

            {user?.role === "teacher" && booking.status === "pending" && (
              <div className="flex gap-2">
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => statusMutation.mutate({ id: booking.id, status: "accepted" })}
                >
                  Accept
                </button>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => statusMutation.mutate({ id: booking.id, status: "rejected" })}
                >
                  Reject
                </button>
              </div>
            )}
          </article>
        ))}

        {bookingQuery.isLoading && <p>Loading bookings...</p>}
        {bookingQuery.isError && <p>Could not load bookings.</p>}
      </section>
    </main>
  );
}
