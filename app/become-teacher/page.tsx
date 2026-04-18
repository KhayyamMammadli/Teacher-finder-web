"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { becomeTeacher } from "@/lib/api";
import { locationOptions } from "@/lib/locations";

export default function BecomeTeacherPage() {
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: becomeTeacher,
    onSuccess: () => {
      setSuccess("Application submitted successfully.");
    },
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const subjects = String(formData.get("subjects") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    mutation.mutate({
      name: String(formData.get("name") || ""),
      subjects,
      experience: Number(formData.get("experience") || 0),
      price: Number(formData.get("price") || 0),
      location: String(formData.get("location") || ""),
    });
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <div className="card">
        <h1 className="text-3xl font-bold">Become a Teacher</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">Fill this form and we will contact you.</p>

        <form className="mt-5 space-y-3" onSubmit={onSubmit}>
          <input className="input" name="name" placeholder="Name" required />
          <input className="input" name="subjects" placeholder="Subjects (comma separated)" required />
          <input className="input" name="experience" type="number" min="0" placeholder="Experience (years)" required />
          <input className="input" name="price" type="number" min="0" placeholder="Price (AZN/hour)" required />
          <select className="input" name="location" required>
            {locationOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-primary w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        {success && <p className="mt-3 text-sm text-green-700">{success}</p>}
        {mutation.isError && <p className="mt-3 text-sm text-red-700">Submission failed.</p>}
      </div>
    </main>
  );
}
